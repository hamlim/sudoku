'client'
import './styles'

export default function Layout({ children }) {
  return (
    <html>
      <head>
        <title>Sudoku</title>
      </head>
      <body>{children}</body>
    </html>
  )
}
