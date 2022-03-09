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
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          margin: 20px 0 0 0;
          border-radius: 10px;
          padding: 7px 18px 7px 18px;
          ${base};
          font-size: 22px;
          font-weight: inherit;
          color: #ffffff;
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

const base = css`
  background: #6b859d;
`