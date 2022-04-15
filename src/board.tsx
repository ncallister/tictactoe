import React from 'react';
import Square from './square';

interface BoardProps
{
  boardHeight : number;
  boardWidth : number;
  winSize : number;
}

interface BoardState
{
  boardModel: Array<Array<string>>;
  players: Array<string>;
  nextPlayer: number;
  winner : string;
}

export default class Board extends React.Component<BoardProps, BoardState>
{
  constructor(props : BoardProps)
  {
    super(props);

    // props.boardHeight = props.boardHeight || 3;
    // props.boardWidth = props.boardWidth || 3;
    // props.winSize = props.winSize || 3;

    const boardHeight = props.boardHeight ?? 3;
    const boardWidth = props.boardWidth ?? 3;

    var boardColumn = Array(boardHeight).fill(null);
    var board = Array(boardWidth);
    for (var i = 0 ; i < boardWidth ; ++i)
    {
      board[i] = boardColumn.slice();
    }

    this.state = 
    {
      boardModel: board,
      players: ['X', 'O'],
      nextPlayer: 0,
      winner: null,
    }
  }

  cellClicked(x : number, y : number)
  {
    console.log('board clicked: ' + x + ', ' + y);
    if (this.state.winner === null && this.state.boardModel[x][y] === null)
    {
      const boardModel = this.state.boardModel.slice();
      boardModel[x][y] = this.state.players[this.state.nextPlayer];
      this.setState(
        { 
          nextPlayer: (this.state.nextPlayer + 1) % this.state.players.length,
          boardModel: boardModel,
          winner: this.getWinner(),
        })
    }
  }

  getWinnerRow(rowIndex : number) : string
  {
    var winner : string = null;
    for (var i = 0 ; winner == null && i + this.props.winSize <= this.props.boardWidth ; ++i)
    {
      winner = this.state.boardModel[i][rowIndex];
      for (var offset = 1 ; winner != null && offset < this.props.winSize ; ++offset )
      {
        if (this.state.boardModel[i + offset][rowIndex] !== winner)
        {
          winner = null;
        }
      }
    }
    return winner;
  }

  getWinnerColumn(colIndex : number) : string
  {
    var winner : string = null;
    for (var i = 0 ; winner == null && i + this.props.winSize <= this.props.boardHeight ; ++i)
    {
      winner = this.state.boardModel[colIndex][i];
      for (var offset = 1 ; winner != null && offset < this.props.winSize ; ++offset )
      {
        if (this.state.boardModel[colIndex][i + offset] !== winner)
        {
          winner = null;
        }
      }
    }
    return winner;
  }

  getWinnerDiagonal(x : number, y : number) : string
  {
    var winner : string = null;

    // Check whether we are too low to be possible
    if (y + this.props.winSize > this.props.boardHeight)
    {
      return null;
    }

    // Try right down diagonal
    if (x + this.props.winSize <= this.props.boardWidth)
    {
      winner = this.state.boardModel[x][y];
      for (var offset = 1 ; winner != null && offset < this.props.winSize ; ++offset)
      {
        if (this.state.boardModel[x + offset][y + offset] !== winner)
        {
          winner = null;
        }
      }
    }

    if (winner == null)
    {
      // Try left down diagonal
      if (x - this.props.winSize >= -1)
      {
        winner = this.state.boardModel[x][y];
        for (offset = 1 ; winner != null && offset < this.props.winSize ; ++offset)
        {
          if (this.state.boardModel[x - offset][y + offset] !== winner)
          {
            winner = null;
          }
        }
      }
    }

    return winner;
  }

  getWinner() : string
  {
    var winner : string = null;

    for (var row = 0 ; winner == null && row < this.props.boardHeight ; ++row)
    {
      winner = this.getWinnerRow(row);
    }
    for (var col = 0 ; winner == null && col < this.props.boardWidth ; ++col)
    {
      winner = this.getWinnerColumn(col);
    }
    for (var sRow = 0 ; winner == null && sRow < this.props.boardWidth ; ++sRow)
    {
      for (var sCol = 0 ; winner == null && sCol < this.props.boardHeight ; ++sCol)
      {
        winner = this.getWinnerDiagonal(sCol, sRow);
      }
    }


    return winner;
  }

  renderRow(row: number) : Array<JSX.Element>
  {
    var squares = new Array<JSX.Element>(this.props.boardWidth);
    for (var col = 0 ; col < this.props.boardWidth ; ++col)
    {
      const column = col;
      squares[col] = <Square 
            value={ this.state.boardModel[col][row] } 
            onClick={ () => this.cellClicked(column, row) }
            key={ 'cell-' + col + ',' + row }
        />;
    }
    return squares;
  }

  renderBoard() : Array<JSX.Element>
  {
    var rows = new Array<JSX.Element>(this.props.boardHeight);
    for (var row = 0 ; row < this.props.boardHeight ; ++row)
    {
      rows[row] = <div className="board-row" key={ 'row-' + row }>{ this.renderRow(row) }</div>;
    }
    return rows;
  }

  getStatus() : string
  {
    if (this.state.winner == null)
    {
      return 'Next player: ' + this.state.players[this.state.nextPlayer];
    }
    else
    {
      return 'Winner: ' + this.state.winner;
    }
  }

  render() : JSX.Element
  {
    return (
      <div>
        <div className="status">{ this.getStatus() }</div>
        {
          this.renderBoard()
        }
      </div>
    );
  }
}