import React from 'react';

interface SquareProps
{
  onClick : React.MouseEventHandler<HTMLButtonElement>;
  value: string;
}

const Square : React.FunctionComponent<SquareProps> = 
  props => 
  (
    <button 
      className="square" 
      onClick={ props.onClick }
    >
      { props.value }
    </button>
  );

export default Square;