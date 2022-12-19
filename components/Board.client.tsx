'use client'
import { Box, Tapable } from '@ds-pack/components'
import { useEffect, useReducer, useMemo } from 'react'
import { handleKey, KeyCode } from '../lib/useKeyHandler'
import {
  cell as sudokuCell,
  board as sudokuBoard,
  isActive,
  cellPencilMarks,
  pencilMark,
} from '@styles/Board'
import { cx } from '../lib/classnames'
import { Cell } from '../lib/board-utils'

enum Mode {
  EDITING = 'editing',
  PENCIL = 'pencil',
  CLEARING = 'clearing',
}

interface CellLike {
  value: string
  rowIndex: number
  colIndex: number
  active: boolean
}

interface State {
  mode: Mode
  board: Array<Cell>
}

type Action =
  | {
      action: 'edit-mode'
      mode: Mode
    }
  | {
      action: 'click-cell'
      cell: Cell
    }
  | {
      action: 'edit-cell'
      cell: Cell
      key: typeof sudokuNumbers[number]
    }
  | {
      action: 'clear-cell'
      cell: Cell
    }
  | {
      action: 'undo-cell'
      cell: Cell
    }
  | {
      action: 'redo-cell'
      cell: Cell
    }

function reducer(state: State, action: Action) {
  switch (action.action) {
    case 'edit-mode': {
      switch (action.mode) {
        case Mode.PENCIL: {
          return {
            ...state,
            mode: 'pencil',
          }
        }
        case Mode.CLEARING: {
          return {
            ...state,
            mode: 'clear',
          }
        }
        case Mode.EDITING: {
          return {
            ...state,
            mode: 'editing',
          }
        }
        default: {
          return {
            ...state,
            mode: 'editing',
          }
        }
      }
    }
    case 'click-cell': {
      return {
        ...state,
        board: state.board.map((cell) => {
          if (
            cell.rowIndex === action.cell.rowIndex &&
            cell.colIndex === action.cell.colIndex
          ) {
            cell.setActive()
          } else if (cell.active) {
            cell.setInactive()
          }
          return cell
        }),
      }
    }
    case 'edit-cell': {
      return {
        ...state,
        board: state.board.map((cell) => {
          if (
            cell.rowIndex === action.cell.rowIndex &&
            cell.colIndex === action.cell.colIndex
          ) {
            if (state.mode === Mode.EDITING) {
              cell.fill(action.key)
            } else if (state.mode === Mode.PENCIL) {
              cell.pencil(action.key)
            }
          }
          return cell
        }),
      }
    }
    case 'clear-cell': {
      return {
        ...state,
        board: state.board.map((cell) => {
          if (
            cell.rowIndex === action.cell.rowIndex &&
            cell.colIndex === action.cell.colIndex
          ) {
            cell.fill(' ')
          }
          return cell
        }),
      }
    }
    case 'undo-cell': {
      return {
        ...state,
        board: state.board.map((cell) => {
          if (
            cell.rowIndex === action.cell.rowIndex &&
            cell.colIndex === action.cell.colIndex
          ) {
            cell.undo()
          }
          return cell
        }),
      }
    }
    case 'redo-cell': {
      return {
        ...state,
        board: state.board.map((cell) => {
          if (
            cell.rowIndex === action.cell.rowIndex &&
            cell.colIndex === action.cell.colIndex
          ) {
            cell.redo()
          }
          return cell
        }),
      }
    }
  }
}

let sudokuNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

export default function Board({ initialBoard }) {
  let board = useMemo(() => {
    return initialBoard.map(
      (cell: CellLike) => new Cell(cell.value, cell.rowIndex, cell.colIndex),
    )
  }, [initialBoard])
  let [state, dispatch] = useReducer(reducer, {
    mode: 'editing',
    board,
  })

  useEffect(() => {
    let pencilHandler = handleKey(KeyCode.PENCIL, () => {
      dispatch({
        action: 'edit-mode',
        mode: Mode.PENCIL,
      })
    })
    let clearingHandler = handleKey(KeyCode.CLEAR, () => {
      dispatch({
        action: 'edit-mode',
        mode: Mode.CLEARING,
      })
    })
    let editingHandler = handleKey(KeyCode.EDIT, () => {
      dispatch({
        action: 'edit-mode',
        mode: Mode.EDITING,
      })
    })

    window.addEventListener('keydown', pencilHandler)
    window.addEventListener('keydown', clearingHandler)
    window.addEventListener('keydown', editingHandler)

    return () => {
      window.removeEventListener('keydown', pencilHandler)
      window.removeEventListener('keydown', clearingHandler)
      window.removeEventListener('keydown', editingHandler)
    }
  }, [])

  return (
    <>
      <div className={sudokuBoard}>
        {state.board.map((cell) => (
          <Box
            border="solid 2px"
            color="black"
            key={`${cell.value}${cell.rowIndex}${cell.colIndex}`}
            fontSize="4"
            textAlign="center"
            is={Tapable}
            onClick={() => {
              dispatch({
                action: 'click-cell',
                cell: cell,
              })
            }}
            autoFocus={cell.active}
            onKeyDown={(event: KeyboardEvent) => {
              if (event.key === 'Tab') {
                return
              }
              if (event.key === 'z' && event.metaKey && event.shiftKey) {
                dispatch({
                  action: 'redo-cell',
                  cell,
                })
                return
              }
              if (event.key === 'z' && event.metaKey) {
                dispatch({
                  action: 'undo-cell',
                  cell,
                })
                return
              }
              if (sudokuNumbers.includes(event.key)) {
                dispatch({
                  action: 'edit-cell',
                  cell,
                  key: event.key,
                })
              } else if (event.key === 'Backspace') {
                dispatch({
                  action: 'clear-cell',
                  cell,
                })
              }
            }}
            className={cx({
              [sudokuCell]: true,
              [isActive]: cell.active,
            })}
          >
            {cell.value}
            {cell.pencilMarks.length > 0 ? (
              <span className={cellPencilMarks}>
                {cell.pencilMarks
                  .sort((a, b) => (Number(a) < Number(b) ? -1 : 1))
                  .map((pencil) => {
                    return (
                      <span key={pencil} className={pencilMark}>
                        {pencil}
                      </span>
                    )
                  })}
              </span>
            ) : null}
          </Box>
        ))}
      </div>
    </>
  )
}
