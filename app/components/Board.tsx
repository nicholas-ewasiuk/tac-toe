/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { Game } from '../state/game';


type Props = {
  title: string;
  onClick: React.MouseEventHandler;
  game: Game;
};

export const Board = ({title, onClick, game}: Props) => {
  //todo: create an element inside Square that takes element as a prop and displays correct symbol.
  const boardItems = game.board.map((row: JSX.Element[], index) => 
    <Row
      key={index}
      value={index}
      >
        <SubRow key={index}>
        {row.map((element: JSX.Element, index) => 
          <Square
            key={index}
            value={index}
            >
              {element ? JSON.stringify(element).slice(2,3) : "\u0000"}
          </Square>)}
        </SubRow>
    </Row>
  );

  return (
    <ul
      css={css`
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
      `}
      title={title}
      onClick={onClick}
      >
        {boardItems}
    </ul>
  )
}

const Row = styled.li`
  display: flex;
  flex-direction: row;
  padding: 0px;
  list-style-type: none;
`

const SubRow = styled.ul`
  display: flex;
  flex-direction: row;
  padding: 0px;
  list-style-type: none;
`

const Square = styled.li`
  border-radius: 50px;
  width: 150px;
  height: 150px;
  padding: 0px;
  font-size: 96px;
  list-style-type: none;
  &:hover {
    background: radial-gradient( #cccbcb 1%, transparent 50%);
  }
`;