import assert from 'assert';
import {
  Button,
  Column,
  Form,
  Grid,
  InlineNotification,
  Link,
  PasswordInput,
  Row,
  TextInput,
  ToastNotification
} from 'carbon-components-react';
import { useRouter } from 'next/router';
import {
  CSSProperties,
  FormEvent,
  useContext,
  useEffect,
  useState
} from 'react';

import Layout from '../components/Layout';
import { AuthContext } from '../contexts/AuthContext';
import { LoginResponse } from '../types';

const gridStyle: CSSProperties = {
  maxWidth: '672px'
};

const formStyle: CSSProperties = {
  marginTop: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  rowGap: '20px'
};

const Login = () => {
  const { login, loading } = useContext(AuthContext);
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmission = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login({
      email,
      password
    })
      .then(() => {
        router.push('/');
      })
      .catch((error: Error) => {
        setError(error.message);
      });
  };

  return (
    <Layout title="Login">
      <Grid style={gridStyle}>
        <Row>
          <Column>
            <h1>Login</h1>
          </Column>
        </Row>
        <Form style={formStyle} onSubmit={(e) => handleFormSubmission(e)}>
          <Row>
            <Column>
              <TextInput
                required
                invalid={error?.includes('email')}
                invalidText={'Invalid email.'}
                id={'email'}
                labelText={'Email'}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <PasswordInput
                required
                invalid={error?.includes('password')}
                invalidText={'Invalid password.'}
                id={'password'}
                labelText={'Password'}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <Button type="submit">Submit</Button>
            </Column>
            <Column>
              <Button kind="ghost" type="button" href="/register">
                I don't have an account
              </Button>
            </Column>
          </Row>
        </Form>
      </Grid>
    </Layout>
  );
};

export default Login;
