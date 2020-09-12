import React, { useContext } from 'react';
import { Menu, Container, Button, Dropdown, Image } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { NavLink, Link } from 'react-router-dom';
import { RootStoreContext } from '../../App/stores/rootStore';

const Navbar: React.FC = () => {
  const { isLoggedIn, user, logout } = useContext(RootStoreContext).userStore;

  return (
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item header as={NavLink} exact to='/'>
          <img
            src='/Assests/logo.png'
            alt='logo'
            style={{ marginRight: '10px' }}
          />
          Reactivities
        </Menu.Item>
        <Menu.Item as={NavLink} to='/activities'>
          Activities
        </Menu.Item>
        <Menu.Item>
          <Button
            as={NavLink}
            to='/createActivity'
            positive
            content='Create Activity'
          />
        </Menu.Item>
        {user && (
          <Menu.Item position='right'>
            <Image
              avatar
              spaced='right'
              src={user.image || '/Assests/user.png'}
            />
            <Dropdown pointing='top left' text={user.displayName}>
              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  to={`/profile/username`}
                  text='My profile'
                  icon='user'
                />
                <Dropdown.Item text='Logout' onClick={logout} icon='power' />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        )}
      </Container>
    </Menu>
  );
};

export default observer(Navbar);
