'use client'
import { themeClass } from '@ds-pack/components'
import '@ds-pack/components/dist/index.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Layout({ children }) {
  return (
    <html className={themeClass}>
      <head>
        <title>Sudoku</title>
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
