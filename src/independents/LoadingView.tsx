import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  align-items: center;
  background-color: #fff9;
  box-shadow: 0 0 20vmin #0003 inset;
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1;
`;

const CatContainer = styled.div`
  font-size: 10vmin;
  height: 1em;
  margin: 1em auto;
  position: fixed;
  width: 6em;
`;

const WalkingCat = styled.span`
  animation: walking 3s infinite steps(4, start);
  height: 1em;
  position: absolute;
  width: 100%;

  @keyframes walking {
    0% { transform: translateX(calc(100% - 1em)) scaleX(1); }
    50% { transform: translateX(0) scaleX(1); }
    50.01% { transform: scaleX(-1) translateX(calc(100% - 1em)); }
    100% { transform: scaleX(-1) translateX(0); }
    /* 0% { left: calc(100% - 1em); transform: scaleX(1); }
    50% { left: 0; transform: scaleX(1); }
    50.01% { left: 0; transform: scaleX(-1); }
    100% { left: calc(100% - 1em); transform: scaleX(-1); } */
  }
`;

export default function LoadingView () {
  return (
    <Wrapper>
      <CatContainer>
        <WalkingCat>🐈</WalkingCat>
      </CatContainer>
    </Wrapper>
  );
}
