import Board from './Board.client'
import { generateBoard } from './board'

export default function Page({ initialBoard }) {
  return <Board initialBoard={initialBoard} />
}

export async function getServerSideProps() {
  return {
    props: {
      initialBoard: generateBoard(),
    },
  }
}
