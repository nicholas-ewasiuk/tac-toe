/** @jsxImportSource @emotion/react */
import React, { useCallback, useEffect, useState } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useConnectedWallet, useSolana } from '@saberhq/use-solana';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { PendingTransaction } from '@saberhq/solana-contrib';

import { setupGame } from './actions/setupGame';
import { playTurn } from './actions/playTurn';
import { Board } from './components/Board';
import { joinGame } from './actions/joinGame';
import { GameList } from './components/GameList';
import { StatusBar } from './components/StatusBar';
import { GameButton } from './components/GameButton';
import { SearchBar } from './components/SearchBar';
import { BoardBackground } from './components/images/BoardBackground';
import { Game, getGame } from './state/game';
import { ConnectWalletButton } from '@gokiprotocol/walletkit';
import { lighten } from 'polished';

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

  /*todo: 
    -wallet button styling and onconnect change
    -board svg styling, add refetch board data after submit turn.
    -change color palette
    -setup for mobile
    -request sol balance and button styling
    -search icon
    -clean up css
    -game naming?
    -closing game accounts
    -max-height and scrolling for list menus 
  */

  return (
    <AppWrapper>
      <Main>
        <div
          css={css`
            display:flex;
            flex-direction: column;
            margin: 0 40px 0 40px;
          `}
        >
          <h1
            css={css`
              display: flex;
              justify-content: center;
              margin: 0px;
              border-radius: 10px;
              padding: 10px;
              ${base};
              font-family: Roboto Slab, serif;
              font-size: 48px;
              font-weight: inherit;
              color: #ffffff;
            `}
          >
            TIC-TAC-TOE
          </h1>
          <div 
            css={css`
              position: relative;
              display: flex;
              flex-direction: column;
              align-items: center;
              border-radius: 10px;
              padding: 0 20px 20px 20px;
              ${secondary};
            `}
          >
            <p
              css={css`
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
          `}
        >
          <ConnectWalletButton
            css={css`
              border-radius: 10px;
              ${base};
              box-shadow: none;
              color: #ffffff;
              &:hover {
                background: ${lighten(0.1, "#a3d9c6")};
              }
              & > span {
                font-weight: inherit;
                font-size: 20px;
              }
            `} 
          />
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
          <div>
              Balance:{" "}
              {typeof balance === "number"
                  ? `${(balance / LAMPORTS_PER_SOL).toLocaleString()} SOL`
                  : "--"} 
          </div>
          <button
            css={css`
              border: none;
              border-radius: 10px;
              padding: 7px 28px 7px 28px;
              ${tertiary};
              font-size: 18px;
              color: #ffffff;
            `}
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

const base = css`
  background: #6b859d;
`

const secondary = css`
  background: #dbdfe5;
`

const tertiary = css`
  background: #6099aa;
`