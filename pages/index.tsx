import { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';

const Index: React.FC = () => {
  const { user, login } = useContext(AuthContext);

  useEffect(() => {
    const loginRequest = async () => {
      login({
        email: 'carlos-312312',
        password: '123123'
      });
    };

    loginRequest();
  }, []);

  return <h1>Hello, {user?.firstName}!</h1>;
};

export default Index;
