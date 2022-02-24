import React from 'react';
import styled from '@emotion/styled';

import { Nav } from '../components/Nav';

export const Explore: React.FC = () => {

  return (
    <AppWrapper>
      <h1>Explore</h1>
    </AppWrapper>
  );
};

const AppWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;