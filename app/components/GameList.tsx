/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { css } from '@emotion/react';
import { Connection, PublicKey } from '@solana/web3.js';
import { DownIcon } from './images/DownIcon';
import { ListItems } from './ListItems';
import { breakpoints } from '../App';

type Props = {
  onClick: React.MouseEventHandler;
  title: string,
  address: PublicKey | undefined,
  connection: Connection,
  isActive: boolean,
};

/**
 * Wrapper for the ListItems component. Allows opening and closing menu.
 */
export const GameList = ({ onClick, title, address, connection, isActive }: Props) => {
  const [ isOpen, setIsOpen ] = useState(false);
  
  return (
    <div
      css={css`
      display: flex;
      flex-direction: column;
      ${breakpoints.mobile} {
        width: 348px;
      }
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
          ${breakpoints.mobile} {
            height: 50px;
          }
          padding: 7px 18px 7px 18px;
          background: #6b859d;
          cursor: pointer;
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
