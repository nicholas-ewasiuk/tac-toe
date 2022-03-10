/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { lighten } from 'polished';
import { breakpoints } from '../App';

type Props = {
  onClick: React.MouseEventHandler,
  title: string,
}

export const FaucetButton = ({ onClick, title }: Props) => {
  return (
    <button
      css={css`
        margin: 10px 0 0 0;
        border: none;
        border-radius: 10px;
        width: 200px;
        padding: 7px 28px 7px 28px;
        ${breakpoints.mobile} {
          margin: 0;
          width: 140px;
          padding: 10px 28px 9px 28px;;
        }
        background: #6099aa;
        font-size: 18px;
        color: #ffffff;
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
