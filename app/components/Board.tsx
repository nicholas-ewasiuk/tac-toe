import React from 'react';
import styled from '@emotion/styled';

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
  display: block;
  margin: 20px 4px 20px 4px;
  padding: 0px;
  width: 450px;
  height: 450px;
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
  font-family: 'DotGothic16', sans-serif;
  border-style: solid;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0px;
  &:hover {
    background-color: grey;
  }
`;