/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { lighten } from 'polished';
import { ConnectedWallet } from '@saberhq/use-solana';
import { ConnectWalletButton } from '@gokiprotocol/walletkit';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { SolLogo } from './images/SolLogo';

type Props = {
  wallet: ConnectedWallet | null,
  balance: number | null,
}

export const ModdedWalletButton = ({ wallet, balance }: Props) => {
  return (
    <>
    { wallet ? (
      <button css={[button, connected]}>
        <SolLogo 
          width={18}
          height={16}/>
        <span>
          Balance:{" "}
          {typeof balance === "number"
              ? `${(balance / LAMPORTS_PER_SOL).toLocaleString()} SOL`
              : "--"} 
        </span>
      </button>
    ) : (
      <ConnectWalletButton
        css={css`
          ${button}
        `} 
      />
    )}
    </>
  )
}

const button = css`
  display: flex;
  align-items: center;
  gap: 12px;
  outline: none;
  border: none;
  border-radius: 10px;
  height: 40px;
  padding: 7px 28px 7px 28px;
  background: #6099aa;
  cursor: pointer;
  font-size: 18px;
  color: #ffffff;
  mix-blend-mode: normal;
  transition: background .1s ease;
  &:hover {
    background: ${lighten(0.1, "#6099aa")};
  }
  & > span {
    font-weight: inherit;
    font-size: 20px;
  }
`;

const connected = css`
  background: #6b859d;
  &:hover {
    background: #6b859d;
  }
  & > span {
    font-weight: inherit;
    font-size: 16px;
  }
`

