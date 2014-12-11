var CONSTANTS = Object.freeze({
    MIN_X: 0,
    MIN_Y: 0,
    MAX_X: 1000,
    MAX_Y: 600,
    TIMEDELTA: 1.0/120,
    INPUT_MULTIPLIER: 100,
    EPSILON: 1e-60,
    TETHER_NODE_MASS: 0.001,
    TETHER_NUM_NODES: 10,
    TETHER_NODE_RADIUS: 0.001,
    ASTEROID_MASS: 10,
    ASTEROID_MIN_SIZE: 10,
    ASTEROID_MAX_SIZE: 25,
    PLAYER_MASS: 10,
    PLAYER_RADIUS: 12,
    PLAYER_ACCELERATION: 2,
    PLAYER_FRICTION: 0,
    DAMPING_COEFFICIENT: 0,
    MAX_SPEED: 32,

    TYPE_PLAYER:1,
    TYPE_ASTEROID:2,
    TYPE_TETHER_NODE:3,
    TYPE_WALL:4,
});

module.exports = CONSTANTS;
