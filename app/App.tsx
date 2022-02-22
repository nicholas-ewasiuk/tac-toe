import React from 'react';
import { WalletKitProvider } from '@gokiprotocol/walletkit';
import { Body } from './Body';

function App() {
  return (
    <WalletKitProvider
      defaultNetwork='devnet'
      app={{
        name: 'tic-tac-toe',
      }}>
      <Body />
    </WalletKitProvider>
  )
}

export default App;