import React, { useCallback, useRef, useState } from "react";
import produce from "immer";

const numRows = 25;
const numCols = numRows;
// const speed = 100;
const sparsity = 0.7;

const operations = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const resetGrid = () =>
  Array.from({ length: numRows }).map(
    () => Array.from({ length: numCols }).fill(0),
    0
  );

const seedGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; ++i) {
    rows.push(
      Array.from(Array(numCols), () => (Math.random() > sparsity ? 1 : 0))
    );
  }
  return rows;
};

const countNeighbors = (grid, x, y) => {
  return operations.reduce((acc, [i, j]) => {
    const row = (x + i + numRows) % numRows;
    const col = (y + j + numCols) % numCols;
    acc += grid[row][col];
    return acc;
  }, 0);
};

const App = () => {
  const [grid, setGrid] = useState(() => resetGrid());

  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);

  const runningRef = useRef(running);
  runningRef.current = running;

  const generationRef = useRef(generation);
  generationRef.current = generation;

  const [speed, setSpeed] = useState(250);

  const runSimulation = useCallback(() => {
    const runner = () => {
      if (!runningRef.current) {
        return;
      }

      setGrid((currentGrid) =>
        produce(currentGrid, (gridCopy) => {
          for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
              const count = countNeighbors(currentGrid, i, j);
              if (currentGrid[i][j] === 1 && (count < 2 || count > 3))
                gridCopy[i][j] = 0;
              if (!currentGrid[i][j] && count === 3) gridCopy[i][j] = 1;
            }
          }
        })
      );
      setGeneration(++generationRef.current);
      setTimeout(runner, speed);
    };
    setTimeout(runner, speed);
  }, [speed]);

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50% , -50%)",
      }}
    >
      <button
        onClick={() => {
          setRunning(!running);
          runningRef.current = !running;
          if (!running) {
            runSimulation();
          }
        }}
      >
        {!running ? "Start" : "Stop"}
      </button>
      <button
        onClick={() => {
          setGrid(resetGrid());
          setGeneration(0);
        }}
      >
        Clear
      </button>
      <button
        onClick={() => {
          setGrid(seedGrid());
        }}
      >
        Seed
      </button>

      <span style={{ clear: "both", marginLeft: "20px" }}>
        <label
          htmlFor="range"
          style={{
            display: "inline-block",
            width: "100%",
            maxWidth: "100px",
            marginTop: "10px",
          }}
        >
          <input
            onChange={(event) => setSpeed(event.target.value)}
            type="range"
            name="speed"
            min="50"
            max="500"
            step="25"
            id="range"
            defaultValue="250"
            style={{ display: "inline-block", position: "relative" }}
          />
          Speed: {speed}
        </label>
        <span>To change speed, you must stop and start the grid</span>
      </span>

      <p>Generation: {generation}</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, rowIdx) =>
          rows.map((col, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[rowIdx][colIdx] = grid[rowIdx][colIdx] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[rowIdx][colIdx] ? "#246EB9" : "#eee",
                border: "1px solid black",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default App;
