import React from 'react';
import { ConnectWalletButton } from '@gokiprotocol/walletkit';
import styled from '@emotion/styled';

export const Nav = () => {
  return (
    <NavBar>
      <div>
        <a href='/search'>
          <button>
            Explore
          </button>
        </a>
      </div>
      <ConnectWalletButton />
    </NavBar>
  )
}

const NavBar = styled.ul`
  display: flex;
  flex-direction: row;

`