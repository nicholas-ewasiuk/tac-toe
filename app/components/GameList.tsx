/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { css } from '@emotion/react';
import { Connection, ParsedAccountData, PublicKey } from '@solana/web3.js';
import { DownIcon } from './images/DownIcon';
import { ListItems } from './ListItems';

type Props = {
  onClick: React.MouseEventHandler;
  title: string,
  address: PublicKey | undefined,
  connection: Connection,
  isActive: boolean,
};

export const GameList = ({ onClick, title, address, connection, isActive }: Props) => {
  const [ isOpen, setIsOpen ] = useState(false);
  
  return (
    <div
      css={css`
      display: flex;
      flex-direction: column;
      `}
    >
      <h2
        css={css`
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          margin: 20px 0 0 0;
          background: #70ed9d;
          border-radius: 4px;
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <DownIcon />
      </h2>
      {isOpen && address &&
        <ListItems
          onClick={onClick}
          address={address}
          connection={connection}
          isActive={isActive}
        />}
    </div>
  );
}
