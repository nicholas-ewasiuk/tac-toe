import React from 'react';
import styled from '@emotion/styled';

import { Game } from '../state/game';


type Props = {
  title: string;
  onClick: React.MouseEventHandler;
  game: Game;
};

export const Board = ({title, onClick, game}: Props) => {
  const boardItems = game.board.map((row: JSX.Element[], index) => 
    <li
      key={index}
      value={index}
      >
        <Row key={index}>
        {row.map((element: JSX.Element, index) => 
          <Square
            key={index}
            value={index}
            >
              {element ? JSON.stringify(element).slice(2,3) : "\u0000"}
          </Square>)}
        </Row>
    </li>
  );

  return (
    <BoardLayout
      title={title}
      onClick={onClick}
      >
        {boardItems}
    </BoardLayout>
  )
}

const BoardLayout = styled.ul`
  position: absolute;
  padding: 0px;
  width: 450px;
  height: 450px;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: 34px 0 0 0;
  list-style-type: none;
`;

const Row = styled.ul`
  display: flex;
  flex-direction: row;
  padding: 0px;
  list-style-type: none;
`

const Square = styled.li`
  display: flex;
  border-width: 2px;
  font-size: 96px;
  border-style: none;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0px;
  &:hover {
    background: radial-gradient( #cccbcb 1%, transparent 50%);
  }
`;