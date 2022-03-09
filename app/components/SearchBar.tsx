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
      <SearchForm onSubmit={handleSearchSubmit}>
        <InputText
          type="text" 
          placeholder="Enter a player's address"
          value={searchInput} 
          onChange={updateSearchInput} 
        />
        <InputBtn
          type="submit" 
          value="Search" 
        />
      </SearchForm>
      <ListItems
        onClick={onClick}
        address={searchPubkey}
        connection={connection}
        isActive={false}
      /> 
    </>
  );
}

const SearchForm = styled.form`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 20px 0 0 0;
  background: #70ed9d;
  border-radius: 4px;
`

const InputText = styled.input`
  padding: 6px;
  border: none;
  border-radius: 4px;
  background-color: inherit;
  &:focus {
    outline: none;
  }
`

const InputBtn = styled.input`
  margin: 0 10px 0 0;
  border: none;
  border-radius: 4px;
  background: #B5B5B5;
`