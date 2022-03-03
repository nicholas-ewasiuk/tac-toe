import React from 'react';
import styled from '@emotion/styled';

import { Nav } from '../components/Nav';

export const Search: React.FC = () => {
  const updateGameInput: ChangeEventHandler<HTMLInputElement> = async (event) => {
      if (event.target) {
        setGameInput(event.target.value);
      }
  }

  const handleGameSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
      event.preventDefault();
      try {
          const address = new PublicKey(gameInput);
          setCurrentGame(address);
      } catch (e) {
          console.log(e);
      }
  }

  return (
    <AppWrapper>
      <h1>Search</h1>
    </AppWrapper>
  );
};

const AppWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;