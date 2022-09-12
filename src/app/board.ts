type StrictValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type Value = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | ' '

class Cell {
  value: Value
  rowIndex: number
  colIndex: number
  constructor(val: Value = ' ', rowIndex: number, colIndex: number) {
    this.value = val
    this.rowIndex = rowIndex
    this.colIndex = colIndex
  }
  fill(val: StrictValue) {
    this.value = val
  }
}

type Cells = Array<Cell>

type BoxLocation =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'middle-center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

function getRandInt(): Value {
  let val = Math.floor(Math.random() * 10)
  return val === 0 ? (1 as Value) : (val as Value)
}

export function getInitialCells() {
  let cells = []
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      cells.push(new Cell(undefined, i, j))
    }
  }
  return cells
}

function debugCells(cells: Cells) {
  console.log(`Board:\n`)
  console.log('-'.repeat(9 * 2 + 1))
  for (let i = 0; i < 9; i++) {
    let row = cells
      .filter((c: Cell) => c.rowIndex === i)
      .sort((a: Cell, b: Cell) => {
        return a.colIndex < b.colIndex ? -1 : 1
      })
    console.log(
      row.reduce((t: string, c: Cell): string => `${t}${c.value}|`, '|'),
    )
    console.log('-'.repeat(9 * 2 + 1))
  }
}

function debugBox(box: any) {
  console.log(`Box:\n`)
  console.log('-'.repeat(7))
  for (let i = 0; i < 3; i++) {
    let row = box
      .filter((c: Cell) => c.rowIndex === i)
      .sort((a: Cell, b: Cell) => {
        return a.colIndex < b.colIndex ? -1 : 1
      })
    console.log(
      row.reduce((t: string, c: Cell): string => `${t}${c.value}|`, '|'),
    )
    console.log('-'.repeat(7))
  }
}

function getBox(box: BoxLocation, cells: Cells) {
  switch (box) {
    case 'top-left': {
      return [
        cells.filter((c) => c.rowIndex === 0).find((c) => c.colIndex === 0),
        cells.filter((c) => c.rowIndex === 0).find((c) => c.colIndex === 1),
        cells.filter((c) => c.rowIndex === 0).find((c) => c.colIndex === 2),
        cells.filter((c) => c.rowIndex === 1).find((c) => c.colIndex === 0),
        cells.filter((c) => c.rowIndex === 1).find((c) => c.colIndex === 1),
        cells.filter((c) => c.rowIndex === 1).find((c) => c.colIndex === 2),
        cells.filter((c) => c.rowIndex === 2).find((c) => c.colIndex === 0),
        cells.filter((c) => c.rowIndex === 2).find((c) => c.colIndex === 1),
        cells.filter((c) => c.rowIndex === 2).find((c) => c.colIndex === 2),
      ]
    }
    case 'top-center': {
      return [
        cells.filter((c) => c.rowIndex === 0).find((c) => c.colIndex === 3),
        cells.filter((c) => c.rowIndex === 0).find((c) => c.colIndex === 4),
        cells.filter((c) => c.rowIndex === 0).find((c) => c.colIndex === 5),
        cells.filter((c) => c.rowIndex === 1).find((c) => c.colIndex === 3),
        cells.filter((c) => c.rowIndex === 1).find((c) => c.colIndex === 4),
        cells.filter((c) => c.rowIndex === 1).find((c) => c.colIndex === 5),
        cells.filter((c) => c.rowIndex === 2).find((c) => c.colIndex === 3),
        cells.filter((c) => c.rowIndex === 2).find((c) => c.colIndex === 4),
        cells.filter((c) => c.rowIndex === 2).find((c) => c.colIndex === 5),
      ]
    }
    case 'top-right': {
      return [
        cells.filter((c) => c.rowIndex === 0).find((c) => c.colIndex === 6),
        cells.filter((c) => c.rowIndex === 0).find((c) => c.colIndex === 7),
        cells.filter((c) => c.rowIndex === 0).find((c) => c.colIndex === 8),
        cells.filter((c) => c.rowIndex === 1).find((c) => c.colIndex === 6),
        cells.filter((c) => c.rowIndex === 1).find((c) => c.colIndex === 7),
        cells.filter((c) => c.rowIndex === 1).find((c) => c.colIndex === 8),
        cells.filter((c) => c.rowIndex === 2).find((c) => c.colIndex === 6),
        cells.filter((c) => c.rowIndex === 2).find((c) => c.colIndex === 7),
        cells.filter((c) => c.rowIndex === 2).find((c) => c.colIndex === 8),
      ]
    }
    case 'middle-left': {
      return [
        cells.filter((c) => c.rowIndex === 3).find((c) => c.colIndex === 0),
        cells.filter((c) => c.rowIndex === 3).find((c) => c.colIndex === 1),
        cells.filter((c) => c.rowIndex === 3).find((c) => c.colIndex === 2),
        cells.filter((c) => c.rowIndex === 4).find((c) => c.colIndex === 0),
        cells.filter((c) => c.rowIndex === 4).find((c) => c.colIndex === 1),
        cells.filter((c) => c.rowIndex === 4).find((c) => c.colIndex === 2),
        cells.filter((c) => c.rowIndex === 5).find((c) => c.colIndex === 0),
        cells.filter((c) => c.rowIndex === 5).find((c) => c.colIndex === 1),
        cells.filter((c) => c.rowIndex === 5).find((c) => c.colIndex === 2),
      ]
    }
    case 'middle-center': {
      return [
        cells.filter((c) => c.rowIndex === 3).find((c) => c.colIndex === 3),
        cells.filter((c) => c.rowIndex === 3).find((c) => c.colIndex === 4),
        cells.filter((c) => c.rowIndex === 3).find((c) => c.colIndex === 5),
        cells.filter((c) => c.rowIndex === 4).find((c) => c.colIndex === 3),
        cells.filter((c) => c.rowIndex === 4).find((c) => c.colIndex === 4),
        cells.filter((c) => c.rowIndex === 4).find((c) => c.colIndex === 5),
        cells.filter((c) => c.rowIndex === 5).find((c) => c.colIndex === 3),
        cells.filter((c) => c.rowIndex === 5).find((c) => c.colIndex === 4),
        cells.filter((c) => c.rowIndex === 5).find((c) => c.colIndex === 5),
      ]
    }
    case 'middle-right': {
      return [
        cells.filter((c) => c.rowIndex === 3).find((c) => c.colIndex === 6),
        cells.filter((c) => c.rowIndex === 3).find((c) => c.colIndex === 7),
        cells.filter((c) => c.rowIndex === 3).find((c) => c.colIndex === 8),
        cells.filter((c) => c.rowIndex === 4).find((c) => c.colIndex === 6),
        cells.filter((c) => c.rowIndex === 4).find((c) => c.colIndex === 7),
        cells.filter((c) => c.rowIndex === 4).find((c) => c.colIndex === 8),
        cells.filter((c) => c.rowIndex === 5).find((c) => c.colIndex === 6),
        cells.filter((c) => c.rowIndex === 5).find((c) => c.colIndex === 7),
        cells.filter((c) => c.rowIndex === 5).find((c) => c.colIndex === 8),
      ]
    }
    case 'bottom-left': {
      return [
        cells.filter((c) => c.rowIndex === 6).find((c) => c.colIndex === 0),
        cells.filter((c) => c.rowIndex === 6).find((c) => c.colIndex === 1),
        cells.filter((c) => c.rowIndex === 6).find((c) => c.colIndex === 2),
        cells.filter((c) => c.rowIndex === 7).find((c) => c.colIndex === 0),
        cells.filter((c) => c.rowIndex === 7).find((c) => c.colIndex === 1),
        cells.filter((c) => c.rowIndex === 7).find((c) => c.colIndex === 2),
        cells.filter((c) => c.rowIndex === 8).find((c) => c.colIndex === 0),
        cells.filter((c) => c.rowIndex === 8).find((c) => c.colIndex === 1),
        cells.filter((c) => c.rowIndex === 8).find((c) => c.colIndex === 2),
      ]
    }
    case 'bottom-center': {
      return [
        cells.filter((c) => c.rowIndex === 6).find((c) => c.colIndex === 3),
        cells.filter((c) => c.rowIndex === 6).find((c) => c.colIndex === 4),
        cells.filter((c) => c.rowIndex === 6).find((c) => c.colIndex === 5),
        cells.filter((c) => c.rowIndex === 7).find((c) => c.colIndex === 3),
        cells.filter((c) => c.rowIndex === 7).find((c) => c.colIndex === 4),
        cells.filter((c) => c.rowIndex === 7).find((c) => c.colIndex === 5),
        cells.filter((c) => c.rowIndex === 8).find((c) => c.colIndex === 3),
        cells.filter((c) => c.rowIndex === 8).find((c) => c.colIndex === 4),
        cells.filter((c) => c.rowIndex === 8).find((c) => c.colIndex === 5),
      ]
    }
    case 'bottom-right': {
      return [
        cells.filter((c) => c.rowIndex === 6).find((c) => c.colIndex === 6),
        cells.filter((c) => c.rowIndex === 6).find((c) => c.colIndex === 7),
        cells.filter((c) => c.rowIndex === 6).find((c) => c.colIndex === 8),
        cells.filter((c) => c.rowIndex === 7).find((c) => c.colIndex === 6),
        cells.filter((c) => c.rowIndex === 7).find((c) => c.colIndex === 7),
        cells.filter((c) => c.rowIndex === 7).find((c) => c.colIndex === 8),
        cells.filter((c) => c.rowIndex === 8).find((c) => c.colIndex === 6),
        cells.filter((c) => c.rowIndex === 8).find((c) => c.colIndex === 7),
        cells.filter((c) => c.rowIndex === 8).find((c) => c.colIndex === 8),
      ]
    }
    default: {
      throw new Error('Invalid box to get from board!')
    }
  }
}

// let cells = getInitialCells()

// debugBox(getBox('top-left', cells))

// debugCells(cells)
