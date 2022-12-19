import { Box, Heading } from '@ds-pack/components'

export default function Header(props) {
  return (
    <Box is="header">
      <Heading is="h1" variant="pageTitle">
        Sudoku
      </Heading>
    </Box>
  )
}
