const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;
const DEBUG = false;

let scene;
let playerName = false;

let stats = {
  lives: 3,
  score: 0,
  shield: 100
}

let debugObj = null