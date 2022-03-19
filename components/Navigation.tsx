import Login20 from '@carbon/icons-react/lib/login/20';
import Add20 from '@carbon/icons-react/lib/add/20';
import User20 from '@carbon/icons-react/lib/user/20';
import AppSwitcher20 from '@carbon/icons-react/lib/app-switcher/20';

import {
  Header,
  HeaderName,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderNavigation,
  HeaderMenu,
  HeaderMenuItem,
  HeaderPanel
} from 'carbon-components-react/lib/components/UIShell';
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Button } from 'carbon-components-react';

const Navigation: React.FC = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(false);

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
          <HeaderGlobalAction
            aria-label="Control Panel"
            onClick={() => setExpanded(!expanded)}
          >
            <User20 />
          </HeaderGlobalAction>
        )}
        <HeaderPanel expanded={expanded} />
      </HeaderGlobalBar>
    </Header>
  );
};

export default Navigation;
