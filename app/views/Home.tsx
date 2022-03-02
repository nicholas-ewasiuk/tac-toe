import React from 'react';
import styled from '@emotion/styled';
import { Nav } from '../components/Nav';
import { useConnectedWallet, useSolana } from '@saberhq/use-solana';
import { setupGame } from '../actions/setupGame';
import { searchGames } from '../actions/searchGames';

export const Home: React.FC = () => {

  const { providerMut, network, connection } = useSolana();
  const wallet = useConnectedWallet();

  const handleSetupGame = async () => {
    if (!providerMut || !wallet) throw new Error("Wallet not connected.")
    //await setupGame(providerMut, wallet);
    const { activeArray, createdArray } = await searchGames(connection, wallet.publicKey);
    console.log(activeArray);
    console.log(createdArray);
  }

  return (
    <AppWrapper>
      <Nav />
      <Buttons>
        <Button 
          disabled={!providerMut}
          onClick={handleSetupGame}
        >
          Create A Game
        </Button>
        <a href='/explore'>Find A Game</a>
      </Buttons>
    </AppWrapper>
  );
};

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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