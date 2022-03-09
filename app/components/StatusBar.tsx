/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { Game } from '../state/game';
import { ConnectedWallet } from '@saberhq/use-solana';

type Props = {
  game: Game | null,
  wallet: ConnectedWallet | null,
  children: JSX.Element,
};

export const StatusBar = ({ game, wallet, children }: Props) => {
  const [ statusText, setStatusText ] = useState("Select a game or create new.");
  const [ playerCanJoin, setPlayerCanJoin ] = useState(false);

  useEffect(() => {
    if (game && wallet) {
    const player1 = game.players[0].toString();
    const player2 = game.players[1].toString();
    const user = wallet.publicKey.toString();
    const nullWallet = "11111111111111111111111111111111";

    if (player1 !== nullWallet && player2 === nullWallet) {
      setStatusText("Waiting for player to join.");
      setPlayerCanJoin(true);
    }
    if ( player2 !== nullWallet) {
      if (game.turn % 2 === 1 && player1 === user) {
        setStatusText("Your turn. Select a square.");
      } else if (game.turn % 2 === 1 && player1 !== user) {
        setStatusText("Waiting for other player...");
      }
      if (game.turn % 2 === 0 && player2 === user) {
        setStatusText("Your turn. Select a square.");
      } else if (game.turn % 2 === 0 && player2 !== user) {
        setStatusText("Waiting for other player...");
      }
      setPlayerCanJoin(false);
    }
    if (Object.keys(game.state)[0] == "won") {
      if (game.turn % 2 === 1) {
        setStatusText(`Winner P1: ${player1}`);
      } else if (game.turn % 2 === 0) {
        setStatusText(`Winner P2: ${player2}`);
      }
    }
    if (Object.keys(game.state)[0] == "tie") {
      setStatusText("Tie game!");
    }
  }
  }, [game, wallet]);

  return (
    <>
      <p
        css={css`
          text-align: center;
        `}
      >
        {statusText}
      </p>
      {playerCanJoin && children}
    </>
  );
}
