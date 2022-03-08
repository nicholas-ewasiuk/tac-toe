/** @jsxImportSource @emotion/react */
import { Game } from '../state/game';
import { ConnectedWallet } from '@saberhq/use-solana';

export function getStatus(
  game: Game,
  wallet: ConnectedWallet,
) {
  const player1 = game.players[0].toString();
  const player2 = game.players[1].toString();
  const user = wallet.publicKey.toString();
  const nullWallet = "11111111111111111111111111111111";

  if (player1 !== nullWallet && player2 === nullWallet) {
    return ("Join game?");
  }
  if (Object.keys(game.state)[0] == "won") {
    if (game.turn % 2 === 1) {
      return (`Winner P1: ${player1}`);
    } else if (game.turn % 2 === 0) {
      return (`Winner P2: ${player2}`);
    }
  }
  if (Object.keys(game.state)[0] == "tie") {
    return ("Tie game!");
  }
  if ( player2 !== nullWallet) {
    if (game.turn % 2 === 1 && player1 === user) {
      return ("Your turn. Select a square.");
    } else if (game.turn % 2 === 1 && player1 !== user) {
      return ("Waiting for other player...");
    }
    if (game.turn % 2 === 0 && player2 === user) {
      return ("Your turn. Select a square.");
    } else if (game.turn % 2 === 0 && player2 !== user) {
      return ("Waiting for other player...");
    }
  }
  return ("Select a game or create new.")
}
