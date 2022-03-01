import { Commitment, Connection, PublicKey } from "@solana/web3.js";
import { TIC_TAC_TOE_ID } from "../constants";
import { ticTacToeIdl } from "../idl/ticTacToeIdl";
import { Idl, Program } from "@project-serum/anchor";
import { AugmentedProvider } from "@saberhq/solana-contrib";
import { newProgram } from "@saberhq/anchor-contrib";

/** Information about a game account */
export interface Game {
  /** Address of the account */
  address: PublicKey,
  /** Players that have joined game */
  players: PublicKey[];
  /** Number of turns played */
  turn: number;
  /** Layout of game board */
  board: [][];
  /** Status of the game */
  state: 
    {active: {}} |
    {tie: {}} |
    {won: PublicKey};
}

/**
 * Retrieve information about a game account
 * 
 * @param provider 
 * @param connection 
 * @param account 
 * @param IDL 
 * @param programId 
 * 
 * @returns Game account information
 */
export async function getGame(
  provider: AugmentedProvider,
  connection: Connection,
  address: PublicKey,
  IDL: Idl = ticTacToeIdl,
  programId: PublicKey = TIC_TAC_TOE_ID,
) : Promise<Game> {
  const info = await connection.getAccountInfo(address);
  if (!info) throw new Error("Account not found.");

  const program = newProgram<Program>(IDL, programId, provider);

  const gameAccount = await program.coder.accounts.decode("Game", info.data);
  console.log(gameAccount);
  
  return {
    address,
    players: gameAccount.players,
    turn: gameAccount.turn,
    board: gameAccount.board,
    state: gameAccount.state,
  };
}