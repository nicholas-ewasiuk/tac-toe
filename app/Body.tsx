/** @jsxImportSource @emotion/react */
import { useCallback, ChangeEventHandler, FC, useState, FormEventHandler, MouseEventHandler, useEffect } from 'react';
import { AccountInfo, LAMPORTS_PER_SOL, ParsedAccountData, PublicKey, SystemProgram } from '@solana/web3.js';
import { PendingTransaction } from '@saberhq/solana-contrib';
import { useSolana, useConnectedWallet } from '@saberhq/use-solana';
import { Buffer } from 'buffer';
import { Nav } from './components/Nav';

import { TIC_TAC_TOE_ID } from './constants';
import { GameList } from './components/GameList';
import { Board } from './components/Board';
import { css } from "@emotion/react";
import styled from '@emotion/styled';
import { setupGame } from './actions/setupGame';
import { getGame } from './state/game';
import { joinGame } from './actions/joinGame';
import { playTurn } from './actions/playTurn';


export const Body: FC = () => {
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

    const { providerMut, network, connection } = useSolana();
    const wallet = useConnectedWallet();

    const refetchSOL = useCallback(async () => {
        if (wallet && providerMut) {
          setBalance(await providerMut.connection.getBalance(wallet.publicKey));
        }
      }, [providerMut, wallet]);

    useEffect(() => {
        if (wallet) {
            searchGamesByPlayer(wallet.publicKey.toString());
            getBoardData();
        }
    },[wallet, currentGame])

    useEffect(() => {
        void refetchSOL();
      }, [refetchSOL]);


    const handleSetupGame = async () => {
        if (wallet && providerMut) {
            setupGame(providerMut, wallet);
            searchGamesByPlayer(wallet.publicKey.toString());
            getBoardData();
        }
    }

    const handleJoinGame = async () => {
        if (wallet && providerMut && currentGame) {
            joinGame(providerMut, wallet, currentGame);
            searchGamesByPlayer(wallet.publicKey.toString());
            getBoardData();
        }

    }

    const getBoardData = async () => {
        if (currentGame && providerMut) {
            const { board, players } = await getGame(providerMut, connection, currentGame);
            setGameBoard(board);
            if (players[0]) {
                setPlayerOne(players[0]);
            }
            if (players[1] && players[1].toString() !== "11111111111111111111111111111111") {
                setPlayerTwo(players[1]);
            }
        }
    }

    const searchGamesByPlayer = async (address: string) => {
        console.clear();
        const setupGames = await connection.getProgramAccounts(
            TIC_TAC_TOE_ID,
            {
                dataSlice: { offset: 8, length: 64 },
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
        const joinedGames = await connection.getProgramAccounts(
            TIC_TAC_TOE_ID,
            {
                dataSlice: { offset: 8, length: 64 },
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
        /* Figure out comparing object arrays.
        for (let i = 0; i < joinedGames.length; i++) {
            if (activeArray.indexOf(joinedGames[i]) === -1) {
                activeArray.push(joinedGames[i]);
            }
        }
        */

        setSetupGameList(createdArray);
        setJoinedGameList(activeArray);
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
            const tile = JSON.parse(jsonStr) as {row: number, column: number};
            console.log('A tile was submitted: ' + JSON.stringify(tile));
            if (wallet && providerMut && currentGame) {
                await playTurn(providerMut, wallet, currentGame, tile);
                getBoardData();
            }
        }
    }

    const getListItem: MouseEventHandler<Element> = (event) => {
        const target = event.target;
        if (target instanceof HTMLLIElement && target.textContent) {
            try {
                const address = new PublicKey(target.textContent);
                setCurrentGame(address);
                getBoardData();
            } catch (e) {
                console.log(e);
            }
        }
    }

    return (
        <AppWrapper>
            <section>
                <p>
                    Current Game: {currentGame?.toString()}
                </p>
                {gameBoard && 
                <Board
                    title="My Game"
                    onClick={handleTurnSubmit}
                    board={gameBoard}/>}
            </section>
            <Side>
                <Nav />
                <div css={css`margin: 1em 0 0 0;`}>
                    Player One: 
                    {playerOne 
                        ? playerOne.toString() 
                        : <button 
                            css={css`margin: 0 0 0 1em;`}
                            disabled={!providerMut} 
                            onClick={handleSetupGame}
                            >
                                Create Game
                        </button>
                    }
                </div>
                <div css={css`margin: 1em 0 0 0;`}>
                Player Two:
                    {playerTwo 
                        ? playerTwo.toString() 
                        : <button 
                            css={css`margin: 0 0 0 1em;`}
                            disabled={!providerMut} 
                            onClick={handleJoinGame}
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
                    title="Active Games:"
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
                <div 
                    css={css`
                        display: flex;
                        flex-direction: row;
                        margin: 2em 0 0 0;
                    `}
                >
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
            </Side>
        </AppWrapper>
    );
};

const AppWrapper = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const Side = styled.div`
    width: 420px;
    margin-left: 2em;
`;
