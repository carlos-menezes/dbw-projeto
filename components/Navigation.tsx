import Login20 from '@carbon/icons-react/lib/login/20';
import Add20 from '@carbon/icons-react/lib/add/20';
import User20 from '@carbon/icons-react/lib/user/20';

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
import { CSSProperties, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Link from 'next/link';

const headerStyle: CSSProperties = {
  height: '3.5em'
};

const Navigation: React.FC = () => {
  const { logout, user, isAuthenticated } = useContext(AuthContext);
  const [controlPanelExpanded, setControlPanelExpanded] = useState(false);

  useEffect(() => {
    return () => {
      setControlPanelExpanded(false);
    };
  }, []);

  return (
    <Header aria-label="ProtonX Help" style={headerStyle}>
      <HeaderName href="/" prefix="ProtonX">
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
            <HeaderGlobalAction
              aria-label="Control Panel"
              onClick={() => setControlPanelExpanded(!controlPanelExpanded)}
            >
              <User20 />
            </HeaderGlobalAction>
            <HeaderPanel
              expanded={controlPanelExpanded}
              aria-label="Control Panel Options"
            >
              <Switcher aria-label="Control Panel Options">
                <SwitcherItem>
                  Logged in as {user?.firstName?.concat(' ', user.lastName)}
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
