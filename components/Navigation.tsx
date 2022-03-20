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
  SwitcherItem
} from 'carbon-components-react/lib/components/UIShell';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const { login, user, isAuthenticated } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const a = async () => {
      login({
        email: 'carlos-menezes212@hotmail.com',
        password: '123123123'
      });
    };
    a();
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
          <HeaderGlobalAction aria-label="Login" onClick={() => {}}>
            <Login20 />
          </HeaderGlobalAction>
        )}
        {isAuthenticated && (
          <>
            <HeaderGlobalAction
              aria-label="Control Panel"
              onClick={() => setExpanded(!expanded)}
            >
              <User20 />
            </HeaderGlobalAction>
            <HeaderPanel expanded={expanded} aria-label="Control Panel Options">
              <Switcher>
                <SwitcherItem>
                  Logged in as {user.firstName.concat(' ', user.lastName)}
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
