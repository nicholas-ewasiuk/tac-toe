import { ConnectedWallet } from '@saberhq/use-solana';
import { newProgram } from '@saberhq/anchor-contrib';
import { AugmentedProvider } from '@saberhq/solana-contrib';
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { Idl, Program } from '@project-serum/anchor';
import { TIC_TAC_TOE_ID } from '../constants';
import { ticTacToeIdl } from '../idl/ticTacToeIdl';

/**
 * Creates a new Game account.
 * @param provider 
 * @param wallet 
 * @param IDL 
 * @param programId 
 */
export async function setupGame(
  provider: AugmentedProvider,
  wallet: ConnectedWallet, 
  IDL: Idl = ticTacToeIdl,
  programId: PublicKey = TIC_TAC_TOE_ID,
) {
  const program = newProgram<Program>(IDL, programId, provider);
  const player = wallet;
  const gameKeypair = Keypair.generate();

  try {
    await program.rpc.setupGame({
      accounts: {
        game: gameKeypair.publicKey,
        playerOne: player.publicKey,
        systemProgram: SystemProgram.programId
      },
      signers: [gameKeypair]
    });
    return gameKeypair;
  } catch (e) {
    console.log(e);
  }
}