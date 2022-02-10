import React, { useCallback, ChangeEventHandler, FC, useState, FormEventHandler, MouseEventHandler, useEffect } from 'react';
import {  Program, Idl } from '@project-serum/anchor';
import { AccountInfo, Keypair, LAMPORTS_PER_SOL, ParsedAccountData, PublicKey, Struct, SystemProgram } from '@solana/web3.js';
import { newProgram, SuperCoder } from '@saberhq/anchor-contrib';
import { PendingTransaction } from '@saberhq/solana-contrib';
import { useSolana, useConnectedWallet } from '@saberhq/use-solana';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Buffer } from 'buffer';

import * as styles from './NewPage.module.css';

import { TIC_TAC_TOE_ID } from '../utils/constants';
import { ticTacToeIdl } from '../utils/ticTacToeIdl';
import { GameList } from '../components/GameList';
import { Board } from '../components/Board';


export const NewPage: FC = () => {
    const [ balance, setBalance ] = useState<number | null>(null);
    const [ currentGame, setCurrentGame ] = useState<PublicKey | null>(null);
    const [ gameInput, setGameInput ] = useState<string>("");
    const [ playerOne, setPlayerOne ] = useState<PublicKey | null>(null);
    const [ playerTwo, setPlayerTwo ] = useState<PublicKey | null>(null);
    const [ setupGameList, setSetupGameList ] = useState<{
        pubkey: PublicKey;
        account: AccountInfo<Buffer | ParsedAccountData>;
      }[] | null>(null);

    const [ joinedGameList, setJoinedGameList ] = useState<{
        pubkey: PublicKey;
        account: AccountInfo<Buffer | ParsedAccountData>;
      }[] | null>(null);
    const [ gameBoard, setGameBoard ] = useState<[][] | null>(null);

    const { providerMut, network, connection, setNetwork } = useSolana();
    const wallet = useConnectedWallet();

    useEffect(() => {
        setNetwork("devnet");
    },[])

    useEffect(() => {
        if (wallet) {
            searchGamesByPlayer(wallet.publicKey.toString());
            getBoardData();
        }
    },[wallet, currentGame])

    const refetchSOL = useCallback(async () => {
        if (wallet && providerMut) {
          setBalance(await providerMut.connection.getBalance(wallet.publicKey));
        }
      }, [providerMut, wallet]);

    useEffect(() => {
        void refetchSOL();
      }, [refetchSOL]);


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
            searchGamesByPlayer(wallet.publicKey.toString());
            getBoardData();
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
            searchGamesByPlayer(wallet.publicKey.toString());
            getBoardData();
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
            console.log(game);
            setGameBoard(game.board);
            if (game.players[0]) {
                setPlayerOne(game.players[0]);
            }
            if (game.players[1] && game.players[1].toString() !== "11111111111111111111111111111111") {
                setPlayerTwo(game.players[1]);
            }
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

    const updateGameInput: ChangeEventHandler<HTMLInputElement> = async (event) => {
        if (event.target) {
          setGameInput(event.target.value);
        }
    }

    const handleGameSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        try {
            const address = new PublicKey(gameInput);
            setCurrentGame(address);
        } catch (e) {
            console.log(e);
        }
    }

    const handleTurnSubmit: MouseEventHandler<Element> = async (event) => {
        event.preventDefault();
        const target = event.target;
        if (target instanceof HTMLLIElement) {
            const row = target.parentNode.parentNode.value;
            const column = target.value;
            const turnInput = `{row: ${row}, column: ${column}}`
            const jsonStr = turnInput.replace(/(\w+:)|(\w+ :)/g, function(matchedStr) {
                return '"' + matchedStr.substring(0, matchedStr.length - 1) + '":';
            });
            const turn = JSON.parse(jsonStr) as {row: number, column: number};
            console.log('A name was submitted: ' + JSON.stringify(turn));
            await playTurn(turn);
            getBoardData();
        }
    }

    const getListItem: MouseEventHandler<Element> = (event) => {
        const target = event.target;
        if (target instanceof HTMLLIElement && target.textContent) {
            try {
                const address = new PublicKey(target.textContent);
                setCurrentGame(address);
            } catch (e) {
                console.log(e);
            }
        }
    }

    return (
        <div className={styles.root}>
            <div className={styles.main}>
                <div className={styles.game}>
                    <div>
                        Current Game: {currentGame?.toString()}
                    </div>
                    {gameBoard && 
                    <Board
                        title="My Game"
                        onClick={handleTurnSubmit}
                        board={gameBoard}/>}
                </div>
                <div className={styles.side}>
                    <WalletMultiButton />
                    <WalletDisconnectButton />
                    <div className={styles.player}>
                        Player One: 
                        {playerOne 
                            ? playerOne.toString() 
                            : <button 
                                disabled={!providerMut} 
                                onClick={setupGame}
                                >
                                    Create Game
                            </button>
                        }
                    </div>
                    <div className={styles.player}>
                    Player Two:
                        {playerTwo 
                            ? playerTwo.toString() 
                            : <button 
                                disabled={!providerMut} 
                                onClick={joinGame}
                                >
                                    Join Game
                            </button>
                        }
                    </div>
                    <ul>
                    {setupGameList &&
                        <GameList
                        title="Games Created:"
                        onClick={getListItem}
                        gameAccounts={setupGameList}
                        />}
                    {joinedGameList &&
                        <GameList
                        title="Games Joined:"
                        onClick={getListItem}
                        gameAccounts={joinedGameList}/>}
                    </ul>
                    <form onSubmit={handleGameSubmit}>
                      <label>
                        Load Game From Address:
                        <input type="text" value={gameInput} onChange={updateGameInput} />
                      </label>
                      <input type="submit" value="Submit" />
                    </form>
                    <div className={styles.airdrop}>
                        <div>
                            Balance:{" "}
                            {typeof balance === "number"
                                ? `${(balance / LAMPORTS_PER_SOL).toLocaleString()} SOL`
                                : "--"} 
                        </div>
                        <button 
                        disabled={!providerMut}
                        onClick={async () => {
                            const txSig = await connection.requestAirdrop(
                                providerMut.wallet.publicKey,
                                LAMPORTS_PER_SOL
                            );
                            await new PendingTransaction(
                                providerMut.connection,
                                txSig
                            ).wait();
                            await refetchSOL();
                        }}
                        >
                            Request 1 SOL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
