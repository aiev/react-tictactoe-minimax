import { Board, Player } from './board';

/*
node model

{
  parent: <node>
  children: <list> nodes
  board: <array[[]]>
  player: <int> (1|2)
  score: <int>
}

1 = X (MAX)
2 = O (MIN)
*/

export default class Minimax {

  constructor(game, levelOfIntelligence=1, firstMove=Player.Y) {
    this.newGame(game, levelOfIntelligence, firstMove);
  }

  newGame(newGame, levelOfIntelligence=1, firstMove=Player.Y) {
    this.firstMove = firstMove;
    this.game = newGame;
    this.boardSize = newGame.getDim();
    this.levelOfIntelligence = levelOfIntelligence;
    this.countNodes = 0;

    this.currentNode = this.tree = this.buildTree();

    this.computeMinimax(this.currentNode);
  }

  buildTree(root=null) {
    if (root == null) {
/*      this.game.move(1, 1, 1);
      this.game.move(2, 0, 2);
      this.game.move(1, 2, 1);
      this.game.move(0, 2, 2);
      this.game.move(2, 2, 1);
*/
      root = {
        parent: null,
        board: this.game.board,
        children: [],
        player: this.firstMove == Player.X ? Player.O : Player.X,
        score: null
      };
    }

    return this.getChildren(root);
  }

  computeMinimax(node) {
    // calcula o valor minimax de um nodo
    let min = 0;
    let max = 0;

    for (let c = 0; c < node.children.length; c++) {  // percorre todos os filhos do nodo
      if (node.children[c].score == null) { // se um filho ainda não tem um valor minimax (não é folha da árvore)
        this.computeMinimax(node.children[c]); // chama a função recursivamente para aquele filho
      }

      let score = node.children[c].score;

      // guarda valor max (maior minimax entre os filhos)
      max = Math.max(score, max);
      // guarda valor min (menor minimax entre os filhos)
      min = Math.min(score, min);
    }

    // se a atual foi do Player.O, o Player.X é o proximo, e o X maximiza
    if (node.player == Player.O) {
      node.score = max; // se a próxima jogada é do X, retorna valor max
    } else {
      node.score = min; // caso contrário, retorna valor min
    }
  }

  move(x, y, player) {
    this.game.move(x, y, player);

    this.updateCurrentNode();
  }

  getBestMove() {
    let nextPlayer = this.currentNode.player == Player.X ? Player.O : Player.X;
    let bestNodeMoves = [];
    let scoreRequired = 0;

    if (nextPlayer == Player.X) {
      // maximiza
      // pega o maior score
      scoreRequired = this.currentNode.children.reduce((prevScore, node) => {
        return Math.max(prevScore, node.score);
      }, -10);
    } else {
      // minimiza
      // pega o menor score
      scoreRequired = this.currentNode.children.reduce((prevScore, node) => {
        return Math.min(prevScore, node.score);
      }, 10);
    }

    // filtra nodes que tem o score que a gente precisa
    bestNodeMoves = this.currentNode.children.filter((node) => {
      return node.score == scoreRequired;
    });

    console.log('scoreRequired', scoreRequired);

    if (bestNodeMoves.length > 0) {
      // seleciona aleatoriamente um dos melhores
      let rnd = Math.floor(Math.random() * bestNodeMoves.length);

      let bestMoveBoard = bestNodeMoves[rnd].board;
      let currentBoard = this.currentNode.board;

      let newX = null;
      let newY = null;

      // temos q converter pra x, y agora
      for (let x = 0; x < this.boardSize; x++) {
        for (let y = 0; y < this.boardSize; y++) {
          if (bestMoveBoard[x][y] != currentBoard[x][y]) {
            newX = x;
            newY = y;

            break;
          }
        }
      }

      return {
        x: newX,
        y: newY
      }
    }

    return null;
  }

  updateCurrentNode() {
    for (let i = 0; i < this.currentNode.children.length; i++) {
      if (this.boardCompare(this.game.board, this.currentNode.children[i].board)) {
        this.currentNode = this.currentNode.children[i];

        break;
      }
    }
  }

  boardCompare(board1, board2) {
    for (let x = 0; x < this.boardSize; x++) {
      for (let y = 0; y < this.boardSize; y++) {
        if (board1[x][y] != board2[x][y])
          return false;
      }
    }

    return true;
  }

  getChildren(node) {
    let player = node.player == Player.X ? Player.O : Player.X; // verifica de quem é a vez de jogar nesse nível

    for (let x = 0; x < this.boardSize; x++) {
      for (let y = 0; y < this.boardSize; y++) {
        // é um espaço vazio no tabuleiro
        if (node.board[x][y] == 0) {
          let newBoard = this.copyBoard(node.board);
          newBoard[x][y] = player;

          let newNode = {
            parent: node,
            board: newBoard,
            children: [],
            player: player,
            score: this.getScore(newBoard) // se eh terminal, calculamos o score dele
          }

          node.children.push(newNode);
          this.countNodes++;

          if (this.countNodes % 100000 == 0) {
            console.log(this.countNodes, 'dale');
          }

          let isTerminal = newNode.score != null;

          // se nao eh um nodo terminal, pega felhinhos uaheue
          if (!isTerminal)
            this.getChildren(newNode);
        }
      }
    }

    return node;
  }

  getScore(board) {
    let newGame = new Board(this.boardSize);
    newGame.setBoard(board);

    // retona 3 para empate, false pra sem ganhador (jogo ainda nao terminou)
    // ou o numero do jogador 1 = x; 2 = o
    let winner = newGame.checkWin();

    // nao temos vencedor e ainda nao acabou o jogo
    if (winner == false)
      return null;

    // empate
    if (winner == Player.TIE)
      return 0;

    let countEmptyCells = newGame.getEmptyCells().length;
    let score = countEmptyCells + 1;

    // se o O ganhou, min
    if (winner == Player.O)
      score = score * -1;

    return score;
  }

  copyBoard(board) {
    let newBoard = [];

    for (let i = 0; i < board.length; i++)
      newBoard[i] = board[i].slice(0);

    return newBoard;
  }

}
