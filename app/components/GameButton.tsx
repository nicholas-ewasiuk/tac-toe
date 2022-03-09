/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

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