const LEVELS = {
  "levels": [
    { "level": 1, "enemies": [ { "type": "asteroid", "size": 2, "count": 5 } ] },
    { "level": 2, "enemies": [ { "type": "asteroid", "size": 3, "count": 3 }, { "type": "snake", "count": 1 } ] },
    { "level": 3, "enemies": [ { "type": "asteroid", "size": 4, "count": 2 }, { "type": "monster", "count": 2 } ] },
    { "level": 4, "enemies": [ { "type": "asteroid", "size": 3, "count": 4 }, { "type": "mine", "count": 1 }, { "type": "snake", "count": 1 } ] },
    { "level": 5, "enemies": [ { "type": "asteroid", "size": 5, "count": 3 }, { "type": "monster", "count": 2 }, { "type": "mine", "count": 1 } ] },
    { "level": 6, "enemies": [ { "type": "asteroid", "size": 2, "count": 8 }, { "type": "snake", "count": 1 } ] },
    { "level": 7, "enemies": [ { "type": "asteroid", "size": 4, "count": 3 }, { "type": "monster", "count": 2 } ] },
    { "level": 8, "enemies": [ { "type": "asteroid", "size": 6, "count": 2 }, { "type": "mine", "count": 2 } ] },
    { "level": 9, "enemies": [ { "type": "asteroid", "size": 3, "count": 6 }, { "type": "snake", "count": 1 }, { "type": "monster", "count": 1 } ] },
    { "level": 10, "enemies": [ { "type": "asteroid", "size": 5, "count": 4 }, { "type": "mine", "count": 1 }, { "type": "snake", "count": 1 } ] },

    { "level": 11, "enemies": [ { "type": "asteroid", "size": 2, "count": 10 }, { "type": "monster", "count": 2 } ] },
    { "level": 12, "enemies": [ { "type": "asteroid", "size": 6, "count": 3 }, { "type": "snake", "count": 1 }, { "type": "mine", "count": 1 } ] },
    { "level": 13, "enemies": [ { "type": "asteroid", "size": 4, "count": 5 }, { "type": "monster", "count": 2 } ] },
    { "level": 14, "enemies": [ { "type": "asteroid", "size": 3, "count": 7 }, { "type": "snake", "count": 1 }, { "type": "mine", "count": 2 } ] },
    { "level": 15, "enemies": [ { "type": "asteroid", "size": 7, "count": 2 }, { "type": "monster", "count": 3 } ] },
    { "level": 16, "enemies": [ { "type": "asteroid", "size": 5, "count": 5 }, { "type": "snake", "count": 1 } ] },
    { "level": 17, "enemies": [ { "type": "asteroid", "size": 2, "count": 12 }, { "type": "mine", "count": 2 } ] },
    { "level": 18, "enemies": [ { "type": "asteroid", "size": 6, "count": 4 }, { "type": "monster", "count": 3 }, { "type": "snake", "count": 1 } ] },
    { "level": 19, "enemies": [ { "type": "asteroid", "size": 3, "count": 10 }, { "type": "mine", "count": 2 } ] },
    { "level": 20, "enemies": [ { "type": "asteroid", "size": 8, "count": 2 }, { "type": "snake", "count": 1 }, { "type": "monster", "count": 3 }, { "type": "mine", "count": 2 } ] },

    { "level": 21, "enemies": [ { "type": "asteroid", "size": 4, "count": 8 }, { "type": "snake", "count": 1 } ] },
    { "level": 22, "enemies": [ { "type": "asteroid", "size": 5, "count": 6 }, { "type": "monster", "count": 3 }, { "type": "mine", "count": 2 } ] },
    { "level": 23, "enemies": [ { "type": "asteroid", "size": 6, "count": 5 }, { "type": "snake", "count": 1 }, { "type": "monster", "count": 2 } ] },
    { "level": 24, "enemies": [ { "type": "asteroid", "size": 3, "count": 12 }, { "type": "mine", "count": 3 } ] },
    { "level": 25, "enemies": [ { "type": "asteroid", "size": 8, "count": 3 }, { "type": "snake", "count": 1 }, { "type": "monster", "count": 4 }, { "type": "mine", "count": 3 } ] }
  ]
}

function generateLevel(level) {
  const enemies = [];

  // asteroid scaling
  const maxAsteroidSize = Math.min(15, Math.floor(level / 2) + 3); 
  const asteroidSize = Math.floor(Math.random() * maxAsteroidSize) + 2;
  const asteroidCount = Math.floor(level / 2) + Math.floor(Math.random() * 4);
  enemies.push({ type: "asteroid", size: asteroidSize, count: asteroidCount });

  // snake: one max, ~40% chance
  if (Math.random() < 0.4) {
    enemies.push({ type: "snake", count: 1 });
  }

  // monsters scale every ~5 levels
  const monsterCount = Math.floor(level / 5);
  if (monsterCount > 0) {
    enemies.push({ type: "monster", count: monsterCount });
  }

  // mines scale every ~7 levels
  const mineCount = Math.floor(level / 7);
  if (mineCount > 0) {
    enemies.push({ type: "mine", count: mineCount });
  }

  return { level, enemies };
}
