
import React, { useCallback, useRef, useState } from "react";
import produce from "immer";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var numRows = 25;
var numCols = numRows;
// const speed = 100;
var sparsity = 0.7;

var operations = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

var resetGrid = function resetGrid() {
  return Array.from({ length: numRows }).map(function () {
    return Array.from({ length: numCols }).fill(0);
  }, 0);
};

var seedGrid = function seedGrid() {
  var rows = [];
  for (var i = 0; i < numRows; ++i) {
    rows.push(Array.from(Array(numCols), function () {
      return Math.random() > sparsity ? 1 : 0;
    }));
  }
  return rows;
};

var countNeighbors = function countNeighbors(grid, x, y) {
  return operations.reduce(function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        i = _ref2[0],
        j = _ref2[1];

    var row = (x + i + numRows) % numRows;
    var col = (y + j + numCols) % numCols;
    acc += grid[row][col];
    return acc;
  }, 0);
};

var App = function App() {
  var _useState = useState(function () {
    return resetGrid();
  }),
      _useState2 = _slicedToArray(_useState, 2),
      grid = _useState2[0],
      setGrid = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      running = _useState4[0],
      setRunning = _useState4[1];

  var _useState5 = useState(0),
      _useState6 = _slicedToArray(_useState5, 2),
      generation = _useState6[0],
      setGeneration = _useState6[1];

  var runningRef = useRef(running);
  runningRef.current = running;

  var generationRef = useRef(generation);
  generationRef.current = generation;

  var _useState7 = useState(250),
      _useState8 = _slicedToArray(_useState7, 2),
      speed = _useState8[0],
      setSpeed = _useState8[1];

  var runSimulation = useCallback(function () {
    var runner = function runner() {
      if (!runningRef.current) {
        return;
      }

      setGrid(function (currentGrid) {
        return produce(currentGrid, function (gridCopy) {
          for (var i = 0; i < numRows; i++) {
            for (var j = 0; j < numCols; j++) {
              var count = countNeighbors(currentGrid, i, j);
              if (currentGrid[i][j] === 1 && (count < 2 || count > 3)) gridCopy[i][j] = 0;
              if (!currentGrid[i][j] && count === 3) gridCopy[i][j] = 1;
            }
          }
        });
      });
      setGeneration(++generationRef.current);
      setTimeout(runner, speed);
    };
    setTimeout(runner, speed);
  }, [speed]);

  return React.createElement(
    "div",
    {
      style: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50% , -50%)"
      }
    },
    React.createElement(
      "button",
      {
        onClick: function onClick() {
          setRunning(!running);
          runningRef.current = !running;
          if (!running) {
            runSimulation();
          }
        }
      },
      !running ? "Start" : "Stop"
    ),
    React.createElement(
      "button",
      {
        onClick: function onClick() {
          setGrid(resetGrid());
          setGeneration(0);
        }
      },
      "Clear"
    ),
    React.createElement(
      "button",
      {
        onClick: function onClick() {
          setGrid(seedGrid());
        }
      },
      "Seed"
    ),
    React.createElement(
      "span",
      { style: { clear: "both", marginLeft: "20px" } },
      React.createElement(
        "label",
        {
          htmlFor: "range",
          style: {
            display: "inline-block",
            width: "100%",
            maxWidth: "100px",
            marginTop: "10px"
          }
        },
        React.createElement("input", {
          onChange: function onChange(event) {
            return setSpeed(event.target.value);
          },
          type: "range",
          name: "speed",
          min: "50",
          max: "500",
          step: "25",
          id: "range",
          defaultValue: "250",
          style: { display: "inline-block", position: "relative" }
        }),
        "Speed: ",
        speed
      ),
      React.createElement(
        "span",
        null,
        "To change speed, you must stop and start the grid"
      )
    ),
    React.createElement(
      "p",
      null,
      "Generation: ",
      generation
    ),
    React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(" + numCols + ", 20px)"
        }
      },
      grid.map(function (rows, rowIdx) {
        return rows.map(function (col, colIdx) {
          return React.createElement("div", {
            key: rowIdx + "-" + colIdx,
            onClick: function onClick() {
              var newGrid = produce(grid, function (gridCopy) {
                gridCopy[rowIdx][colIdx] = grid[rowIdx][colIdx] ? 0 : 1;
              });
              setGrid(newGrid);
            },
            style: {
              width: 20,
              height: 20,
              backgroundColor: grid[rowIdx][colIdx] ? "#246EB9" : "#eee",
              border: "1px solid black"
            }
          });
        });
      })
    )
  );
};

export default App;