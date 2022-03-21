/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { lighten } from 'polished';
import { ConnectedWallet, useWallet } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { SolLogo } from './images/SolLogo';
import { breakpoints } from '../App';

type Props = {
  wallet: ConnectedWallet | null,
  balance: number | null,
}

/**
 * Added functionality and styles for the @gokiprotocol/walletkit "ConnectWalletButton".
 */
export const WalletButton = ({ wallet, balance }: Props) => {
  const { connect } = useWalletKit();

  return (
    <>
    { wallet ? (
      <button css={[button, connected]}>
        <div
          css={css`
            width: 18px;
            ${breakpoints.mobile} {
              width: 40px;
            }
          `}
        >
          <SolLogo />
        </div>
        <span>
          {" "}
          {typeof balance === "number"
              ? `${(balance / LAMPORTS_PER_SOL).toLocaleString()} SOL`
              : "--"} 
        </span>
      </button>
    ) : (
      <button
        css={[button]}
        onClick={connect}
      >
        <div
          css={css`
            width: 18px;
            ${breakpoints.mobile} {
              width: 40px;
            }
          `}
        >
          <SolLogo />
        </div>
        <span>Connect Wallet</span>
      </button>
    )}
    </>
  )
}

const button = css`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 12px;
  outline: none;
  border: none;
  @media (max-width: 576px) {
    margin: 0 20px 0 0;
    width: 140px;
    height: 60px;
  }
  box-shadow: none;
  border-radius: 10px;
  width: 200px;
  height: 40px;
  padding: 7px 28px 7px 28px;
  background: #6099aa;
  color: #ffffff;
  transition: background .1s ease;
  &:hover {
    background: ${lighten(0.1, "#6099aa")};
  }
  & > span {
    font-weight: inherit;
    font-size: 16px;
  }
`;

const connected = css`
  background: #6b859d;
  &:hover {
    background: #6b859d;
  }
  & > span {
    font-weight: inherit;
    font-size: 18px;
  }
`

