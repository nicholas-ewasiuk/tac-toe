/** @jsxImportSource @emotion/react */
import React, { ChangeEventHandler, FormEventHandler, MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useConnectedWallet, useSolana } from '@saberhq/use-solana';
import { AccountInfo, LAMPORTS_PER_SOL, ParsedAccountData, PublicKey } from '@solana/web3.js';
import { PendingTransaction } from '@saberhq/solana-contrib';

import { Nav } from './components/Nav';
import { Board } from './components/Board';
import { GameList } from './components/GameList';
import { setupGame } from './actions/setupGame';
import { playTurn } from './actions/playTurn';
import { Game, getGame } from './state/game';
import { searchGames } from './actions/searchGames';
import { DownIcon } from './components/images/DownIcon';
import { BoardBackground } from './components/images/BoardBackground';
import { joinGame } from './actions/joinGame';
import { ListTopLevel } from './components/ListTopLevel';
import { StatusBar } from './components/StatusBar';

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
  const [ searchGamesList, setSearchGamesList ] = useState<{
    pubkey: PublicKey;
    account: AccountInfo<Buffer | ParsedAccountData>;
  }[] | null>(null);
  const [ searchInput, setSearchInput ] = useState<string>("");
  const [ balance, setBalance ] = useState<number | null>(null);
  const [ createdIsOpen, setCreatedIsOpen ] = useState(false);
  const [ activeIsOpen, setActiveIsOpen ] = useState(false);
  const [ gameStatus, setGameStatus ] = useState("Select a game or create new.");

  const { providerMut, connection } = useSolana();
  const wallet = useConnectedWallet();

  const refetchSOL = useCallback(async () => {
    if (wallet && providerMut) {
      setBalance(await providerMut.connection.getBalance(wallet.publicKey));
    }
  }, [providerMut, wallet]);

  const handleSetupGame = async () => {
    if (!providerMut || !wallet) throw new Error("Wallet not connected.");
      await setupGame(providerMut, wallet);
  }

  const handleJoinGame = async () => {
    if (!providerMut || !wallet) throw new Error("Wallet not connected.");
    if (!currentGame) throw new Error("No game selected");
      await joinGame(providerMut, wallet, currentGame.address);
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

  const updateSearchInput: ChangeEventHandler<HTMLInputElement> = (event) => {
      if (event.target) {
        setSearchInput(event.target.value);
      }
  }

  const handleSearchSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
      event.preventDefault();
      try {
          const address = new PublicKey(searchInput);
          const { createdArray } = await searchGames(connection, address);
          setSearchGamesList(createdArray);
      } catch (e) {
          setSearchGamesList(null);
          console.log(e);
      }
  }

  useEffect(() => {
    void refetchSOL();
  }, [refetchSOL]);

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
      <Nav wallet={wallet} />
      <Main>
        <div 
          css={css`
            position: relative;
          `}
        >
          <p>
            {currentGame?.address.toString()}
          </p>
          {currentGame ? (
            <Board
              title="My Game"
              onClick={handleTurnSubmit}
              game={currentGame}
            /> 
          ) : (
            <> 
              <button
                css={css`
                  position: absolute;
                  width: 150px;
                  height: 30px;
                  top: 0;
                  left: 0;
                  bottom: 0;
                  right: 0;
                  margin: auto;
                `}
                disabled={!providerMut}
                onClick={handleSetupGame}
              >
                Create A Game
              </button>
            </>
          )}
          <BoardBackground
            css={css`
              position: absolute;
              top: 0;
              left: 0;
              bottom: 0;
              right: 0;
              margin: auto;
            `} 
          />
          <StatusBar
            game={currentGame}
            wallet={wallet}
          >
            <button onClick={handleJoinGame}>
              Join Game
            </button>
          </StatusBar>
        </div>
        <div
          css={css`
            display: flex;
            flex-direction: column;
          `}
        >
          <ListTopLevel title="Active Games">
            <GameList
              onClick={getListItem}
              gameAccounts={activeGamesList}
            />
          </ListTopLevel> 
          <ListTopLevel title="Created Games">
            <GameList
              onClick={getListItem}
              gameAccounts={createdGamesList}
            /> 
          </ListTopLevel>
          <form
            css={css`
              display: flex;
              justify-content: space-evenly;
              align-items: center;
              margin: 20px 0 0 0;
              background: #70ed9d;
              border-radius: 4px;
            `}
            onSubmit={handleSearchSubmit}
          >
            <input 
              css={css`
                padding: 6px;
                border: none;
                border-radius: 4px;
                background-color: inherit;
                &:focus {
                  outline: none;
                }
              `}
              type="text" 
              placeholder="Enter a player's address"
              value={searchInput} 
              onChange={updateSearchInput} 
            />
            <input
              css={css`
                margin: 0 10px 0 0;
                border: none;
                border-radius: 4px;
                background: #B5B5B5;
              `} 
              type="submit" 
              value="Search" 
            />
          </form>
          {searchGamesList ? (
            <GameList
              onClick={getListItem}
              gameAccounts={searchGamesList}
            /> 
          ) : ( 
            <div />
          )}
          <div>
              Balance:{" "}
              {typeof balance === "number"
                  ? `${(balance / LAMPORTS_PER_SOL).toLocaleString()} SOL`
                  : "--"} 
          </div>
          <button 
            disabled={!providerMut}
            onClick={async () => {
              const txSig = await connection.requestAirdrop(
                  providerMut.wallet.publicKey,
                  LAMPORTS_PER_SOL
              );
              await new PendingTransaction(
                  providerMut.connection,
                  txSig
              ).wait();
              await refetchSOL();
          }}
          >
              Request SOL
          </button>
        </div>
      </Main>
    </AppWrapper>
  );
};

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Main = styled.div`
  display: flex;
  flex-direction: row;
  margin: 50px 0 0 0;
`