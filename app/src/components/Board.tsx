import React from 'react';
import * as styles from './Board.module.css';

type BoardProps = {
  title: string;
  onClick: React.MouseEventHandler;
  board: [][];
};



export const Board = ({title, onClick, board}: BoardProps) => {

  const boardItems = board.map((row: JSX.Element[], index) => 
    <li
      key={index}
      value={index}
      >
        <ul key={index}>
        {row.map((element: JSX.Element, index) => 
          <li
            key={index}
            value={index}
            >
              {element ? JSON.stringify(element).slice(2,3) : ""}
          </li>)}
        </ul>
    </li>
  );

  return (
    <ul
      title={title}
      onClick={onClick}
      className={styles.row}
      >
       {boardItems}
    </ul>
  )
}