/*
 * Home Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  START_GAME, END_GAME,
  CHANGE_GAME_SIZE, MAKE_MOVE, MAKE_MOVE_PC, CHANGE_CHILDREN_LEVEL
} from './constants';



export function changeGameSize(size) {
  return {
    type: CHANGE_GAME_SIZE,
    size,
  };
}

export function startGame() {
  return {
    type: START_GAME
  };
}

export function endGame() {
  return {
    type: END_GAME
  };
}

export function makeMove(x, y) {
  return {
    type: MAKE_MOVE,
    x,
    y
  };
}

export function makeMovePC() {
  return {
    type: MAKE_MOVE_PC
  };
}

export function changeChildrenLevel(children_level) {
  return {
    type: CHANGE_CHILDREN_LEVEL,
    children_level,
  };
}


