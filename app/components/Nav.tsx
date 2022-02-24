import React from 'react';
import { ConnectWalletButton } from '@gokiprotocol/walletkit';
import styled from '@emotion/styled';

export const Nav = () => {

  return (
    <nav>
      <div>
        <a href='/created'>Created</a>
        <a href='/active'>Active</a>
        <a href='/explore'>Explore</a>
      </div>
      <ConnectWalletButton />
    </nav>
  )
}