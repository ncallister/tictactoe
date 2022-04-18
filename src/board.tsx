import React from 'react';
import Square from './square';
import GameState from './gameState';

interface BoardProps
{
  boardHeight : number;
  boardWidth : number;
  players : Array<string>;
  gameState : GameState;
  cellClicked : Function;
}

export default class Board extends React.Component<BoardProps, {}>
{
  renderRow(row: number) : Array<JSX.Element>
  {
    var squares = new Array<JSX.Element>(this.props.boardWidth);
    for (var col = 0 ; col < this.props.boardWidth ; ++col)
    {
      const column = col;
      squares[col] = <Square 
            value={ this.props.gameState.board[col][row] } 
            onClick={ () => this.props.cellClicked(column, row) }
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
    if (this.props.gameState.winner == null)
    {
      return 'Next player: ' + this.props.players[this.props.gameState.nextPlayer];
    }
    else
    {
      return 'Winner: ' + this.props.gameState.winner;
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