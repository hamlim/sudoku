import './styles.client'
import { themeClass } from '@ds-pack/components/src/vars.css'

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
