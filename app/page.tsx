import { experimental_use as use } from 'react'
import Board from './Board.client'
import { getInitialCells } from './board-utils'

export default function Page() {
  let {initialBoard} = use(getProps())
  // console.log(initialBoard)
  return <Board initialBoard={initialBoard} />
}

async function getProps() {
  let initialBoard = getInitialCells()
  return {
    initialBoard,
  }
}
