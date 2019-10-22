import React from 'react';
import styled from 'styled-components';
import DefaultLayout from '../complexes/DefaultLayout';
import { HomeLink } from '../path';
import Emoji from '../independents/Emoji';

const ErrorMessage = styled.p`
  background-color: #fdd;
  border: solid 1px tomato;
  color: tomato;
  padding: 1rem;
`;

const ErrorView: React.FC<{
  error: Error | firebase.auth.Error,
}> = ({ error }) => (
  <DefaultLayout>
    <h1>Error</h1>
    <p><HomeLink /></p>
    <p>
      Sorry for inconvenient. This is not your fault, nayn.
      <Emoji label="CatCry" />
    </p>
    <ErrorMessage>{error.message || '(Unknown)'}</ErrorMessage>
  </DefaultLayout>
);

export default ErrorView;
