/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectTictactoe = (state) => state.get('tictactoe');

const makeSelectMinimax = () => createSelector(
  selectTictactoe,
  (tictactoeState) => tictactoeState.get('minimax')
);

const makeSelectSize = () => createSelector(
  selectTictactoe,
  (tictactoeState) => tictactoeState.get('size')
);
const makeSelectStarted = () => createSelector(
  selectTictactoe,
  (tictactoeState) => tictactoeState.get('started')
);
const makeSelectPlayerTurn = () => createSelector(
  selectTictactoe,
  (tictactoeState) => tictactoeState.get('player_turn')
);


export {
  selectTictactoe,
  makeSelectPlayerTurn,
  makeSelectStarted,
  makeSelectSize,
  makeSelectMinimax,
};
