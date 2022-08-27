import Board, { generateBoard } from './board.client'

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
