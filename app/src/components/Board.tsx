import React from 'react';

type BoardProps = {
  title: string;
  onClick: React.MouseEventHandler;
  board: [][];
};



export const Board = ({title, onClick, board}: BoardProps) => {

  
  const boardItems = board.map((row: JSX.Element[], index) => 
    <li
      key={index}
      >
        <ul key={index}>
        {row.map((element: JSX.Element, index) => 
          <li
            key={index}
            >
              {element ? JSON.stringify(element) : 1}
          </li>)}
        </ul>
    </li>
  );

  return (
    <ul
      title={title}
      onClick={onClick}
      >
       {boardItems}
    </ul>
  )
}