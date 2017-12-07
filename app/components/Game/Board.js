/**
 *
 * Button.js
 *
 * A common button, if you pass it a prop "route" it'll render a link to a react-router route
 * otherwise it'll render a link with an onclick
 */

import React, { Children } from 'react';
import PropTypes from 'prop-types';

import { MAP_PLAYER_DISPLAY_NAME } from '../../containers/TicTacToePage/constants';

function MiniBoard(props) {

  return (
    <div className={"mini-board" + (props.active ? " active" : "")}>
      <div className="board" onClick={props.onClick}>
        {
          props.board.map((rows, x) => {
            let cols = rows.map((col, y) => {
              return (
                <div key={"col_" + x + "_" + y} className="col" x={x} y={y}>
                  {MAP_PLAYER_DISPLAY_NAME[props.board[x][y]]}
                </div>
              );
            });

            return <div key={"row_" + x} className="row">{cols}</div>
          })
        }
      </div>
      <p>Score: {props.score}</p>
    </div>
  );
}

MiniBoard.propTypes = {
  board: PropTypes.array,
  score: PropTypes.number,
  onClick: PropTypes.func,
  active: PropTypes.bool
};

export default MiniBoard;
