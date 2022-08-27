let digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function getRandomDigit() {
  return digits[Math.floor(Math.random() * 10)]
}

export function generateBoard() {
  return [[], [], [], [], [], [], [], [], []]
}
