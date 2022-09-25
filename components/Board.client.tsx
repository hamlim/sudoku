'client'
import { Box } from '@ds-pack/components'
import { useState } from 'react'

export default function Board({ initialBoard }) {
  let [board, setBoard] = useState(initialBoard)

  return (
    <Box
      border="solid 1px"
      color="$black"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(9, 1fr)',
        gridTemplateRows: 'repeat(9, 1fr)',
      }}
    >
      {board.map((cell) => (
        <Box
          border="solid 1px"
          color="black"
          key={`${cell.value}${cell.rowIndex}${cell.colIndex}`}
          fontSize="3"
        >
          {cell.value}
        </Box>
      ))}
    </Box>
  )
}
