/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Game } from '../state/game';
import { Square } from './Square';
import { breakpoints } from '../App';

type Props = {
  title: string;
  onClick: React.MouseEventHandler;
  game: Game;
};

/**
 * Maps data from the Game account's "board:" field to an array of list elements.
 */
export const Board = ({title, onClick, game}: Props) => {
  const boardItems = game.board.map((row: JSX.Element[], index) => 
    <Row
      key={index}
      value={index}
      >
        <RowChild key={index}>
        {row.map((element: JSX.Element, index) => 
          <Square
            key={index}
            value={index}
            element={element ? JSON.stringify(element).slice(2,3) : "\u0000"}
          />
        )}
        </RowChild>
    </Row>
  );

  return (
    <ul
      css={css`
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        width: 450px;
        height: 450px;
        ${breakpoints.mobile} {
          width: 300px;
          height: 300px;
        }
        padding: 0px;
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

const RowChild = styled.ul`
  display: flex;
  flex-direction: row;
  padding: 0px;
  list-style-type: none;
`