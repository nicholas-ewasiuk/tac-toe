import * as anchor from '@project-serum/anchor';
import { expect } from 'chai';
import { Program } from '@project-serum/anchor';
import { TacToe } from '../target/types/tac_toe';

describe('tac-toe', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.TacToe as Program<TacToe>;

  async function play(program, game, player,
    tile, expectedTurn, expectedGameState, expectedBoard) {
      await program.rpc.play(tile, {
        accounts: {
          player: player.publicKey,
          game
        },
        signers: player instanceof (anchor.Wallet as any) ? [] : [player]
      });

      const gameState = await program.account.game.fetch(game);
      expect(gameState.turn).to.equal(expectedTurn);
      expect(gameState.state).to.eql(expectedGameState);
      expect(gameState.board)
        .to
        .eql(expectedBoard);
    }

  it('player one wins', async() => {
    const gameKeypair = anchor.web3.Keypair.generate();
    const playerOne = program.provider.wallet;
    const playerTwo = program.provider.wallet;
    await program.rpc.setupGame({
      accounts: {
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      signers: [gameKeypair]
    });

    let gameState = await program.account.game.fetch(gameKeypair.publicKey);
    expect(gameState.turn).to.equal(1);
    /*expect(gameState.players)
      .to
      .eql([playerOne.publicKey, null]);*/
    expect(gameState.state).to.eql({ active: {} });
    expect(gameState.board)
      .to
      .eql([[null,null,null],[null,null,null],[null,null,null]]);

    await program.rpc.playerJoin({
      accounts: {
        game: gameKeypair.publicKey,
        playerTwo: playerTwo.publicKey,
      },
    });

    try {
      await play(
        program,
        gameKeypair.publicKey,
        playerOne,
        {row: 0, column: 0},
        2,
        { active: {}, },
        [
          [{x:{}},null,null],
          [null,null,null],
          [null,null,null]
        ]
      );
    } catch (err) {
        console.log(err.toString());
    }

    try {
      await play(
        program,
        gameKeypair.publicKey,
        playerTwo,
        {row: 0, column: 1},
        3,
        { active: {}, },
        [
          [{x:{}},{o:{}},null],
          [null,null,null],
          [null,null,null]
        ]
      );
    } catch (err) {
        console.log(err.toString());
    }

    try {
      await play(
        program,
        gameKeypair.publicKey,
        playerOne,
        {row: 1, column: 1},
        4,
        { active: {}, },
        [
          [{x:{}},{o:{}},null],
          [null,{x:{}},null],
          [null,null,null]
        ]
      );
    } catch (err) {
        console.log(err.toString());
    }

    try {
      await play(
        program,
        gameKeypair.publicKey,
        playerTwo,
        {row: 0, column: 2},
        5,
        { active: {}, },
        [
          [{x:{}},{o:{}},{o:{}}],
          [null,{x:{}},null],
          [null,null,null]
        ]
      );
    } catch (err) {
        console.log(err.toString());
    }

    try {
      await play(
        program,
        gameKeypair.publicKey,
        playerOne,
        {row: 2, column: 2},
        5,
        { won: { winner: playerOne.publicKey }, },
        [
          [{x:{}},{o:{}},{o:{}}],
          [null,{x:{}},null],
          [null,null,{x:{}}]
        ]
      );
    } catch (err) {
        console.log(err.toString());
    }

    let endGameState = await program.account.game.fetch(gameKeypair.publicKey);
    console.log(endGameState.state);
    console.log(endGameState.board);
  });
});
