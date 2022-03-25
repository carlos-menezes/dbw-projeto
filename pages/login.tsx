import {
  Button,
  Column,
  Form,
  Grid,
  PasswordInput,
  Row,
  TextInput
} from 'carbon-components-react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { CSSProperties, FormEvent, useContext, useState } from 'react';

import Layout from '../components/Layout';
import { AuthContext } from '../contexts/AuthContext';
import { AUTH_TOKEN } from '../utils/constants';

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
                invalidText={error}
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
                invalidText={error}
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
              <Button disabled={loading} type="submit">
                Submit
              </Button>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { [AUTH_TOKEN]: token } = parseCookies(context);

  if (token) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  return {
    props: {}
  };
};

export default Login;
