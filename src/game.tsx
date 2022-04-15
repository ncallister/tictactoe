import React from 'react';
import Board from './board';
import GameState from './gameState';

interface StateGame
{
  history : Array<GameState>;
  players: Array<string>;
  nextPlayer: number;
  winner : string;
  boardHeight : number;
  boardWidth : number;
  winSize : number;
}

export default class Game extends React.Component<{}, StateGame>
{
  constructor(props : {})
  {
    super(props);

    this.state = 
    {
      history: [],
      players: ['X', 'O'],
      nextPlayer: 0,
      winner: null,
      boardWidth: 4,
      boardHeight: 4,
      winSize: 4
    };
  }

  getCurrentBoard() : Array<Array<string>>
  {
    return this.state.history[this.state.history.length - 1];
  }

  cellClicked(x : number, y : number)
  {
    console.log('board clicked: ' + x + ', ' + y);
    if (this.state.winner === null && this.getCurrentBoard()[x][y] === null)
    {
      const boardModel = this.getCurrentBoard().slice();
      boardModel[x][y] = this.state.players[this.state.nextPlayer];
      this.setState(
        { 
          nextPlayer: (this.state.nextPlayer + 1) % this.state.players.length,
          history: this.state.history.concat(boardModel),
          winner: this.getWinner(),
        })
    }
  }

  getWinnerRow(rowIndex : number) : string
  {
    var winner : string = null;
    for (var i = 0 ; winner == null && i + this.state.winSize <= this.state.boardWidth ; ++i)
    {
      winner = this.getCurrentBoard()[i][rowIndex];
      for (var offset = 1 ; winner != null && offset < this.state.winSize ; ++offset )
      {
        if (this.getCurrentBoard()[i + offset][rowIndex] !== winner)
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
    for (var i = 0 ; winner == null && i + this.state.winSize <= this.state.boardHeight ; ++i)
    {
      winner = this.getCurrentBoard()[colIndex][i];
      for (var offset = 1 ; winner != null && offset < this.state.winSize ; ++offset )
      {
        if (this.getCurrentBoard()[colIndex][i + offset] !== winner)
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
    if (y + this.state.winSize > this.state.boardHeight)
    {
      return null;
    }

    // Try right down diagonal
    if (x + this.state.winSize <= this.state.boardWidth)
    {
      winner = this.getCurrentBoard()[x][y];
      for (var offset = 1 ; winner != null && offset < this.state.winSize ; ++offset)
      {
        if (this.getCurrentBoard()[x + offset][y + offset] !== winner)
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
        winner = this.getCurrentBoard()[x][y];
        for (offset = 1 ; winner != null && offset < this.state.winSize ; ++offset)
        {
          if (this.getCurrentBoard()[x - offset][y + offset] !== winner)
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

    for (var row = 0 ; winner == null && row < this.state.boardHeight ; ++row)
    {
      winner = this.getWinnerRow(row);
    }
    for (var col = 0 ; winner == null && col < this.state.boardWidth ; ++col)
    {
      winner = this.getWinnerColumn(col);
    }
    for (var sRow = 0 ; winner == null && sRow < this.state.boardWidth ; ++sRow)
    {
      for (var sCol = 0 ; winner == null && sCol < this.state.boardHeight ; ++sCol)
      {
        winner = this.getWinnerDiagonal(sCol, sRow);
      }
    }

    return winner;
  }

  render() : JSX.Element
  {
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            boardHeight={ this.state.boardHeight } 
            boardWidth={ this.state.boardWidth } 
            winSize={ this.state.winSize }
          />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}