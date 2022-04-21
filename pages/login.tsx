import {
  Button,
  Column,
  Form,
  PasswordInput,
  Row,
  TextInput
} from 'carbon-components-react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { FormEvent, useContext, useState } from 'react';
import styled from 'styled-components';
import Divider from '../components/Divider';

import FlexHeading from '../components/FlexHeading';
import Grid from '../components/Grid';
import Layout from '../components/Layout';
import { AuthContext } from '../contexts/AuthContext';
import { AUTH_TOKEN } from '../utils/constants';

const LoginForm = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 20px;
`;

type FormData = {
  email: string;
  password: string;
  error?: string;
};

const Login = () => {
  const { login, loading } = useContext(AuthContext);
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({} as FormData);

  const handleFormSubmission = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password } = formData;

    login({
      email,
      password
    })
      .then(() => {
        router.push('/');
      })
      .catch((err: Error) => {
        const { message: error } = err;
        setFormData((state) => ({ ...state, error }));
      });
  };

  return (
    <Layout title="Login">
      <Grid>
        <Row>
          <FlexHeading>
            <h1>Login</h1>
          </FlexHeading>
        </Row>

        <Divider margin={10} />

        <LoginForm onSubmit={(e) => handleFormSubmission(e)}>
          <Row>
            <Column>
              <TextInput
                required
                invalid={formData.error?.includes('email')}
                invalidText={formData.error}
                id={'email'}
                labelText={'Email'}
                onChange={(e) => {
                  setFormData((state) => ({
                    ...state,
                    email: e.target.value
                  }));
                }}
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <PasswordInput
                required
                invalid={formData.error?.includes('password')}
                invalidText={formData.error}
                id={'password'}
                labelText={'Password'}
                onChange={(e) => {
                  setFormData((state) => ({
                    ...state,
                    password: e.target.value
                  }));
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
        </LoginForm>
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
