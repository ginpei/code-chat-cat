import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Container from './Container';
import HeaderMenu, { IHeaderMenu } from './HeaderMenu';

export const headerHeight = 12 * 1.6;

const OuterContainer = styled.header`
  background-color: #036;
  color: #fff;
  font-size: 12px;
  height: 1.6em;
  line-height: 1.6em;
`;
const ItemsContainer = styled.div`
  justify-content: space-between;
  display: flex;
`;
const Title = styled.div`
  font-weight: bold;
`;
const HeaderLink = styled(Link)`
  color: snow;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
const FullscreenContainer = styled.div`
  padding: 0 1rem;
`;

function InnerContainer (props: any) {
  if (props.fullscreen) {
    return (
      <FullscreenContainer>{props.children}</FullscreenContainer>
    );
  }

  return (
    <Container>{props.children}</Container>
  );
}

interface IHeaderProps {
  menus?: IHeaderMenu[];
  title?: string;
  titleHref?: string;
  fullscreen?: boolean;
}

export default class Header extends React.Component<IHeaderProps> {
  public static defaultProps: Partial<IHeaderProps> = {
    fullscreen: false,
  };

  public render () {
    return (
      <OuterContainer>
        <InnerContainer fullscreen={this.props.fullscreen}>
          <ItemsContainer>
            <Title>
              {this.props.title !== undefined ? (
                this.props.titleHref ? (
                  <HeaderLink to={this.props.titleHref}>
                    {this.props.title}
                  </HeaderLink>
                ) : (
                  <span>{this.props.title}</span>
                )
              ) : (
                <HeaderLink to="/">Code Chat Cat</HeaderLink>
              )}
            </Title>
            <HeaderMenu menus={this.props.menus}/>
          </ItemsContainer>
        </InnerContainer>
      </OuterContainer>
    );
  }
}
