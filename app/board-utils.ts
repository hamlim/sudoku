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

// |-------|-------|-------|
// | 1 2 3 | 4 5 6 | 7 8 9 |
// | 4 5 6 | 7 8 9 | 1 2 3 |
// | 7 8 9 | 1 2 3 | 4 5 6 |
// |-------|-------|-------|
// | 2 3 4 | 5 6 7 | 8 9 1 |
// | 5 6 7 | 8 9 1 | 2 3 4 |
// | 8 9 1 | 2 3 4 | 5 6 7 |
// |-------|-------|-------|
// | 3 4 5 | 6 7 8 | 9 1 2 |
// | 6 7 8 | 9 1 2 | 3 4 5 |
// | 9 1 2 | 3 4 5 | 6 7 8 |
// |-------|-------|-------|
export let seedBoard = [
  { value: 1, rowIndex: 1, colIndex: 1},
  { value: 2, rowIndex: 1, colIndex: 2},
  { value: 3, rowIndex: 1, colIndex: 3},
  { value: 4, rowIndex: 1, colIndex: 4},
  { value: 5, rowIndex: 1, colIndex: 5},
  { value: 6, rowIndex: 1, colIndex: 6},
  { value: 7, rowIndex: 1, colIndex: 7},
  { value: 8, rowIndex: 1, colIndex: 8},
  { value: 9, rowIndex: 1, colIndex: 9},
  { value: 4, rowIndex: 2, colIndex: 1},
  { value: 5, rowIndex: 2, colIndex: 2},
  { value: 6, rowIndex: 2, colIndex: 3},
  { value: 7, rowIndex: 2, colIndex: 4},
  { value: 8, rowIndex: 2, colIndex: 5},
  { value: 9, rowIndex: 2, colIndex: 6},
  { value: 1, rowIndex: 2, colIndex: 7},
  { value: 2, rowIndex: 2, colIndex: 8},
  { value: 3, rowIndex: 2, colIndex: 9},
  { value: 7, rowIndex: 3, colIndex: 1},
  { value: 8, rowIndex: 3, colIndex: 2},
  { value: 9, rowIndex: 3, colIndex: 3},
  { value: 1, rowIndex: 3, colIndex: 4},
  { value: 2, rowIndex: 3, colIndex: 5},
  { value: 3, rowIndex: 3, colIndex: 6},
  { value: 4, rowIndex: 3, colIndex: 7},
  { value: 5, rowIndex: 3, colIndex: 8},
  { value: 6, rowIndex: 3, colIndex: 9},
  { value: 2, rowIndex: 4, colIndex: 1},
  { value: 3, rowIndex: 4, colIndex: 2},
  { value: 4, rowIndex: 4, colIndex: 3},
  { value: 5, rowIndex: 4, colIndex: 4},
  { value: 6, rowIndex: 4, colIndex: 5},
  { value: 7, rowIndex: 4, colIndex: 6},
  { value: 8, rowIndex: 4, colIndex: 7},
  { value: 9, rowIndex: 4, colIndex: 8},
  { value: 1, rowIndex: 4, colIndex: 9},
  { value: 5, rowIndex: 5, colIndex: 1},
  { value: 6, rowIndex: 5, colIndex: 2},
  { value: 7, rowIndex: 5, colIndex: 3},
  { value: 8, rowIndex: 5, colIndex: 4},
  { value: 9, rowIndex: 5, colIndex: 5},
  { value: 1, rowIndex: 5, colIndex: 6},
  { value: 2, rowIndex: 5, colIndex: 7},
  { value: 3, rowIndex: 5, colIndex: 8},
  { value: 4, rowIndex: 5, colIndex: 9},
  { value: 8, rowIndex: 6, colIndex: 1},
  { value: 9, rowIndex: 6, colIndex: 2},
  { value: 1, rowIndex: 6, colIndex: 3},
  { value: 2, rowIndex: 6, colIndex: 4},
  { value: 3, rowIndex: 6, colIndex: 5},
  { value: 4, rowIndex: 6, colIndex: 6},
  { value: 5, rowIndex: 6, colIndex: 7},
  { value: 6, rowIndex: 6, colIndex: 8},
  { value: 7, rowIndex: 6, colIndex: 9},
  { value: 3, rowIndex: 7, colIndex: 1},
  { value: 4, rowIndex: 7, colIndex: 2},
  { value: 5, rowIndex: 7, colIndex: 3},
  { value: 6, rowIndex: 7, colIndex: 4},
  { value: 7, rowIndex: 7, colIndex: 5},
  { value: 8, rowIndex: 7, colIndex: 6},
  { value: 9, rowIndex: 7, colIndex: 7},
  { value: 1, rowIndex: 7, colIndex: 8},
  { value: 2, rowIndex: 7, colIndex: 9},
  { value: 6, rowIndex: 8, colIndex: 1},
  { value: 7, rowIndex: 8, colIndex: 2},
  { value: 8, rowIndex: 8, colIndex: 3},
  { value: 9, rowIndex: 8, colIndex: 4},
  { value: 1, rowIndex: 8, colIndex: 5},
  { value: 2, rowIndex: 8, colIndex: 6},
  { value: 3, rowIndex: 8, colIndex: 7},
  { value: 4, rowIndex: 8, colIndex: 8},
  { value: 5, rowIndex: 8, colIndex: 9},
  { value: 9, rowIndex: 9, colIndex: 1},
  { value: 1, rowIndex: 9, colIndex: 2},
  { value: 2, rowIndex: 9, colIndex: 3},
  { value: 3, rowIndex: 9, colIndex: 4},
  { value: 4, rowIndex: 9, colIndex: 5},
  { value: 5, rowIndex: 9, colIndex: 6},
  { value: 6, rowIndex: 9, colIndex: 7},
  { value: 7, rowIndex: 9, colIndex: 8},
  { value: 8, rowIndex: 9, colIndex: 9},
]

export function getInitialCells() {
  let cells = []
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      // cells.push(new Cell(undefined, i, j))
      cells.push({
        value: 0,
        rowIndex: i,
        colIndex: j
      })
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
