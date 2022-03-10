/** @jsxImportSource @emotion/react */
import React, { useCallback, useEffect, useState } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useConnectedWallet, useSolana } from '@saberhq/use-solana';
import { PendingTransaction } from '@saberhq/solana-contrib';
import { lighten } from 'polished';

import { Game, getGame } from './state/game';
import { setupGame } from './actions/setupGame';
import { playTurn } from './actions/playTurn';
import { joinGame } from './actions/joinGame';
import { Board } from './components/Board';
import { GameList } from './components/GameList';
import { StatusBar } from './components/StatusBar';
import { GameButton } from './components/GameButton';
import { SearchBar } from './components/SearchBar';
import { BoardBackground } from './components/images/BoardBackground';
import { ModdedWalletButton } from './components/ModdedWalletButton';
import { breakpoints } from './App';


export const Home: React.FC = () => {
  const [ currentGame, setCurrentGame ] = useState<Game | null>(null);
  const [ balance, setBalance ] = useState<number | null>(null);

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

  const handleTurnSubmit: React.MouseEventHandler<Element> = async (event) => {
    if (!providerMut || !wallet) throw new Error("Wallet not connected.");
    if (!currentGame) throw new Error("Game not selected.");
    const target = event.target;
    if (target instanceof HTMLLIElement) {
      const row = target.parentNode.parentNode.value;
      const column = target.value;
      const tile = {
        row: row,
        column: column,
      };
      if (wallet && providerMut && currentGame) {
        await playTurn(providerMut, wallet, currentGame.address, tile);
        const game = await getGame(providerMut, connection, currentGame.address);
        setCurrentGame(game);
      }
    }
    event.preventDefault();
  }

  const getListItem: React.MouseEventHandler<Element> = async (event) => {
    const target = event.target;
    if (target instanceof HTMLLIElement && target.id && providerMut) {
        try {
            const address = new PublicKey(target.id);
            const game = await getGame(providerMut, connection, address);
            setCurrentGame(game);
        } catch (e) {
            console.log(e);
        }
    }
  } 

  useEffect(() => {
    void refetchSOL();
  }, [refetchSOL]);

  return (
    <AppWrapper>
      <div
        css={css`
          display: flex;
          flex-direction: row;
          margin: 50px 0 0 0;
          ${breakpoints.mobile} {
            flex-direction: column;
          }
        `}
      >
        <div
          css={css`
            display:flex;
            flex-direction: column;
            margin: 0 40px 0 40px;
            ${breakpoints.mobile} {
              width: 460px;
            }
          `}
        >
          <Header>
            TIC-TAC-TOE
          </Header>
          <div 
            css={css`
              position: relative;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              margin: 0 0 20px 0;
              border-radius: 10px;
              padding: 0 20px 20px 20px;
              background: #dbdfe5;
            `}
          >
            <p
              css={css`
                display: flex;
                align-items: center;
                height: 60px;
                text-align: center;
                color: #476974;
              `}
            >
              {currentGame?.address.toString()}
            </p>
            {currentGame ? (
              <Board
                title="My Game"
                onClick={handleTurnSubmit}
                game={currentGame}
              /> 
            ) : (
              <></>
            )}
            <BoardBackground />
            <StatusBar
              game={currentGame}
              wallet={wallet}
            >
              <GameButton
                onClick={handleJoinGame}
                title="Join Game"
              />
            </StatusBar>
          </div>
        </div>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            ${breakpoints.mobile} {
              align-items: center;
            }
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              ${breakpoints.mobile} {
                flex-direction: row;
                align-items: center;
              }
            `}
          >
            <ModdedWalletButton 
              wallet={wallet}
              balance={balance}
            />
            <RequestBtn
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
            </RequestBtn>
          </div>
          <GameList
            onClick={getListItem}
            title="Active Games"
            address={wallet?.publicKey}
            connection={connection}
            isActive={true}
          />
          <GameList
            onClick={getListItem} 
            title="Created Games"
            address={wallet?.publicKey}
            connection={connection}
            isActive={false}
          />
          <GameButton
            onClick={handleSetupGame}
            title="Create New Game"
          />
          <SearchBar
            onClick={getListItem}
            connection={connection}
          /> 
        </div>
      </div>
    </AppWrapper>
  );
};

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.h1`
  display: flex;
  justify-content: center;
  margin: 0px;
  border-radius: 10px;
  padding: 10px;
  background: #6b859d;
  font-family: Roboto Slab, serif;
  font-size: 48px;
  font-weight: inherit;
  color: #ffffff;
`

const RequestBtn = styled.button`
  margin: 10px 0 0 0;
  @media (max-width: 576px) {
    margin: 0;
  }
  border: none;
  border-radius: 10px;
  width: 200px;
  padding: 7px 28px 7px 28px;
  @media (max-width: 576px) {
    padding: 10px 28px 9px 28px;;
  }
  background: #6099aa;
  font-size: 18px;
  color: #ffffff;
  &:hover {
    background: ${lighten(0.1, "#6099aa")};
  }
`

/*
Todo: 
  - tidy breakpoints stuff
  - separate completed games from active
  - delete game button
  - naming games
  - search icon
*/