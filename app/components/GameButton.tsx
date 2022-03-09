/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { Game } from '../state/game';
import { ConnectedWallet } from '@saberhq/use-solana';

type Props = {
  onClick: React.MouseEventHandler;
  title: string,
}

export const GameButton = ({ onClick, title }: Props) => {
  return (
    <button
      css={css`
        border: none;
        border-radius: 10px;
        padding: 7px 28px 7px 28px;
        background: #599baf;
        font-size: 18px;
        color: #ffffff;
      `}
      onClick={onClick}
    >
      {title}
    </button>
  )
}