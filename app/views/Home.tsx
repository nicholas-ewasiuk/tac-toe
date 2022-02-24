import React from 'react';
import styled from '@emotion/styled';

export const Home: React.FC = () => {

  return (
    <AppWrapper>
      <Buttons>
        <Button 
          disabled={!providerMut}
          onClick={createGame}
        >
          Create A Game
        </Button>
        <a href='/explore'>Find A Game</a>
      </Buttons>
    </AppWrapper>
  );
};

const AppWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
`

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;