/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Connection, PublicKey } from '@solana/web3.js';
import { lighten } from 'polished';
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
      <SearchForm
        onSubmit={handleSearchSubmit}>
        <TextInput
          type="text" 
          placeholder="Search Player Address"
          value={searchInput} 
          onChange={updateSearchInput} 
        />
        <BtnInput
          type="submit" 
          value="+" 
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
  border-radius: 10px;
  padding: 5px;
  background: #6b859d;
`

const TextInput = styled.input`
  border: none;
  border-radius: 10px;
  padding: 6px;
  background: #dbdfe5;
  font-size: 18px;
  color: #476974;
  &:focus {
    outline: none;
  }
`

const BtnInput = styled.input`
  margin: 0 10px 0 10px;
  border: none;
  border-radius: 40px;
  padding: 5px;
  background: #6099aa;
  font-size: 18px;
  color: #ffffff;
  transition: background .04s ease;
  &:hover {
    background: ${lighten(0.1, "#6099aa")};
  }
`