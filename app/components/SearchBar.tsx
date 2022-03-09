/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Connection, ParsedAccountData, PublicKey } from '@solana/web3.js';
import { ListItems } from './ListItems';

type Props = {
  onClick: React.MouseEventHandler;
  connection: Connection,
};

export const SearchBar = ({ onClick, connection }: Props) => {
  const [ searchInput, setSearchInput ] = useState<string>("");
  const [ searchPubkey, setSearchPubkey ] = useState<PublicKey | undefined>(undefined);

  const updateSearchInput: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      if (event.target) {
        setSearchInput(event.target.value);
      }
  }

  const handleSearchSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const getPubkey = (input: string) => {
      let address: PublicKey | undefined;
      try {
        address = new PublicKey(input);
        return address;
      } catch (e) {
        return undefined;
      }
    }
    const pubkey = getPubkey(searchInput);
    setSearchPubkey(pubkey);
  }
  
  return (
    <>
      <form 
        css={css`
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          margin: 20px 0 0 0;
          border-radius: 10px;
          padding: 5px;
          ${base};
        `}
        onSubmit={handleSearchSubmit}>
        <input
          css={css`
            border: none;
            border-radius: 10px;
            padding: 6px;
            ${secondary}
            font-size: 18px;
            color: #78a3af;
            &:focus {
              outline: none;
            }
          `}
          type="text" 
          placeholder="Search Player Address"
          value={searchInput} 
          onChange={updateSearchInput} 
        />
        <input
          css={css`
            margin: 0 10px 0 10px;
            border: none;
            border-radius: 40px;
            padding: 5px;
            ${tertiary}
            font-size: 18px;
            color: #ffffff;
          `}
          type="submit" 
          value="+" 
        />
      </form>
      <ListItems
        onClick={onClick}
        address={searchPubkey}
        connection={connection}
        isActive={false}
      /> 
    </>
  );
}

const base = css`
  background: #6b859d;
`

const secondary = css`
  background: #dbdfe5;
`

const tertiary = css`
  background: #6099aa;
`