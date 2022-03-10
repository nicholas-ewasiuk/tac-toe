/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { lighten } from 'polished';
import { css } from '@emotion/react';
import { ListItems } from './ListItems';
import { breakpoints } from '../App';
import { SearchIcon } from './images/SearchIcon';


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
          ${breakpoints.mobile} {
            width: 348px;
            height: 56px;
          }
          padding: 5px;
          background: #6b859d;
        `}
        onSubmit={handleSearchSubmit}>
        <input
          css={css`
            border: none;
            border-radius: 10px;
            padding: 6px;
            background: #dbdfe5;
            font-size: 18px;
            ${breakpoints.mobile} {
              width: 350px;
              height: 40px;
              font-size: 20px;
            }
            color: #476974;
            &:focus {
              outline: none;
            }
          `}
          type="text" 
          placeholder="Search Player Address"
          value={searchInput} 
          onChange={updateSearchInput} 
        />
        <button
          css={css`
            margin: 0 5px 0 10px;
            border: none;
            border-radius: 20px;
            width: 30px;
            ${breakpoints.mobile} {
              width: 60px;
            }
            padding: 5px;
            background: #6099aa;
            font-size: 18px;
            color: #ffffff;
            transition: background .04s ease;
            &:hover {
              background: ${lighten(0.1, "#6099aa")};
            }
          `}
          type="submit" 
          value="" 
        >
          <SearchIcon />
        </button>
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
