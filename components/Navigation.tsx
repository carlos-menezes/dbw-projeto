import Login20 from '@carbon/icons-react/lib/login/20';
import Add20 from '@carbon/icons-react/lib/add/20';
import Menu20 from '@carbon/icons-react/lib/menu/20';

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
import Router from 'next/router';

const headerStyle: CSSProperties = {
  height: '3.5em'
};

const Navigation: React.FC = () => {
  const { logout, user, isAuthenticated, loading } = useContext(AuthContext);
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
        <HeaderGlobalAction
          aria-label="Create Ticket"
          onClick={() => {
            Router.push('/ticket/create');
          }}
        >
          <Add20 />
        </HeaderGlobalAction>
        {!isAuthenticated && (
          <HeaderGlobalAction
            aria-label="Login"
            onClick={() => {
              Router.push('/login');
            }}
          >
            <Login20 />
          </HeaderGlobalAction>
        )}
        {isAuthenticated && !loading && (
          <>
            <HeaderGlobalAction
              aria-label="Control Panel"
              onClick={() => setControlPanelExpanded(!controlPanelExpanded)}
            >
              <Menu20 />
            </HeaderGlobalAction>
            <HeaderPanel
              expanded={controlPanelExpanded}
              aria-label="Control Panel Options"
            >
              <Switcher aria-label="Control Panel Options">
                <SwitcherItem aria-label="User name">
                  Logged in as {user?.firstName?.concat(' ', user.lastName)}
                </SwitcherItem>
                <SwitcherDivider />
                <SwitcherItem
                  aria-label="Dashboard"
                  onClick={() => Router.push('/dashboard')}
                >
                  Dashboard
                </SwitcherItem>
                <SwitcherItem aria-label="Logout" onClick={logout}>
                  Logout
                </SwitcherItem>
              </Switcher>
            </HeaderPanel>
          </>
        )}
      </HeaderGlobalBar>
    </Header>
  );
};

export default Navigation;
