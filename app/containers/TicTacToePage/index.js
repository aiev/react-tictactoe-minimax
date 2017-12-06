/*
 * TicTacToePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { makeSelectRepos, makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import H2 from 'components/H2';
import A from 'components/A';
import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';
import { loadRepos } from '../App/actions';
import { startGame, endGame, makeMove, makeMovePC, changeGameSize } from './actions';
import { makeSelectPlayerTurn, makeSelectStarted, makeSelectSize, makeSelectMinimax } from './selectors';
import reducer from './reducer';
import saga from './saga';

import MiniBoard from 'components/Game/Board';
import { MAP_PLAYER_DISPLAY_NAME } from './constants';


import { Board, Player } from './board';
import Minimax from './minimax';

import styles from './styles.css';




export class TicTacToePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

/*  constructor(props) {
    super(props);

    this.game = new Board(props.size);
    this.game.move(0, 1, 1);

    this.state = {
      player: 1,
      freezeBoard: false,
      winner: false
    };
  }*/

  componentDidMount() {
    window.Board = Board;
    window.Minimax = Minimax;
  }

  render() {
    const {
      loading,
      size,
      minimax,
      player_turn,
      started
    } = this.props;

    // retona 3 para empate, false pra sem ganhador (jogo ainda nao terminou)
    // ou o numero do jogador 1 = x; 2 = o
    let winner = false;

    if (started)
      winner = minimax.game.checkWin();

    console.log(this.props);

    return (
      <article>
        <Helmet>
          <title>IA TicTacToe</title>
          <meta name="description" content="A React.js IA TicTacToe" />
        </Helmet>
        <div>
          <CenteredSection>
            <H2>
              Jogo da velha {size}x{size} - Minimax
            </H2>
          </CenteredSection>
          <Section className="wrap-game">
            {started ?
            <div className="game">
              {
                minimax.game.board.map((rows, x) => {
                  let cols = rows.map((col, y) => {
                    return (
                      <div key={"col_" + x + "_" + y} className="col" x={x} y={y} onClick={player_turn == Player.X && winner === false ? () => {} : this.props.onMakeMove.bind(this, x, y)}>
                        {MAP_PLAYER_DISPLAY_NAME[minimax.game.getCell(x, y)]}
                      </div>
                    );
                  });

                  return <div key={"row_" + x} className="row">{cols}</div>
                })
              }
            </div> : null}
            <div className="actions">
              <p>X = PC (max)</p>
              <p>O = Humano (min)</p>
              <p></p>
              <p>
                {started && winner === false ? [
                  <span key="0">Turno: {MAP_PLAYER_DISPLAY_NAME[player_turn]} </span>,
                  <a key="1" href="#" onClick={this.props.onMakeMovePC}>mover</a>
                ] : null}
              </p>
              <p></p>
              {winner == Player.TIE ? <p>Empate!</p> : null}
              {winner == Player.X ? <p>PC ganhou :)</p> : null}
              {winner == Player.O ? <p>Você ganhou, queridinho.. como tu conseguiu isso?</p> : null}
              <p></p>
              {started && winner === false ? <A href="#" onClick={this.props.onEndGame}>Terminar</A> : <A href="#" onClick={this.props.onStartGame}>Iniciar</A>}

              {/*<label><input type="checkbox" value="" /> CPU começa</label>*/}
            </div>

          </Section>
          {started ?
          <div className="wrap-children">
            {minimax.currentNode.children.map((node, i) => {
              return (
                <MiniBoard key={i} board={node.board} score={node.score} />
              );
            })}
          </div>
          : null}
        </div>
      </article>
    );
  }
}

TicTacToePage.propTypes = {
  size: PropTypes.number,
  started: PropTypes.bool,
  player_turn: PropTypes.number,
  minimax: PropTypes.object,

  onStartGame: PropTypes.func,
  onEndGame: PropTypes.func,
  onMakeMove: PropTypes.func,
  onMakeMovePC: PropTypes.func,
  onChangeGameSize: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onStartGame: () => dispatch(startGame()),
    onEndGame: () => dispatch(endGame()),
    onChangeGameSize: (size) => dispatch(changeGameSize(size)),
    onMakeMovePC: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();

      dispatch(makeMovePC());
    },
    onMakeMove: (x, y, evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();

      console.log('move x y', x, y);

      dispatch(makeMove(x, y));
    },
  };
}

const mapStateToProps = createStructuredSelector({
  minimax: makeSelectMinimax(),
  player_turn: makeSelectPlayerTurn(),
  started: makeSelectStarted(),
  size: makeSelectSize(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

/*const mapStateToProps = (state, ownProps) => ({
  size: state.size,
  started: state.started,
  player_turn: state.player_turn,
  game: state.game,
});
*/
const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'tictactoe', reducer });
const withSaga = injectSaga({ key: 'tictactoe', saga });


export default compose(
  withReducer,
  withSaga,
  withConnect,
)(TicTacToePage);
