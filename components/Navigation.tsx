import Login20 from '@carbon/icons-react/lib/login/20';
import Add20 from '@carbon/icons-react/lib/add/20';
import User20 from '@carbon/icons-react/lib/user/20';
import Exit20 from '@carbon/icons-react/lib/exit/20';

import {
  Header,
  HeaderName,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderPanel,
  Switcher,
  SwitcherItem,
  SwitcherDivider
} from 'carbon-components-react/lib/components/UIShell';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { TextInput } from 'carbon-components-react';
import Link from 'next/link';

const Navigation: React.FC = () => {
  const { login, logout, user, isAuthenticated } = useContext(AuthContext);
  const [controlPanelExpanded, setControlPanelExpanded] = useState(false);

  useEffect(() => {
    // const a = async () => {
    //   login({
    //     email: 'carlos-menezes212@hotmail.com',
    //     password: '123123123'
    //   });
    // };
    // a();
  }, []);

  return (
    <Header aria-label="ProtonX Help">
      <HeaderName href="#" prefix="ProtonX">
        [Help]
      </HeaderName>
      <HeaderNavigation aria-label="ProtonX [Help]">
        <HeaderMenuItem href="/faq">FAQ</HeaderMenuItem>
        <HeaderMenuItem href="/live">Live Chat</HeaderMenuItem>
      </HeaderNavigation>
      <HeaderGlobalBar>
        <HeaderGlobalAction aria-label="Create Ticket" onClick={() => {}}>
          <Add20 />
        </HeaderGlobalAction>
        {!isAuthenticated && (
          <HeaderGlobalAction aria-label="Login">
            <Link href="/login">
              <Login20 />
            </Link>
          </HeaderGlobalAction>
        )}
        {isAuthenticated && (
          <>
            <HeaderGlobalAction aria-label="Control Panel">
              <User20 />
            </HeaderGlobalAction>
            <HeaderPanel
              expanded={controlPanelExpanded}
              aria-label="Control Panel Options"
            >
              <Switcher>
                <SwitcherItem>
                  Logged in as {user.firstName.concat(' ', user.lastName)}
                </SwitcherItem>
                <SwitcherDivider />
                <SwitcherItem>Dashboard</SwitcherItem>
                <SwitcherItem onClick={logout}>Logout</SwitcherItem>
              </Switcher>
            </HeaderPanel>
          </>
        )}
      </HeaderGlobalBar>
    </Header>
  );
};

export default Navigation;
