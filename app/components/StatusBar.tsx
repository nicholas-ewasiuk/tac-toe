/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { ConnectedWallet } from '@saberhq/use-solana';
import { Game } from '../state/game';

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
        if (Object.keys(game.state)[0] == "tie") {
          setStatusText("Tie game!");
        } else if (game.turn % 2 === 1 && player1 === user) {
          if (Object.keys(game.state)[0] == "won") {
            setStatusText(`You Won!`);
          } else {
            setStatusText("Your turn. Select a square.");
          }
        } else if (game.turn % 2 === 1 && player1 !== user) {
          if (Object.keys(game.state)[0] == "won") {
            setStatusText(`You Lost.`);
          } else {
            setStatusText("Waiting for other player...");
          }
        }
        if (game.turn % 2 === 0 && player2 === user) {
          if (Object.keys(game.state)[0] == "won") {
            setStatusText(`You Won!`);
          } else {
            setStatusText("Your turn. Select a square.");
          }
        } else if (game.turn % 2 === 0 && player2 !== user) {
          if (Object.keys(game.state)[0] == "won") {
            setStatusText(`You Lost.`);
          } else {
            setStatusText("Waiting for other player...");
          }
        }
        setPlayerCanJoin(false);
      }
    }
  }, [game, wallet]);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 80px;
      `}
    >
      <p
        css={css`
          text-align: center;
          color: #476974;
        `}
      >
        {statusText}
      </p>
      {playerCanJoin && children}
    </div>
  );
}
