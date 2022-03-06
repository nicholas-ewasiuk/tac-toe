import { AccountInfo, ParsedAccountData, PublicKey } from '@solana/web3.js';
import React from 'react';

type Props = {
  onClick: React.MouseEventHandler;
  gameAccounts: {
    pubkey: PublicKey;
    account: AccountInfo<Buffer | ParsedAccountData>;
  }[],
};

export const GameList = ({ onClick, gameAccounts}: Props) => {
  
  const listItems = gameAccounts.map((account) => 
    <li 
      key={account.pubkey.toString()}
      >
        {account.pubkey.toString()}
    </li>
  );

  return (
    <ul
      onClick={onClick}
    >
      {listItems}
    </ul>
  );
}
