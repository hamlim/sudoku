'client'
import {Box} from '@ds-pack/components'
import { useState } from 'react'

export default function Board({ initialBoard }) {
  let [board, setBoard] = useState(initialBoard)

  return <Box is="pre">{JSON.stringify(board, null, 2)}</Box>
}
