/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { AccountInfo, ParsedAccountData, PublicKey } from '@solana/web3.js';


type Props = {
  onClick: React.MouseEventHandler;
  gameAccounts: {
    pubkey: PublicKey;
    account: AccountInfo<Buffer | ParsedAccountData>;
  }[],
};

export const GameList = ({ onClick, gameAccounts }: Props) => {
  
  const listItems = gameAccounts.map((account) => 
    <li 
      key={account.pubkey.toString()}
      >
        {account.pubkey.toString()}
    </li>
  );

  return (
    <ul
      css={css`
        background: #e6e6e6ff;
        border-radius: 4px;
        margin: 0px;
        padding: 0px;
        list-style: none;
      `}
      onClick={onClick}
    >
      {listItems}
    </ul>
  );
}
