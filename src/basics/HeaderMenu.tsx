import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const MenuContainer = styled.div`
  align-items: flex-start;
  cursor: default;
  display: flex;

  &:hover {
    z-index: 1;
  }
`;
const MenuGroup = styled.div`
  background-color: #036;
  margin-left: 0em;
  padding: 0 1px;
  position: relative;

  &:hover {
    border: 1px silver;
    border-style: solid solid none;
    padding: 0;

    .HeaderMenu-MenuItemList {
      border: 1px solid silver;
      height: auto;
      opacity: 1;
      padding-top: 0.5em;
      transition: opacity 0ms;
    }
  }
`;
const MenuTitle = styled.span`
  padding: 0 0.5em;
`;
const MenuItemList = styled.div.attrs({
  className: 'HeaderMenu-MenuItemList',
})`
  background-color: #036;
  box-shadow: 0 0 20px #0006;
  height: 0;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  right: -1px;
  top: calc(1.6em - 1px);
  transition: opacity 200ms;
  min-width: 5em;
  z-index: -1;
`;
const MenuItem = styled(Link)`
  color: snow;
  display: block;
  padding: 0.4em 1em;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`;

export interface HeaderLink {
  title: string;
  href: string;
}
export interface HeaderMenuGroup {
  name: string;
  links: HeaderLink[];
}

interface Props {
  menus?: HeaderMenuGroup[];
}

export default class HeaderMenu extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    menus: [],
  };

  public render () {
    return (
      <MenuContainer>
        {this.props.menus!.map((menu) => (
          <MenuGroup key={menu.name}>
            <MenuTitle>{menu.name}</MenuTitle>
            <MenuItemList>
              {menu.links.map((link) => (
                <MenuItem
                  key={link.title}
                  to={link.href}
                >
                  {link.title}
                </MenuItem>
              ))}
            </MenuItemList>
          </MenuGroup>
        ))}
      </MenuContainer>
    );
  }
}
