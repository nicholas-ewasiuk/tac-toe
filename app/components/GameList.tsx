import { AccountInfo, ParsedAccountData, PublicKey } from '@solana/web3.js';
import React from 'react';
import * as styles from './GameList.module.css';

type GameListProps = {
  title: string,
  onClick: React.MouseEventHandler;
  gameAccounts: {
    pubkey: PublicKey;
    account: AccountInfo<Buffer | ParsedAccountData>;
  }[],
};

export const GameList = ({title, onClick, gameAccounts}: GameListProps) => {
  
  const listItems = gameAccounts.map((account) => 
    <li 
      key={account.pubkey.toString()}
      >
        {account.pubkey.toString()}
    </li>
  );

  return (
    <li 
      key={title}
      onClick={onClick}
      >
        {title}
      <ul>{listItems}</ul>
    </li>
  );
}
