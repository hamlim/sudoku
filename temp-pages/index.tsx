// import {Box} from '@ds-pack/components'
import { getInitialCells, seedBoard } from '../app/board-utils'
import Board from '../app/Board.client'

export default function Index({ initialBoard }) {
  // console.log({initialBoard})
  return <Board initialBoard={initialBoard} />
}

export async function getServerSideProps() {
  // let initialBoard = getInitialCells()
  return {
    props: {
      initialBoard: seedBoard,
    },
  }
}
