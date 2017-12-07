/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */
import { fromJS } from 'immutable';

import { Board, Player } from './board';
import Minimax from './minimax';


import {
  CHANGE_GAME_SIZE, START_GAME, END_GAME, MAKE_MOVE, MAKE_MOVE_PC, CHANGE_CHILDREN_LEVEL
} from './constants';

// The initial state of the App
const initialState = fromJS({
  size: 3,
  started: false,
  player_turn: Player.O,
  minimax: null,
  children_level: null,
});

function tictactoeReducer(state=initialState, action) {
  switch (action.type) {
    case CHANGE_GAME_SIZE:

      return state.set('size', action.size)
        .set('minimax', new Minimax(new Board(action.size)));

    case CHANGE_CHILDREN_LEVEL:
      return state.set('children_level', action.children_level);

    case START_GAME:
      let size = state.get('size');
      let game = new Board(size);

      // sempre fazer o movimento do PC primeiro, depois calcular
      let x = Math.floor(Math.random() * size);
      let y = Math.floor(Math.random() * size);

      game.move(x, y, Player.X);

      return state.set('started', true)
        .set('minimax', new Minimax(game))
        .set('player_turn', Player.O);

    case END_GAME:
      return state.set('started', false);

    case MAKE_MOVE:
      let currentPlayer = state.get('player_turn');
      let nextPlayer = currentPlayer;
      let minimax = state.get('minimax');

/*      console.log('x', action.x);
      console.log('y', action.y);

      console.log('getCell', game.getCell(action.x, action.y));
      console.log('MAKE_MOVE', currentPlayer);*/

      if (currentPlayer == Player.O) {
        if (minimax.game.getCell(action.x, action.y) == 0) {
          // a gente joga
          minimax.move(action.x, action.y, Player.O);

          nextPlayer = Player.X;
        }
      }

      return state.set('minimax', minimax)
        .set('player_turn', nextPlayer);

    case MAKE_MOVE_PC:
      currentPlayer = state.get('player_turn');
      nextPlayer = currentPlayer == Player.X ? Player.O : Player.X;
      minimax = state.get('minimax');

      // pc joga
      let bestMove = minimax.getBestMove();
      minimax.move(bestMove.x, bestMove.y, currentPlayer);

      return state.set('minimax', minimax)
        .set('player_turn', nextPlayer);

    default:
      return state;
  }
}

export default tictactoeReducer;
