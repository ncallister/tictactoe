
export default class GameState
{
  board : Array<Array<string>>;
  nextPlayer : string;
  turnNumber : number;
  winner : string;

  constructor(boardHeight : number, boardWidth : number)
  {
    var boardColumn = Array(boardHeight).fill(null);
    this.board = Array(boardWidth);
    for (var i = 0 ; i < boardWidth ; ++i)
    {
      this.board[i] = boardColumn.slice();
    }
  }

  clone() : GameState
  {
    
  }
}