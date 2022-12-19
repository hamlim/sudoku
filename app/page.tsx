import { use } from 'react'
import Board from '../components/Board.client'
import { getInitialCells, seedBoard } from '../lib/board-utils'
import { Box } from '@ds-pack/components'

export default function Page() {
  let { initialBoard } = use(getProps())
  // console.log(initialBoard)
  return (
    <>
      <Box margin="0 auto">
        <Board initialBoard={initialBoard} />
      </Box>
    </>
  )
}

async function getProps() {
  // let initialBoard = getInitialCells()
  return {
    initialBoard: seedBoard,
  }
}
