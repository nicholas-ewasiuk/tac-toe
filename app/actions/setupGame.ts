import { useSolana, useConnectedWallet, ConnectedWallet } from '@saberhq/use-solana';
import { newProgram } from '@saberhq/anchor-contrib';
import { AugmentedProvider } from '@saberhq/solana-contrib';
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { Idl, Program } from '@project-serum/anchor';

import { Nav } from '../components/Nav';

export async function setupGame(
  provider: AugmentedProvider,
  wallet: ConnectedWallet, 
  IDL: Idl,
  programId: PublicKey,
) {
  const program = newProgram<Program>(IDL, programId, provider);
  const player = wallet;
  const gameKeypair = Keypair.generate();

  await program.rpc.setupGame({
    accounts: {
      game: gameKeypair.publicKey,
      playerOne: player.publicKey,
      systemProgram: SystemProgram.programId
    },
    signers: [gameKeypair]
  });
}