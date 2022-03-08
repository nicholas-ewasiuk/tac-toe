import { Connection, PublicKey } from '@solana/web3.js';
import { TIC_TAC_TOE_ID } from '../constants';

export async function searchGames(
  connection: Connection,
  address: PublicKey,
  programId: PublicKey = TIC_TAC_TOE_ID,
) {
  const setupGames = await connection.getProgramAccounts(
      programId,
      {
          dataSlice: { offset: 8, length: 64 },
          filters: [
              {
                  memcmp: {
                      offset: 8,
                      bytes: address.toString(),
                  }
              }
          ]
      }
  )
  const joinedGames = await connection.getProgramAccounts(
      programId,
      {
          dataSlice: { offset: 8, length: 64 },
          filters: [
              {
                  memcmp: {
                      offset: 40,
                      bytes: address.toString(),
                  }
              }
          ]
      }
  )
  // Map created games waiting for P2, and active games for this user.
  const activeArray = [];
  const createdArray = [];
  for (let i = 0; i < setupGames.length; i++) {
    for (let j = 32; j < 64; j++) {
        if (setupGames[i].account.data[j] !== 0 ) {
            activeArray.push(setupGames[i]);
            break;
        } else if (j === 63) {
            createdArray.push(setupGames[i]);
        }
    }
  }
  for (let i = 0; i < joinedGames.length; i++) {
      for (let j = 0; j < activeArray.length; j++) {
          if (joinedGames[i].pubkey.toBase58() === activeArray[j].pubkey.toBase58()) {
              break;
          } else if (j === (activeArray.length - 1)) {
              activeArray.push(joinedGames[i]);
          }
      }
  }
  return {
    activeArray, 
    createdArray
  };
}