import React from 'react';
import styled from 'styled-components';
import Container from '../basics/Container';

const FooterContainer = styled.footer`
border-top: 1px solid lavender;
margin-top: 1rem;
padding-top: 1rem;
padding-bottom: 1rem;
`;

export default function Footer () {
  return (
    <FooterContainer>
      <Container>
        <div>By Ginpei Takanashi</div>
      </Container>
    </FooterContainer>
  );
}
