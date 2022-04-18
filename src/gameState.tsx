
export default class GameState
{
  boardHeight : number;
  boardWidth : number;

  board : Array<Array<string>>;
  nextPlayer : number;
  turnNumber : number;
  winner : string;

  constructor(boardHeight : number, boardWidth : number)
  {
    this.boardHeight = boardHeight;
    this.boardWidth = boardWidth;
    var boardColumn = Array(boardHeight).fill(null);
    this.board = Array(boardWidth);
    this.nextPlayer = 0;
    for (var i = 0 ; i < boardWidth ; ++i)
    {
      this.board[i] = boardColumn.slice();
    }
  }

  clone() : GameState
  {
    // TODO: Fix this, it copies reference to board
    var copy : GameState = Object.assign(new GameState(this.boardHeight, this.boardWidth), this);
    copy.board = [];
    this.board.forEach(
      (value : string[]) =>
      {
        copy.board.push(value.slice());
      });
    return copy;
  }
}