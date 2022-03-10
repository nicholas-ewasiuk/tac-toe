/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { lighten } from 'polished';
import { breakpoints } from '../App';

type Props = {
  onClick: React.MouseEventHandler;
  title: string,
}

/**
 * Button for game actions
 */
export const GameButton = ({ onClick, title }: Props) => {
  return (
    <button
      css={css`
        border: none;
        border-radius: 10px;
        ${breakpoints.mobile} {
          width: 260px;
          height: 60px;
          font-size: 20px;
        }
        padding: 7px 28px 7px 28px;
        background: #6099aa;
        font-size: 18px;
        color: #ffffff;
        transition: background .1s ease;
        &:hover {
          background: ${lighten(0.1, "#6099aa")};
        }
      `}
      onClick={onClick}
    >
      {title}
    </button>
  )
}
