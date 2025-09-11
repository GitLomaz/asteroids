const WEAPON_TYPE = [
  // 1-5: Single gun, cooldown reduces
  { cooldown: 500, guns: [{ offset: {x: 0, y: 0}, angle: 0, damage: 15 }] },
  { cooldown: 400, guns: [{ offset: {x: 0, y: 0}, angle: 0, damage: 15 }] },
  { cooldown: 300, guns: [{ offset: {x: 0, y: 0}, angle: 0, damage: 15 }] },
  { cooldown: 250, guns: [{ offset: {x: 0, y: 0}, angle: 0, damage: 16 }] },
  { cooldown: 200, guns: [{ offset: {x: 0, y: 0}, angle: 0, damage: 18 }] },

  // 6-15: Dual guns
  { cooldown: 500, guns: [{ offset: {x: -4, y: 4}, angle: 0, damage: 15 }, { offset: {x: 4, y: 4}, angle: 0, damage: 15 }] },
  { cooldown: 400, guns: [{ offset: {x: -6, y: 4}, angle: 0, damage: 15 }, { offset: {x: 6, y: 4}, angle: 0, damage: 15 }] },
  { cooldown: 350, guns: [{ offset: {x: -8, y: 4}, angle: 0, damage: 16 }, { offset: {x: 8, y: 4}, angle: 0, damage: 16 }] },
  { cooldown: 300, guns: [{ offset: {x: -10, y: 5}, angle: 0, damage: 17 }, { offset: {x: 10, y: 5}, angle: 0, damage: 17 }] },
  { cooldown: 250, guns: [{ offset: {x: -12, y: 5}, angle: 0, damage: 18 }, { offset: {x: 12, y: 5}, angle: 0, damage: 18 }] },
  { cooldown: 225, guns: [{ offset: {x: -14, y: 6}, angle: 0, damage: 19 }, { offset: {x: 14, y: 6}, angle: 0, damage: 19 }] },
  { cooldown: 200, guns: [{ offset: {x: -16, y: 6}, angle: 0, damage: 20 }, { offset: {x: 16, y: 6}, angle: 0, damage: 20 }] },
  { cooldown: 175, guns: [{ offset: {x: -18, y: 6}, angle: 0, damage: 21 }, { offset: {x: 18, y: 6}, angle: 0, damage: 21 }] },
  { cooldown: 150, guns: [{ offset: {x: -20, y: 7}, angle: 0, damage: 22 }, { offset: {x: 20, y: 7}, angle: 0, damage: 22 }] },
  { cooldown: 140, guns: [{ offset: {x: -22, y: 7}, angle: 0, damage: 23 }, { offset: {x: 22, y: 7}, angle: 0, damage: 23 }] },

  // 16-25: Triple guns (spread)
  { cooldown: 300, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 20 },
    { offset: {x: -8, y: 4}, angle: -5, damage: 20 },
    { offset: {x: 8, y: 4}, angle: 5, damage: 20 }
  ]},
  { cooldown: 275, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 21 },
    { offset: {x: -10, y: 4}, angle: -6, damage: 21 },
    { offset: {x: 10, y: 4}, angle: 6, damage: 21 }
  ]},
  { cooldown: 250, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 22 },
    { offset: {x: -12, y: 5}, angle: -7, damage: 22 },
    { offset: {x: 12, y: 5}, angle: 7, damage: 22 }
  ]},
  { cooldown: 225, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 23 },
    { offset: {x: -14, y: 5}, angle: -8, damage: 23 },
    { offset: {x: 14, y: 5}, angle: 8, damage: 23 }
  ]},
  { cooldown: 200, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 24 },
    { offset: {x: -16, y: 6}, angle: -9, damage: 24 },
    { offset: {x: 16, y: 6}, angle: 9, damage: 24 }
  ]},
  { cooldown: 190, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 25 },
    { offset: {x: -18, y: 6}, angle: -10, damage: 25 },
    { offset: {x: 18, y: 6}, angle: 10, damage: 25 }
  ]},
  { cooldown: 180, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 26 },
    { offset: {x: -20, y: 6}, angle: -12, damage: 26 },
    { offset: {x: 20, y: 6}, angle: 12, damage: 26 }
  ]},
  { cooldown: 170, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 27 },
    { offset: {x: -22, y: 7}, angle: -14, damage: 27 },
    { offset: {x: 22, y: 7}, angle: 14, damage: 27 }
  ]},
  { cooldown: 160, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 28 },
    { offset: {x: -24, y: 7}, angle: -16, damage: 28 },
    { offset: {x: 24, y: 7}, angle: 16, damage: 28 }
  ]},
  { cooldown: 150, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 30 },
    { offset: {x: -26, y: 8}, angle: -18, damage: 30 },
    { offset: {x: 26, y: 8}, angle: 18, damage: 30 }
  ]},

  // 26-35: Quad guns
  { cooldown: 250, guns: [
    { offset: {x: -12, y: 6}, angle: -5, damage: 25 },
    { offset: {x: 12, y: 6}, angle: 5, damage: 25 },
    { offset: {x: -12, y: -6}, angle: 0, damage: 25 },
    { offset: {x: 12, y: -6}, angle: 0, damage: 25 }
  ]},
  { cooldown: 240, guns: [
    { offset: {x: -14, y: 7}, angle: -6, damage: 26 },
    { offset: {x: 14, y: 7}, angle: 6, damage: 26 },
    { offset: {x: -14, y: -7}, angle: 0, damage: 26 },
    { offset: {x: 14, y: -7}, angle: 0, damage: 26 }
  ]},
  { cooldown: 230, guns: [
    { offset: {x: -16, y: 8}, angle: -7, damage: 27 },
    { offset: {x: 16, y: 8}, angle: 7, damage: 27 },
    { offset: {x: -16, y: -8}, angle: 0, damage: 27 },
    { offset: {x: 16, y: -8}, angle: 0, damage: 27 }
  ]},
  { cooldown: 220, guns: [
    { offset: {x: -18, y: 9}, angle: -8, damage: 28 },
    { offset: {x: 18, y: 9}, angle: 8, damage: 28 },
    { offset: {x: -18, y: -9}, angle: 0, damage: 28 },
    { offset: {x: 18, y: -9}, angle: 0, damage: 28 }
  ]},
  { cooldown: 210, guns: [
    { offset: {x: -20, y: 10}, angle: -10, damage: 29 },
    { offset: {x: 20, y: 10}, angle: 10, damage: 29 },
    { offset: {x: -20, y: -10}, angle: 0, damage: 29 },
    { offset: {x: 20, y: -10}, angle: 0, damage: 29 }
  ]},
  { cooldown: 200, guns: [
    { offset: {x: -22, y: 11}, angle: -12, damage: 30 },
    { offset: {x: 22, y: 11}, angle: 12, damage: 30 },
    { offset: {x: -22, y: -11}, angle: 0, damage: 30 },
    { offset: {x: 22, y: -11}, angle: 0, damage: 30 }
  ]},
  { cooldown: 190, guns: [
    { offset: {x: -24, y: 12}, angle: -14, damage: 32 },
    { offset: {x: 24, y: 12}, angle: 14, damage: 32 },
    { offset: {x: -24, y: -12}, angle: 0, damage: 32 },
    { offset: {x: 24, y: -12}, angle: 0, damage: 32 }
  ]},
  { cooldown: 180, guns: [
    { offset: {x: -26, y: 13}, angle: -16, damage: 34 },
    { offset: {x: 26, y: 13}, angle: 16, damage: 34 },
    { offset: {x: -26, y: -13}, angle: 0, damage: 34 },
    { offset: {x: 26, y: -13}, angle: 0, damage: 34 }
  ]},
  { cooldown: 170, guns: [
    { offset: {x: -28, y: 14}, angle: -18, damage: 36 },
    { offset: {x: 28, y: 14}, angle: 18, damage: 36 },
    { offset: {x: -28, y: -14}, angle: 0, damage: 36 },
    { offset: {x: 28, y: -14}, angle: 0, damage: 36 }
  ]},
  { cooldown: 160, guns: [
    { offset: {x: -30, y: 15}, angle: -20, damage: 38 },
    { offset: {x: 30, y: 15}, angle: 20, damage: 38 },
    { offset: {x: -30, y: -15}, angle: 0, damage: 38 },
    { offset: {x: 30, y: -15}, angle: 0, damage: 38 }
  ]},

  // 36-45: Five guns spread
  { cooldown: 180, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 40 },
    { offset: {x: -12, y: 4}, angle: -10, damage: 40 },
    { offset: {x: 12, y: 4}, angle: 10, damage: 40 },
    { offset: {x: -24, y: 8}, angle: -20, damage: 40 },
    { offset: {x: 24, y: 8}, angle: 20, damage: 40 }
  ]},
  { cooldown: 170, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 42 },
    { offset: {x: -14, y: 5}, angle: -10, damage: 42 },
    { offset: {x: 14, y: 5}, angle: 10, damage: 42 },
    { offset: {x: -26, y: 9}, angle: -20, damage: 42 },
    { offset: {x: 26, y: 9}, angle: 20, damage: 42 }
  ]},
  { cooldown: 160, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 44 },
    { offset: {x: -16, y: 6}, angle: -12, damage: 44 },
    { offset: {x: 16, y: 6}, angle: 12, damage: 44 },
    { offset: {x: -28, y: 10}, angle: -24, damage: 44 },
    { offset: {x: 28, y: 10}, angle: 24, damage: 44 }
  ]},
  { cooldown: 150, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 46 },
    { offset: {x: -18, y: 7}, angle: -14, damage: 46 },
    { offset: {x: 18, y: 7}, angle: 14, damage: 46 },
    { offset: {x: -30, y: 11}, angle: -28, damage: 46 },
    { offset: {x: 30, y: 11}, angle: 28, damage: 46 }
  ]},
  { cooldown: 140, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 48 },
    { offset: {x: -20, y: 8}, angle: -16, damage: 48 },
    { offset: {x: 20, y: 8}, angle: 16, damage: 48 },
    { offset: {x: -32, y: 12}, angle: -32, damage: 48 },
    { offset: {x: 32, y: 12}, angle: 32, damage: 48 }
  ]},
  { cooldown: 130, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 50 },
    { offset: {x: -22, y: 9}, angle: -18, damage: 50 },
    { offset: {x: 22, y: 9}, angle: 18, damage: 50 },
    { offset: {x: -34, y: 13}, angle: -36, damage: 50 },
    { offset: {x: 34, y: 13}, angle: 36, damage: 50 }
  ]},
  { cooldown: 120, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 52 },
    { offset: {x: -24, y: 10}, angle: -20, damage: 52 },
    { offset: {x: 24, y: 10}, angle: 20, damage: 52 },
    { offset: {x: -36, y: 14}, angle: -40, damage: 52 },
    { offset: {x: 36, y: 14}, angle: 40, damage: 52 }
  ]},
  { cooldown: 110, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 54 },
    { offset: {x: -26, y: 11}, angle: -22, damage: 54 },
    { offset: {x: 26, y: 11}, angle: 22, damage: 54 },
    { offset: {x: -38, y: 15}, angle: -44, damage: 54 },
    { offset: {x: 38, y: 15}, angle: 44, damage: 54 }
  ]},
  { cooldown: 100, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 56 },
    { offset: {x: -28, y: 12}, angle: -24, damage: 56 },
    { offset: {x: 28, y: 12}, angle: 24, damage: 56 },
    { offset: {x: -40, y: 16}, angle: -48, damage: 56 },
    { offset: {x: 40, y: 16}, angle: 48, damage: 56 }
  ]},

  // 46-50: Ultimate weapons
  { cooldown: 90, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 60 },
    { offset: {x: -20, y: 6}, angle: -15, damage: 60 },
    { offset: {x: 20, y: 6}, angle: 15, damage: 60 },
    { offset: {x: -40, y: 12}, angle: -30, damage: 60 },
    { offset: {x: 40, y: 12}, angle: 30, damage: 60 },
    { offset: {x: -60, y: 18}, angle: -45, damage: 60 },
    { offset: {x: 60, y: 18}, angle: 45, damage: 60 }
  ]},
  { cooldown: 80, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 65 },
    { offset: {x: -20, y: 6}, angle: -15, damage: 65 },
    { offset: {x: 20, y: 6}, angle: 15, damage: 65 },
    { offset: {x: -40, y: 12}, angle: -30, damage: 65 },
    { offset: {x: 40, y: 12}, angle: 30, damage: 65 },
    { offset: {x: -60, y: 18}, angle: -45, damage: 65 },
    { offset: {x: 60, y: 18}, angle: 45, damage: 65 }
  ]},
  { cooldown: 70, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 70 },
    { offset: {x: -20, y: 6}, angle: -15, damage: 70 },
    { offset: {x: 20, y: 6}, angle: 15, damage: 70 },
    { offset: {x: -40, y: 12}, angle: -30, damage: 70 },
    { offset: {x: 40, y: 12}, angle: 30, damage: 70 },
    { offset: {x: -60, y: 18}, angle: -45, damage: 70 },
    { offset: {x: 60, y: 18}, angle: 45, damage: 70 }
  ]},
  { cooldown: 60, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 75 },
    { offset: {x: -20, y: 6}, angle: -15, damage: 75 },
    { offset: {x: 20, y: 6}, angle: 15, damage: 75 },
    { offset: {x: -40, y: 12}, angle: -30, damage: 75 },
    { offset: {x: 40, y: 12}, angle: 30, damage: 75 },
    { offset: {x: -60, y: 18}, angle: -45, damage: 75 },
    { offset: {x: 60, y: 18}, angle: 45, damage: 75 }
  ]},
  { cooldown: 50, guns: [
    { offset: {x: 0, y: 0}, angle: 0, damage: 80 },
    { offset: {x: -20, y: 6}, angle: -15, damage: 80 },
    { offset: {x: 20, y: 6}, angle: 15, damage: 80 },
    { offset: {x: -40, y: 12}, angle: -30, damage: 80 },
    { offset: {x: 40, y: 12}, angle: 30, damage: 80 },
    { offset: {x: -60, y: 18}, angle: -45, damage: 80 },
    { offset: {x: 60, y: 18}, angle: 45, damage: 80 }
  ]}
];