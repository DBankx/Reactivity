import React from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
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
      </Container>
    </Menu>
  );
};

export default observer(Navbar);
