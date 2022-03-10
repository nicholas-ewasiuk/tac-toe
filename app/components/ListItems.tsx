/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { AccountInfo, ParsedAccountData, PublicKey } from '@solana/web3.js';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { Connection } from '@solana/web3.js';
import styled from '@emotion/styled';
import { searchGames } from '../actions/searchGames';

type Props = {
  onClick: React.MouseEventHandler;
  address: PublicKey | undefined,
  connection: Connection,
  isActive: boolean,
};

export const ListItems = ({ onClick, address, connection, isActive }: Props) => {
  const [ listItems, setListItems ] = useState<EmotionJSX.Element[]>([<div key="1"></div>]);
  const [ gameAccounts, setGameAccounts ] = useState<{
    pubkey: PublicKey;
    account: AccountInfo<Buffer | ParsedAccountData>;
  }[] | null>(null);

  useEffect(() => {
    if (address) {
    const fetchGames = async () => {
        const { activeArray, createdArray } = await searchGames(connection, address);
        isActive ? setGameAccounts(activeArray) : setGameAccounts(createdArray);
      }
    fetchGames();
    } else { 
      setGameAccounts(null);
    }
  }, [address])

  useEffect(() => {
    if (gameAccounts) {
      const items = gameAccounts.map((account) => 
        <li 
          key={account.pubkey.toString()}
          id={account.pubkey.toString()}
          >
            {account.pubkey.toString().slice(0,12) + '...' + account.pubkey.toString().slice(-12)}
        </li>
      );
      setListItems(items);
    } else {
      setListItems([<div key="1"></div>]);
    }
  }, [gameAccounts])

  return (
    <List
      onClick={onClick}
    >
      {listItems}
    </List>
  );
}

const List = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0 0 0 0;
  border-radius: 10px;
  padding: 0px 0 0px 0;
  background: #dbdfe5;
  text-align: center;
  list-style: none;
  li {
    margin: 10px 0 10px 0;
    font-size: 14px;
    color: #476974;
    transition: color .1s ease;
    &:hover {
      color: #000000;
    }
  }
`
