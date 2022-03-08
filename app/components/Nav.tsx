/** @jsxImportSource @emotion/react */
import React from 'react';
import { ConnectWalletButton } from '@gokiprotocol/walletkit';
import { css } from "@emotion/react";
import styled from '@emotion/styled';
import { lighten } from 'polished';
import { ConnectedWallet } from '@saberhq/use-solana';
import { SolLogo } from './images/SolLogo';

type Props = {
  wallet: ConnectedWallet | null,
};

export const Nav = ({ wallet }: Props) => {
  return (
    <NavBar>
      <h1>
        TIC-TAC-TOE
      </h1>
      { wallet ? (
        <Button>
          <SolLogo
            css={css`
              height: 13px;
              width: 16px;
            `}
          />
          <span>Connected</span>
        </Button>
      ) : (
        <ConnectWalletButton variant="primary" />
      )}
    </NavBar>
  )
}

const NavBar = styled.ul`
  display: flex;
  flex-direction: row;
  height: 100px;
  width: 900px;
  align-items: center;
  justify-content: center;
  & > h1 {
    margin-right: 50px;
  }
`
const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;

  cursor: pointer;
  border: none;
  outline: none;
  height: 40px;
  mix-blend-mode: normal;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  padding: 0 12px;

  background: #70ed9d;
  color: #000;
  &:hover {
    background: ${lighten(0.1, "#70ed9d")};
  }

  & > span {
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
  }
`;
