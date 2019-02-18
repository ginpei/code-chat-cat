import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const headerHeight = 12 * 1.6;

const Container = styled.header`
  background-color: #036;
  color: #fff;
  font-size: 12px;
  height: 1.6em;
  line-height: 1.6em;
  padding: 0 1rem;
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

interface IHeaderProps {
  title?: string;
  titleHref?: string;
}

export default class Header extends React.Component<IHeaderProps> {
  public render () {
    return (
      <Container>
        <Title>
          {this.props.title ? (
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
      </Container>
    );
  }
}
