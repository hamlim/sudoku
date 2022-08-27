import { useState } from 'react'

let initialBoard = [[], [], [], [], [], [], [], [], []]

export default function Board() {
  let [board, setBoard] = useState(initialBoard)

  return <div>Board here!</div>
}

export function generateBoard() {}
