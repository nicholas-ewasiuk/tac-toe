/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { css } from '@emotion/react';
import { AccountInfo, ParsedAccountData, PublicKey } from '@solana/web3.js';
import { DownIcon } from './images/DownIcon';


type Props = {
  title: string,
  children: JSX.Element,
};

export const ListTopLevel = ({ title, children }: Props) => {
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
      {isOpen && children}
    </div>
  );
}
