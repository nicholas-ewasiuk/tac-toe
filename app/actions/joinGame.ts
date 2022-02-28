import { ConnectedWallet } from '@saberhq/use-solana';
import { newProgram } from '@saberhq/anchor-contrib';
import { AugmentedProvider } from '@saberhq/solana-contrib';
import { PublicKey } from '@solana/web3.js';
import { Idl, Program } from '@project-serum/anchor';

import { TIC_TAC_TOE_ID } from '../utils/constants';
import { ticTacToeIdl } from '../utils/ticTacToeIdl';

export async function joinGame(
  provider: AugmentedProvider,
  wallet: ConnectedWallet, 
  address: PublicKey,
  IDL: Idl = ticTacToeIdl,
  programId: PublicKey = TIC_TAC_TOE_ID,
) {
  const program = newProgram<Program>(IDL, programId, provider);
  const player = wallet;

  try {
    await program.rpc.playerJoin({
      accounts: {
        game: address,
        playerTwo: player.publicKey,
      }
    });
  } catch (e) {
    console.log(e);
  }
}