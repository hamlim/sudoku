'server-entry'

import Board from './Board.client'
import { getInitialCells } from './board'

export default function Page({ initialBoard }) {
  console.log(initialBoard)
  return <Board initialBoard={initialBoard} />
}

export async function getServerSideProps() {
  let initialBoard = getInitialCells()
  return {
    props: {
      initialBoard,
    },
  }
}
