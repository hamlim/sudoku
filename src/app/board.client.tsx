'client-entry'

import { useState } from 'react'

export default function Board({ initialBoard }) {
  let [board, setBoard] = useState(initialBoard)

  return <pre>{JSON.stringify(board, null, 2)}</pre>
}
