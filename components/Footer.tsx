import { Box, Text } from '@ds-pack/components'
import Link from './Link'

export default function Footer(props) {
  return (
    <Box is="footer">
      <Text>
        Created by <Link href="https://matthamlin.me">Matt Hamlin</Link>
      </Text>
    </Box>
  )
}
