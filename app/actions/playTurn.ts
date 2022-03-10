import { ConnectedWallet } from '@saberhq/use-solana';
import { newProgram } from '@saberhq/anchor-contrib';
import { AugmentedProvider } from '@saberhq/solana-contrib';
import { PublicKey } from '@solana/web3.js';
import { Idl, Program } from '@project-serum/anchor';
import { TIC_TAC_TOE_ID } from '../constants';
import { ticTacToeIdl } from '../idl/ticTacToeIdl';

/**
 * Passes a tile input and adds that to the Game account's "board: " field.
 * Address must match the player whose turn it is.
 * @param provider 
 * @param wallet 
 * @param address 
 * @param tile 
 * @param IDL 
 * @param programId 
 */
export async function playTurn(
  provider: AugmentedProvider,
  wallet: ConnectedWallet, 
  address: PublicKey,
  tile: {row: number, column: number},
  IDL: Idl = ticTacToeIdl,
  programId: PublicKey = TIC_TAC_TOE_ID,
) {
  const program = newProgram<Program>(IDL, programId, provider);
  const player = wallet;

  try {
    await program.rpc.play(tile, {
      accounts: {
          game: address,
          player: player.publicKey,
      }
    });
  } catch (e) {
    console.log(e);
  }
}