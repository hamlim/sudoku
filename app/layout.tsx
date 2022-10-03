'client'
import { themeClass } from '@ds-pack/components'
import '@ds-pack/components/dist/index.css'

// let themeClass = 'foo'

export default function Layout({ children }) {
  return (
    <html className={themeClass}>
      <head>
        <title>Sudoku</title>
      </head>
      <body>{children}</body>
    </html>
  )
}
