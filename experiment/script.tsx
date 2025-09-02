/// <reference lib="dom" />
// @ts-nocheck

import { useCallback, useEffect, useReducer } from "react";
import { createRoot } from "react-dom/client";

// @TODO add caching
async function loadPuzzels(chunkNum) {
  let res = await fetch(`/data/chunk_${chunkNum}.csv`);
  let text = await res.text();
  let rows = text.split("\n");
  let puzzels = rows.map((row) =>
    row.split(",").map((puzzelOrSolution) => puzzelOrSolution.split("")),
  );
  return puzzels;
}

let puzzelCollection = await loadPuzzels("001");

// State shape
const initialState = {
  cells: new Map(),
  focusedCells: [],
  highlightedCells: [], // cells highlighted due to same value
  mode: "edit", // "edit" or "notes"
  puzzle: null,
  solution: null,
  history: [],
  historyIndex: -1,
  debug: {
    showDebug: false,
    eventLog: [],
  },
};

// Actions
const actions = {
  INIT_PUZZLE: "INIT_PUZZLE",
  TOGGLE_CELL_FOCUS: "TOGGLE_CELL_FOCUS",
  SET_CELL_VALUE: "SET_CELL_VALUE",
  CLEAR_CELL: "CLEAR_CELL",
  FOCUS_SAME_VALUE: "FOCUS_SAME_VALUE",
  NAVIGATE: "NAVIGATE",
  CLEAR_FOCUS: "CLEAR_FOCUS",
  SET_FOCUS: "SET_FOCUS",
  SET_MODE: "SET_MODE",
  UNDO: "UNDO",
  REDO: "REDO",
  TOGGLE_DEBUG: "TOGGLE_DEBUG",
  LOAD_FROM_STORAGE: "LOAD_FROM_STORAGE",
  NEW_GAME: "NEW_GAME",
  CLEAR_HIGHLIGHTS: "CLEAR_HIGHLIGHTS",
};

// localStorage utilities
const STORAGE_KEY = "sudoku-game-state";

function saveToStorage(state) {
  try {
    const stateToSave = {
      cells: Array.from(state.cells.entries()), // Convert Map to array
      focusedCells: state.focusedCells,
      mode: state.mode,
      history: state.history.map((h) => ({
        cells: Array.from(h.cells.entries()),
        focusedCells: h.focusedCells,
      })),
      historyIndex: state.historyIndex,
      puzzle: state.puzzle,
      solution: state.solution,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (error) {
    console.warn("Failed to save to localStorage:", error);
  }
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    return {
      ...parsed,
      cells: new Map(parsed.cells), // Convert array back to Map
      history: parsed.history.map((h) => ({
        cells: new Map(h.cells),
        focusedCells: h.focusedCells,
      })),
    };
  } catch (error) {
    console.warn("Failed to load from localStorage:", error);
    return null;
  }
}

function logEvent(state, actionType, payload = null, details = null) {
  const timestamp = new Date().toLocaleTimeString();
  const event = {
    timestamp,
    action: actionType,
    payload,
    details,
    focusedCells: [...state.focusedCells],
    mode: state.mode,
  };

  return {
    ...state.debug,
    eventLog: [...state.debug.eventLog.slice(-19), event], // Keep last 20 events
  };
}

function gameReducerCore(state, action) {
  switch (action.type) {
    case actions.INIT_PUZZLE: {
      const { puzzle, solution } = action.payload;
      const cells = new Map();

      for (let cellIndex = 0; cellIndex < puzzle.length; cellIndex++) {
        const cell = puzzle[cellIndex];
        cells.set(cellIndex, {
          writable: cell === "0",
          value: cell === "0" ? "" : cell,
          valid: cell !== "0",
          solution: solution[cellIndex],
          notes: [],
          history: [],
        });
      }

      return {
        ...state,
        cells,
        puzzle,
        solution,
        focusedCells: [],
      };
    }

    case actions.TOGGLE_CELL_FOCUS: {
      const { cellIndex, shiftKey } = action.payload;
      let newFocusedCells = [...state.focusedCells];

      if (newFocusedCells.includes(cellIndex)) {
        newFocusedCells = newFocusedCells.filter((idx) => idx !== cellIndex);
      } else {
        if (!shiftKey) {
          newFocusedCells = [cellIndex];
        } else {
          newFocusedCells.push(cellIndex);
        }
      }

      return {
        ...state,
        focusedCells: newFocusedCells,
        highlightedCells: [], // Clear highlights when focusing cells normally
        debug: logEvent(state, action.type, action.payload, {
          newFocusedCells,
        }),
      };
    }

    case actions.SET_CELL_VALUE: {
      const { value } = action.payload;
      const newCells = new Map(state.cells);
      let allValid = true;
      let hasChanges = false;

      for (const cellIndex of state.focusedCells) {
        const cell = newCells.get(cellIndex);
        if (cell?.writable) {
          if (state.mode === "edit") {
            // Edit mode - set the actual value
            if (cell.value !== value) {
              hasChanges = true;
              const newCell = {
                ...cell,
                value,
                valid: value === cell.solution,
                notes: [],
              };
              newCells.set(cellIndex, newCell);

              // Clear the same value from notes in related cells
              const relatedCells = getAllRelatedCells(cellIndex);
              relatedCells.forEach((relatedIndex) => {
                const relatedCell = newCells.get(relatedIndex);
                if (relatedCell?.notes.includes(value)) {
                  const updatedNotes = relatedCell.notes.filter(
                    (note) => note !== value,
                  );
                  newCells.set(relatedIndex, {
                    ...relatedCell,
                    notes: updatedNotes,
                  });
                }
              });
            }
          } else if (state.mode === "notes") {
            // Notes mode - toggle the note
            const newNotes = [...cell.notes];
            const noteIndex = newNotes.indexOf(value);
            if (noteIndex > -1) {
              newNotes.splice(noteIndex, 1);
            } else {
              newNotes.push(value);
              newNotes.sort();
            }
            if (JSON.stringify(newNotes) !== JSON.stringify(cell.notes)) {
              hasChanges = true;
              newCells.set(cellIndex, {
                ...cell,
                notes: newNotes,
              });
            }
          }
        }
      }

      if (!hasChanges) return state;

      // Check if all cells are valid
      for (const cell of newCells.values()) {
        if (!cell.valid) {
          allValid = false;
          break;
        }
      }

      // Save to history
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({
        cells: new Map(state.cells),
        focusedCells: [...state.focusedCells],
      });

      const newState = {
        ...state,
        cells: newCells,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        // Keep focused cells unchanged to maintain focus after entering values
        debug: logEvent(state, action.type, action.payload, {
          hasChanges,
          mode: state.mode,
        }),
      };

      if (allValid && state.mode === "edit") {
        setTimeout(() => alert("You win!"), 0);
      }

      return newState;
    }

    case actions.CLEAR_CELL: {
      const newCells = new Map(state.cells);
      let hasChanges = false;

      for (const cellIndex of state.focusedCells) {
        const cell = newCells.get(cellIndex);
        if (cell?.writable) {
          const hasContent = cell.value !== "" || cell.notes.length > 0;
          if (hasContent) {
            hasChanges = true;
            newCells.set(cellIndex, {
              ...cell,
              value: "",
              valid: false,
              notes: [],
            });
          }
        }
      }

      if (!hasChanges) return state;

      // Save to history
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({
        cells: new Map(state.cells),
        focusedCells: [...state.focusedCells],
      });

      return {
        ...state,
        cells: newCells,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        debug: logEvent(state, action.type, action.payload, { hasChanges }),
      };
    }

    case actions.FOCUS_SAME_VALUE: {
      const { value, cellIndex } = action.payload;
      const newFocusedCells = [];
      const newHighlightedCells = [];

      // Focus cells with the same value
      for (const [idx, cell] of state.cells) {
        if (cell.value === value) {
          newFocusedCells.push(idx);
        }
      }

      // Highlight related cells (same row, column, box) to show constraint areas
      if (cellIndex !== undefined) {
        const relatedCells = getAllRelatedCells(cellIndex);
        newHighlightedCells.push(...relatedCells);
      }

      return {
        ...state,
        focusedCells: newFocusedCells,
        highlightedCells: newHighlightedCells,
      };
    }

    case actions.NAVIGATE: {
      const { direction, currentIndex, shiftKey } = action.payload;
      let newIndex;

      switch (direction) {
        case "ArrowUp":
          newIndex = currentIndex - 9;
          break;
        case "ArrowDown":
          newIndex = currentIndex + 9;
          break;
        case "ArrowLeft":
          newIndex = currentIndex - 1;
          break;
        case "ArrowRight":
          newIndex = currentIndex + 1;
          break;
        default:
          return state;
      }

      if (
        newIndex < 0 ||
        newIndex >= state.cells.size ||
        !state.cells.has(newIndex)
      ) {
        return state;
      }

      let newFocusedCells;
      if (shiftKey) {
        newFocusedCells = [...state.focusedCells];
        if (!newFocusedCells.includes(newIndex)) {
          newFocusedCells.push(newIndex);
        }
      } else {
        newFocusedCells = [newIndex];
      }

      return { ...state, focusedCells: newFocusedCells };
    }

    case actions.CLEAR_FOCUS: {
      return { ...state, focusedCells: [] };
    }

    case actions.SET_FOCUS: {
      const { cellIndex } = action.payload;
      return { ...state, focusedCells: [cellIndex] };
    }

    case actions.SET_MODE: {
      const { mode } = action.payload;
      return {
        ...state,
        mode,
        debug: logEvent(state, action.type, action.payload),
      };
    }

    case actions.TOGGLE_DEBUG: {
      return {
        ...state,
        debug: {
          ...state.debug,
          showDebug: !state.debug.showDebug,
        },
      };
    }

    case actions.LOAD_FROM_STORAGE: {
      const { savedState } = action.payload;
      return {
        ...state,
        ...savedState,
        debug: state.debug, // Keep current debug state
      };
    }

    case actions.NEW_GAME: {
      // Clear localStorage
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.warn("Failed to clear localStorage:", error);
      }

      // Reset to initial state with new puzzle
      const { puzzle, solution } = action.payload;
      const cells = new Map();

      for (let cellIndex = 0; cellIndex < puzzle.length; cellIndex++) {
        const cell = puzzle[cellIndex];
        cells.set(cellIndex, {
          writable: cell === "0",
          value: cell === "0" ? "" : cell,
          valid: cell !== "0",
          solution: solution[cellIndex],
          notes: [],
          history: [],
        });
      }

      return {
        ...initialState,
        cells,
        puzzle,
        solution,
        debug: state.debug, // Keep current debug state
      };
    }

    case actions.CLEAR_HIGHLIGHTS: {
      return {
        ...state,
        highlightedCells: [],
      };
    }

    case actions.UNDO: {
      if (state.historyIndex < 0) return state;

      const prevState = state.history[state.historyIndex];
      return {
        ...state,
        cells: new Map(prevState.cells),
        focusedCells: [...prevState.focusedCells],
        historyIndex: state.historyIndex - 1,
      };
    }

    case actions.REDO: {
      if (state.historyIndex >= state.history.length - 1) return state;

      const nextState = state.history[state.historyIndex + 1];
      return {
        ...state,
        cells: new Map(nextState.cells),
        focusedCells: [...nextState.focusedCells],
        historyIndex: state.historyIndex + 1,
      };
    }

    default:
      return state;
  }
}

// Wrapper reducer that handles localStorage
function gameReducer(state, action) {
  const newState = gameReducerCore(state, action);

  // Save to localStorage for actions that change game state (not debug actions)
  if (
    newState !== state &&
    action.type !== actions.TOGGLE_DEBUG &&
    action.type !== actions.LOAD_FROM_STORAGE
  ) {
    saveToStorage(newState);
  }

  return newState;
}

// Utils
function isNumeric(key) {
  return /^[1-9]$/.test(key);
}

// Sudoku grid utilities (9x9 grid)
function getCellRow(cellIndex) {
  return Math.floor(cellIndex / 9);
}

function getCellCol(cellIndex) {
  return cellIndex % 9;
}

function getCellBox(cellIndex) {
  const row = getCellRow(cellIndex);
  const col = getCellCol(cellIndex);
  return Math.floor(row / 3) * 3 + Math.floor(col / 3);
}

function getCellsInSameRow(cellIndex) {
  const row = getCellRow(cellIndex);
  const cells = [];
  for (let col = 0; col < 9; col++) {
    cells.push(row * 9 + col);
  }
  return cells;
}

function getCellsInSameCol(cellIndex) {
  const col = getCellCol(cellIndex);
  const cells = [];
  for (let row = 0; row < 9; row++) {
    cells.push(row * 9 + col);
  }
  return cells;
}

function getCellsInSameBox(cellIndex) {
  const box = getCellBox(cellIndex);
  const startRow = Math.floor(box / 3) * 3;
  const startCol = (box % 3) * 3;
  const cells = [];

  for (let row = startRow; row < startRow + 3; row++) {
    for (let col = startCol; col < startCol + 3; col++) {
      cells.push(row * 9 + col);
    }
  }
  return cells;
}

function getAllRelatedCells(cellIndex) {
  const related = new Set();
  getCellsInSameRow(cellIndex).forEach((idx) => related.add(idx));
  getCellsInSameCol(cellIndex).forEach((idx) => related.add(idx));
  getCellsInSameBox(cellIndex).forEach((idx) => related.add(idx));
  return Array.from(related);
}

function countDigitOccurrences(cells, digit) {
  let count = 0;
  for (const cell of cells.values()) {
    if (cell.value === digit) {
      count++;
    }
  }
  return count;
}

function DebugSidebar({ state, dispatch }) {
  const _recentEventIndex = state.debug.eventLog.length - 1;

  return (
    <div className={`debug-sidebar ${state.debug.showDebug ? "show" : ""}`}>
      <div className="debug-section">
        <h3>Current State</h3>
        <div className="debug-state-item">
          <span className="debug-state-key">Mode:</span> {state.mode}
        </div>
        <div className="debug-state-item">
          <span className="debug-state-key">Focused Cells:</span> [
          {state.focusedCells.join(", ")}]
        </div>
        <div className="debug-state-item">
          <span className="debug-state-key">History Index:</span>{" "}
          {state.historyIndex}
        </div>
        <div className="debug-state-item">
          <span className="debug-state-key">Total History:</span>{" "}
          {state.history.length}
        </div>
      </div>

      <div className="debug-section">
        <h3>Recent Events ({state.debug.eventLog.length})</h3>
        {state.debug.eventLog
          .slice()
          .reverse()
          .map((event, index) => (
            <div
              key={`${event.timestamp}-${index}`}
              className={`debug-event ${index === 0 ? "recent" : ""}`}
            >
              <div className="debug-event-header">
                {event.timestamp} - {event.action}
              </div>
              <div className="debug-event-details">
                Mode: {event.mode} | Focus: [{event.focusedCells.join(", ")}]
                {event.payload && (
                  <div>Payload: {JSON.stringify(event.payload)}</div>
                )}
                {event.details && (
                  <div>Details: {JSON.stringify(event.details)}</div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function Cell({
  cellIndex,
  cell,
  isFocused,
  isHighlighted,
  onCellClick,
  onCellDoubleClick,
}) {
  const totalNotes = cell.notes.length;
  const hasValue = cell.value !== "";

  return (
    <div
      className={`cell ${isFocused ? "focused" : ""} ${isHighlighted ? "highlighted" : ""}`}
      tabIndex="0"
      role="button"
      aria-label={`Cell ${cellIndex}`}
      data-index={cellIndex}
      data-writable={cell.writable}
      data-note-count={totalNotes}
      onClick={onCellClick}
      onDoubleClick={onCellDoubleClick}
    >
      <div className="cell-content">
        {hasValue
          ? cell.value
          : cell.notes.length > 0 && (
              <div className="cell-notes">
                {cell.notes.map((note) => (
                  <span key={note}>{note}</span>
                ))}
              </div>
            )}
      </div>
    </div>
  );
}

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    // Try to load saved state first
    const savedState = loadFromStorage();
    if (savedState) {
      dispatch({
        type: actions.LOAD_FROM_STORAGE,
        payload: { savedState },
      });
    } else if (puzzelCollection?.[0]) {
      // If no saved state, initialize with new puzzle
      const [puzzle, solution] = puzzelCollection[0];
      dispatch({
        type: actions.INIT_PUZZLE,
        payload: { puzzle, solution },
      });
    }
  }, []);

  const handleCellClick = useCallback((cellIndex, shiftKey) => {
    dispatch({
      type: actions.TOGGLE_CELL_FOCUS,
      payload: { cellIndex, shiftKey },
    });
  }, []);

  const handleCellDoubleClick = useCallback(
    (cellIndex) => {
      const cell = state.cells.get(cellIndex);
      if (cell?.value) {
        dispatch({
          type: actions.FOCUS_SAME_VALUE,
          payload: { value: cell.value, cellIndex },
        });
      }
    },
    [state.cells],
  );

  // Global keyboard event listener for undo/redo and number input
  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      // Handle undo/redo shortcuts
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "z" &&
        !event.shiftKey
      ) {
        event.preventDefault();
        dispatch({ type: actions.UNDO });
        return;
      } else if (
        (event.ctrlKey || event.metaKey) &&
        (event.key === "y" || (event.key === "z" && event.shiftKey))
      ) {
        event.preventDefault();
        dispatch({ type: actions.REDO });
        return;
      }

      // Handle mode switching shortcuts (global)
      switch (event.key.toLowerCase()) {
        case "e":
          if (state.mode !== "edit") {
            event.preventDefault();
            dispatch({
              type: actions.SET_MODE,
              payload: { mode: "edit" },
            });
          }
          break;
        case "n":
          if (state.mode !== "notes") {
            event.preventDefault();
            dispatch({
              type: actions.SET_MODE,
              payload: { mode: "notes" },
            });
          }
          break;
      }

      // Handle number input and navigation if we have focused cells
      if (state.focusedCells.length > 0) {
        switch (event.key) {
          case "ArrowUp":
          case "ArrowDown":
          case "ArrowLeft":
          case "ArrowRight": {
            event.preventDefault();
            const currentIndex =
              state.focusedCells[state.focusedCells.length - 1];
            dispatch({
              type: actions.NAVIGATE,
              payload: {
                direction: event.key,
                currentIndex: currentIndex,
                shiftKey: event.shiftKey,
              },
            });
            break;
          }
          case "Delete":
          case "Backspace":
            event.preventDefault();
            dispatch({ type: actions.CLEAR_CELL });
            break;
          default:
            if (isNumeric(event.key)) {
              event.preventDefault();
              // Check if this digit is already complete (all 9 instances placed)
              const isComplete =
                countDigitOccurrences(state.cells, event.key) >= 9;
              if (!isComplete) {
                dispatch({
                  type: actions.SET_CELL_VALUE,
                  payload: { value: event.key },
                });
              }
            }
            break;
        }
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [state.focusedCells, state.mode, state.cells]);

  // Add body class for debug layout
  useEffect(() => {
    if (state.debug.showDebug) {
      document.body.classList.add("debug-open");
    } else {
      document.body.classList.remove("debug-open");
    }
    return () => document.body.classList.remove("debug-open");
  }, [state.debug.showDebug]);

  // Clear highlights when clicking outside cells
  useEffect(() => {
    const handleClick = (event) => {
      if (
        !event.target.classList.contains("cell") &&
        state.highlightedCells.length > 0
      ) {
        dispatch({ type: actions.CLEAR_HIGHLIGHTS });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [state.highlightedCells]);

  const handleNumberpadClick = useCallback(
    (number) => {
      // This check is redundant since button will be disabled, but good for safety
      const isComplete = countDigitOccurrences(state.cells, number) >= 9;
      if (!isComplete) {
        dispatch({
          type: actions.SET_CELL_VALUE,
          payload: { value: number },
        });
      }
    },
    [state.cells],
  );

  const handleModeToggle = useCallback((newMode) => {
    dispatch({
      type: actions.SET_MODE,
      payload: { mode: newMode },
    });
  }, []);

  if (!state.cells.size) {
    return <div className="board">Loading...</div>;
  }

  const cellElements = [];
  for (let cellIndex = 0; cellIndex < state.cells.size; cellIndex++) {
    const cell = state.cells.get(cellIndex);
    const isFocused = state.focusedCells.includes(cellIndex);
    const isHighlighted = state.highlightedCells.includes(cellIndex);

    cellElements.push(
      <Cell
        key={cellIndex}
        cellIndex={cellIndex}
        cell={cell}
        isFocused={isFocused}
        isHighlighted={isHighlighted}
        onCellClick={(event) => handleCellClick(cellIndex, event.shiftKey)}
        onCellDoubleClick={() => handleCellDoubleClick(cellIndex)}
      />,
    );
  }

  return (
    <>
      <button
        type="button"
        className="debug-toggle"
        onClick={() => dispatch({ type: actions.TOGGLE_DEBUG })}
      >
        {state.debug?.showDebug ? "✕" : "🐛"}
      </button>

      <DebugSidebar state={state} dispatch={dispatch} />

      <div className="board">{cellElements}</div>
      <div className="controls">
        <div className="numberpad-row">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            const isComplete =
              countDigitOccurrences(state.cells, num.toString()) >= 9;
            return (
              <button
                type="button"
                key={num}
                className="numberpad-btn"
                onClick={() => handleNumberpadClick(num.toString())}
                disabled={isComplete}
                title={
                  isComplete
                    ? `All 9 instances of ${num} are placed`
                    : `Place ${num}`
                }
              >
                {num}
              </button>
            );
          })}
        </div>
        <div className="note-toggle-row">
          <button
            type="button"
            className={`note-toggle-btn ${state.mode === "edit" ? "active" : ""}`}
            onClick={() => handleModeToggle("edit")}
          >
            Edit (E)
          </button>
          <button
            type="button"
            className={`note-toggle-btn ${state.mode === "notes" ? "active" : ""}`}
            onClick={() => handleModeToggle("notes")}
          >
            Notes (N)
          </button>
        </div>
        <div className="note-toggle-row">
          <button
            className="note-toggle-btn"
            type="button"
            onClick={() => dispatch({ type: actions.UNDO })}
            disabled={state.historyIndex < 0}
          >
            Undo (⌘Z)
          </button>
          <button
            className="note-toggle-btn"
            type="button"
            onClick={() => dispatch({ type: actions.REDO })}
            disabled={state.historyIndex >= state.history.length - 1}
          >
            Redo (⌘⇧Z)
          </button>
          <button
            className="note-toggle-btn"
            type="button"
            onClick={() => {
              if (puzzelCollection?.[0]) {
                const [puzzle, solution] = puzzelCollection[0];
                dispatch({
                  type: actions.NEW_GAME,
                  payload: { puzzle, solution },
                });
              }
            }}
          >
            New Game
          </button>
        </div>
      </div>
    </>
  );
}

let loaded = false;
function onLoad() {
  if (!loaded) {
    loaded = true;
    createRoot(document.querySelector("#root")).render(<App />);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  onLoad();
});

if (document.readyState === "complete") {
  onLoad();
}
