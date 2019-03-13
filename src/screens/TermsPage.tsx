import React from 'react';
import DefaultLayout from '../containers/DefaultLayout';
import { HomeLink } from '../path';

export default function TermsPage () {
  return (
    <DefaultLayout>
      <h1>Terms of service</h1>
      <p><HomeLink/></p>
      <p>This is currently beta. You have to understand whatever would happen.</p>
    </DefaultLayout>
  );
}
