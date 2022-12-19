import { style } from '@vanilla-extract/css'
import { vars } from '@ds-pack/components'

export let cell = style({
  height: 60,
  width: 60,
  userSelect: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
})

export let isActive = style({
  border: 'solid 5px',
  borderColor: vars.colors.blue400,
})

export let board = style({
  border: `solid 2px ${vars.colors.black}`,
  maxWidth: 9 * 60,
  display: 'grid',
  gridTemplateColumns: 'repeat(9, 1fr)',
  gridTemplateRows: 'repeat(9, 1fr)',
  margin: '0 auto',
})

export let cellPencilMarks = style({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  display: 'grid',
  gridTemplateAreas: `"num num num"
    "num num num"
    "num num num"`,
})

export let pencilMark = style({
  gridArea: 'num',
})
