import { experimental_use as use } from 'react'
import Board from '../components/Board.client'
import { getInitialCells } from '../lib/board-utils'

export default function Page() {
  let { initialBoard } = use(getProps())
  console.log(initialBoard)
  return <Board initialBoard={initialBoard} />
  // return <div>Yo</div>
}

async function getProps() {
  let initialBoard = getInitialCells()
  return {
    initialBoard,
  }
}
