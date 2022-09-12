import './styles.client'

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
