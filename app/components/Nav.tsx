import React from 'react';
import { ConnectWalletButton } from '@gokiprotocol/walletkit';
import styled from '@emotion/styled';

export const Nav = () => {

  return (
    <NavBar>
      <div>
        <a href='/created'>
          <button>
            Created
          </button>
        </a>
        <a href='/active'>
          <button>
            Active
          </button>
        </a>
        <a href='/explore'>
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