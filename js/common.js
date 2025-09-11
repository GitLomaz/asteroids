function randBetween(min, max) {
  return Math.random() * (max - min) + min; 
}

function generateEdgeLocation() {
  const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
  let x, y;

  switch (edge) {
    case 0: // Top edge
      x = randBetween(0, GAME_WIDTH);
      y = 0;
      break;
    case 1: // Right edge
      x = GAME_WIDTH;
      y = randBetween(0, GAME_HEIGHT);
      break;
    case 2: // Bottom edge
      x = randBetween(0, GAME_WIDTH);
      y = GAME_HEIGHT;
      break;
    case 3: // Left edge
      x = 0;
      y = randBetween(0, GAME_HEIGHT);
      break;
  }
  return {x, y}
}

function resetStats() {
  stats = {
    lives: 3,
    score: 0,
    shield: 100
  }
}