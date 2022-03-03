import React, { MouseEventHandler, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useConnectedWallet, useSolana } from '@saberhq/use-solana';
import { AccountInfo, ParsedAccountData, PublicKey } from '@solana/web3.js';

import { Nav } from '../components/Nav';
import { Board } from '../components/Board';
import { GameList } from '../components/GameList';
import { setupGame } from '../actions/setupGame';
import { playTurn } from '../actions/playTurn';
import { Game, getGame } from '../state/game';
import { searchGames } from '../actions/searchGames';


export const Home: React.FC = () => {
  const [ currentGame, setCurrentGame ] = useState<Game | null>(null);
  const [ createdGamesList, setCreatedGamesList ] = useState<{
    pubkey: PublicKey;
    account: AccountInfo<Buffer | ParsedAccountData>;
  }[] | null>(null);
  const [ activeGamesList, setActiveGamesList ] = useState<{
    pubkey: PublicKey;
    account: AccountInfo<Buffer | ParsedAccountData>;
  }[] | null>(null);

  const { providerMut, connection } = useSolana();
  const wallet = useConnectedWallet();

  const handleSetupGame = async () => {
    if (!providerMut || !wallet) throw new Error("Wallet not connected.");
      await setupGame(providerMut, wallet);
  }

  const handleTurnSubmit: MouseEventHandler<Element> = async (event) => {
    event.preventDefault();
    if (!providerMut || !wallet) throw new Error("Wallet not connected.");
    if (!currentGame) throw new Error("Game not selected.");

    const target = event.target;
    if (target instanceof HTMLLIElement) {
        const row = target.parentNode.parentNode.value;
        const column = target.value;
        const turnInput = `{row: ${row}, column: ${column}}`
        const jsonStr = turnInput.replace(/(\w+:)|(\w+ :)/g, function(matchedStr) {
            return '"' + matchedStr.substring(0, matchedStr.length - 1) + '":';
        });
        const tile = JSON.parse(jsonStr) as {row: number, column: number};
        console.log('A tile was submitted: ' + JSON.stringify(tile));

        if (wallet && providerMut && currentGame) {
            await playTurn(providerMut, wallet, currentGame.address, tile);
            const game = await getGame(providerMut, connection, currentGame.address);
            setCurrentGame(game);
        }
    }
  }

  const getListItem: MouseEventHandler<Element> = async (event) => {
    const target = event.target;
    if (target instanceof HTMLLIElement && target.textContent && providerMut) {
        try {
            const address = new PublicKey(target.textContent);
            const game = await getGame(providerMut, connection, address);
            setCurrentGame(game);
        } catch (e) {
            console.log(e);
        }
    }
  } 

  useEffect(() => {
    async function fetchGames() {
      if (wallet && providerMut) {
        const { activeArray, createdArray } = await searchGames(connection, wallet.publicKey);
        setCreatedGamesList(createdArray);
        setActiveGamesList(activeArray);
      }
    }
    fetchGames();
  },[wallet, providerMut]);

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
      {currentGame ? <Board
          title="My Game"
          onClick={handleTurnSubmit}
          board={currentGame.board}
      /> : <div />}
      {activeGamesList ?
      <GameList
        title="Active Games:"
        onClick={getListItem}
        gameAccounts={activeGamesList}
      />: <div />}
      {createdGamesList ?
      <GameList
        title="Created Games:"
        onClick={getListItem}
        gameAccounts={createdGamesList}
      />: <div />}
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