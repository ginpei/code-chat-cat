import React from 'react';
import DefaultLayout from '../components/DefaultLayout';
import { HomeLink } from '../path';

export default function PrivacyPage () {
  return (
    <DefaultLayout>
      <h1>Privacy</h1>
      <p><HomeLink/></p>
      <p>This is currently beta. You have to understand whatever would happen.</p>
    </DefaultLayout>
  );
}
