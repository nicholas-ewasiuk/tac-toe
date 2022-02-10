import React, { ChangeEventHandler, FC, useState, FormEventHandler, MouseEventHandler, useEffect } from 'react';
import {  Program, ProgramAccount, Idl } from '@project-serum/anchor';
import { AccountInfo, Commitment, Keypair, ParsedAccountData, PublicKey, Struct, SystemProgram } from '@solana/web3.js';
import { newProgram, buildCoderMap, SuperCoder, AnchorTypes } from '@saberhq/anchor-contrib';
import { useSolana, useConnectedWallet } from '@saberhq/use-solana';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Buffer } from 'buffer';

import * as styles from './NewPage.module.css';

import { TIC_TAC_TOE_ID } from '../../utils/constants';
import { ticTacToeIdl } from '../../utils/ticTacToeIdl';
import { GameList } from '../sections/GameList';
import { Board } from '../sections/Board';


export const NewPage: FC = () => {
    const [ currentGame, setCurrentGame ] = useState<PublicKey | null>(null);
    const [ myGame, setMyGame ] = useState<string | null>(null);
    const [ playerGames, setPlayerGames ] = useState<string | null>(null);
    const [ walletInput, setWalletInput ] = useState<string>('');
    const [ turnInput, setTurnInput ] = useState<string>('');
    const [ setupGameList, setSetupGameList ] = useState<{
        pubkey: PublicKey;
        account: AccountInfo<Buffer | ParsedAccountData>;
      }[] | null>(null);

    const [ joinedGameList, setJoinedGameList ] = useState<{
        pubkey: PublicKey;
        account: AccountInfo<Buffer | ParsedAccountData>;
      }[] | null>(null);
    const [ gameBoard, setGameBoard ] = useState<[][] | null>(null);
    const [ plantList, setPlantList ] = useState<{
        pubkey: PublicKey;
        account: AccountInfo<Buffer>;
      }[] | null>(null);

    const preflightCommitment = 'processed'; // Move these
    const commitment = 'processed';          // later.

    const { providerMut, network, connection, setNetwork } = useSolana();
    const wallet = useConnectedWallet();

    useEffect(() => {
        setNetwork("devnet");
    },[])

    const setupGame = async () => {
        if (wallet && providerMut) {
            const program = newProgram<Program>(ticTacToeIdl, TIC_TAC_TOE_ID, providerMut);
            const player = wallet;
            const gameKeypair = Keypair.generate();

            setCurrentGame(gameKeypair.publicKey);

            console.log(`loading program at ${program.programId} on network ${network}`);

            await program.rpc.setupGame({
                accounts: {
                    game: gameKeypair.publicKey,
                    playerOne: player.publicKey,
                    systemProgram: SystemProgram.programId
                },
                signers: [gameKeypair]
            });
        }
    }

    const joinGame = async () => {
        if (wallet && providerMut && currentGame) {
            const program = newProgram<Program>(ticTacToeIdl, TIC_TAC_TOE_ID, providerMut);
            const player = wallet;

            console.log(`joining game at address ${currentGame}`);

            await program.rpc.playerJoin({
                accounts: {
                    game: currentGame,
                    playerTwo: player.publicKey,
                }
            });
        }

    }

    const playTurn = async (tile: {row: number, column: number}) => {
        if (wallet && providerMut && currentGame) {
            const program = newProgram<Program>(ticTacToeIdl, TIC_TAC_TOE_ID, providerMut);
            const player = wallet;

            await program.rpc.play(tile, {
                accounts: {
                    game: currentGame,
                    player: player.publicKey,
                }
            });
        }
    }

    const getAccountData = async (account: PublicKey, programId: PublicKey, idl: Idl) => {
        if (account instanceof PublicKey) {
            const accountInfo = await connection.getAccountInfo(account);
            if (accountInfo) {
                return new SuperCoder(programId, idl).coder.accounts.decode("Game", accountInfo.data)
            }
        }
    }

    const getBoardData = async () => {
        if (currentGame) {
            const game = await getAccountData(currentGame, TIC_TAC_TOE_ID, ticTacToeIdl);
            setGameBoard(game.board);
        }
    }

    const searchGamesByPlayer = async (address: string) => {
        const setupGames = await connection.getParsedProgramAccounts(
            TIC_TAC_TOE_ID,
            {
                filters: [
                    {
                        memcmp: {
                            offset: 8,
                            bytes: address,
                        }
                    }
                ]
            }
        )
        const joinedGames = await connection.getParsedProgramAccounts(
            TIC_TAC_TOE_ID,
            {
                filters: [
                    {
                        memcmp: {
                            offset: 40,
                            bytes: address,
                        }
                    }
                ]
            }
        )
        console.log(
            `Found ${setupGames.length} games setup by this wallet ${address}: `
        );
        setupGames.forEach((account, i) => {
            console.log(
                `-- Game Address ${i + 1}: ${account.pubkey.toString()}`
            );
        });
        console.log(
            `Found ${joinedGames.length} games joined by this wallet ${address}: `
        );
        joinedGames.forEach((account, i) => {
            console.log(
                `-- Game Address ${i + 1}: ${account.pubkey.toString()}`
            );
        });
        console.log(setupGames);
        setSetupGameList(setupGames);
        setJoinedGameList(joinedGames);
    }

    const updateWalletInput: ChangeEventHandler<HTMLInputElement> = async (event) => {
        if (event.target) {
          setWalletInput(event.target.value);
        }
    }

    const updateTurnInput: ChangeEventHandler<HTMLInputElement> = async (event) => {
        setTurnInput(event.target.value);
    }

    const handleSearchSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        console.log('A name was submitted: ' + walletInput);
        await searchGamesByPlayer(walletInput);
    }

    const handleTurnSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        const jsonStr = turnInput.replace(/(\w+:)|(\w+ :)/g, function(matchedStr) {
            return '"' + matchedStr.substring(0, matchedStr.length - 1) + '":';
          });
        const turn = JSON.parse(jsonStr) as {row: number, column: number};
        console.log('A name was submitted: ' + turn);
        await playTurn(turn);
        await getBoardData();
    }

    const getListItem: MouseEventHandler<Element> = (event) => {
        const target = event.target;
        if (target instanceof HTMLLIElement && target.textContent) {
            try {
                const address = new PublicKey(target.textContent);
                setCurrentGame(address);
                setMyGame(target.textContent);
            } catch (e) {
                console.log(e);
            }
        }
    }

    return (
        <div className={styles.root}>
            <div>
                <WalletMultiButton />
                <WalletDisconnectButton />
            </div>
            <div>
                <button disabled={!providerMut} onClick={setupGame}>
                    Create Game
                </button>
                <button disabled={!providerMut} onClick={joinGame}>
                    Join Game
                </button>
                <button onClick={getBoardData}>
                    Fetch Current Board
                </button>
            </div>
            <form onSubmit={handleSearchSubmit}>
              <label>
                Search Games By Player Address:
                <input type="text" value={walletInput} onChange={updateWalletInput} />
              </label>
              <input type="submit" value="Submit" />
            </form>
            <form onSubmit={handleTurnSubmit}>
              <label>
                Play Turn:
                <input type="text" value={turnInput} onChange={updateTurnInput} />
              </label>
              <input type="submit" value="Submit" />
            </form>
            <ul>
            {setupGameList &&
                <GameList
                title="Setup Games:"
                onClick={getListItem}
                gameAccounts={setupGameList}
                />}
            {joinedGameList &&
                <GameList
                title="Joined Games:"
                onClick={getListItem}
                gameAccounts={joinedGameList}/>}
            </ul>
            <div>
                Current Game: {myGame}
            </div>
            {gameBoard && 
              <Board
                title="My Game"
                onClick={getListItem}
                board={gameBoard}/>}
            {plantList && 
              <GameList
                title="plants"
                onClick={getListItem}
                gameAccounts={plantList}/>}
        </div>
    );
};
