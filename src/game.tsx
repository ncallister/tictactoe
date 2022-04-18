import React from 'react';
import Board from './board';
import GameState from './gameState';

interface StateGame
{
  history : Array<GameState>;
  players: Array<string>;
  boardHeight : number;
  boardWidth : number;
  winSize : number;
}

export default class Game extends React.Component<{}, StateGame>
{
  constructor(props : {})
  {
    super(props);

    const boardHeight = 4;
    const boardWidth = 4;

    this.state = 
    {
      history: [new GameState(boardHeight, boardWidth)],
      players: ['X', 'O'],
      boardWidth: boardWidth,
      boardHeight: boardHeight,
      winSize: 4
    };
  }

  getCurrentBoard() : GameState
  {
    return this.state.history[this.state.history.length - 1];
  }

  cellClicked(x : number, y : number)
  {
    console.log('board clicked: ' + x + ', ' + y);
    const boardModel = this.getCurrentBoard().clone();
    if (!boardModel.winner && !boardModel.board[x][y])
    {
      boardModel.board[x][y] = this.state.players[boardModel.nextPlayer];
      boardModel.nextPlayer = (boardModel.nextPlayer + 1) % this.state.players.length;
      boardModel.winner = this.getWinner(boardModel);
      this.setState(
        {
          history: this.state.history.concat(boardModel),
        })
    }
  }

  getWinnerRow(boardModel : GameState, rowIndex : number) : string
  {
    var winner : string = null;
    for (var i = 0 ; winner == null && i + this.state.winSize <= this.state.boardWidth ; ++i)
    {
      winner = boardModel.board[i][rowIndex];
      for (var offset = 1 ; winner != null && offset < this.state.winSize ; ++offset )
      {
        if (boardModel.board[i + offset][rowIndex] !== winner)
        {
          winner = null;
        }
      }
    }
    return winner;
  }

  getWinnerColumn(boardModel : GameState, colIndex : number) : string
  {
    var winner : string = null;
    for (var i = 0 ; winner == null && i + this.state.winSize <= this.state.boardHeight ; ++i)
    {
      winner = boardModel.board[colIndex][i];
      for (var offset = 1 ; winner != null && offset < this.state.winSize ; ++offset )
      {
        if (boardModel.board[colIndex][i + offset] !== winner)
        {
          winner = null;
        }
      }
    }
    return winner;
  }

  getWinnerDiagonal(boardModel : GameState, x : number, y : number) : string
  {
    var winner : string = null;

    // Check whether we are too low to be possible
    if (y + this.state.winSize > this.state.boardHeight)
    {
      return null;
    }

    // Try right down diagonal
    if (x + this.state.winSize <= this.state.boardWidth)
    {
      winner = boardModel.board[x][y];
      for (var offset = 1 ; winner != null && offset < this.state.winSize ; ++offset)
      {
        if (boardModel.board[x + offset][y + offset] !== winner)
        {
          winner = null;
        }
      }
    }

    if (winner == null)
    {
      // Try left down diagonal
      if (x - this.state.winSize >= -1)
      {
        winner = boardModel.board[x][y];
        for (offset = 1 ; winner != null && offset < this.state.winSize ; ++offset)
        {
          if (boardModel.board[x - offset][y + offset] !== winner)
          {
            winner = null;
          }
        }
      }
    }

    return winner;
  }

  getWinner(boardModel : GameState) : string
  {
    var winner : string = null;

    for (var row = 0 ; winner == null && row < this.state.boardHeight ; ++row)
    {
      winner = this.getWinnerRow(boardModel, row);
    }
    for (var col = 0 ; winner == null && col < this.state.boardWidth ; ++col)
    {
      winner = this.getWinnerColumn(boardModel, col);
    }
    for (var sRow = 0 ; winner == null && sRow < this.state.boardWidth ; ++sRow)
    {
      for (var sCol = 0 ; winner == null && sCol < this.state.boardHeight ; ++sCol)
      {
        winner = this.getWinnerDiagonal(boardModel, sCol, sRow);
      }
    }

    if (!winner && boardModel.board.every((col) => col.every((cell) => cell)))
    {
      winner = "Draw!";
    }

    return winner;
  }

  back()
  {
    var newHistory : Array<GameState> = this.state.history.slice();
    newHistory.pop();
    this.setState(
      {
        history: newHistory,
      });
  }

  reset()
  {
    this.setState(
      {
        history: this.state.history.splice(0, 1),
      });
  }

  render() : JSX.Element
  {
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            boardHeight={ this.state.boardHeight }
            boardWidth={ this.state.boardWidth }
            players={ this.state.players }
            cellClicked={ (x : number, y : number) => this.cellClicked(x, y) }
            gameState={ this.getCurrentBoard() }
          />
        </div>
        <div className="game-info">
          <div><button onClick={ () => this.back() }>Undo</button><button onClick={ () => this.reset() }>Reset</button>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}