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
import { CSSProperties, FormEvent, useContext, useState } from 'react';
import Divider from '../components/Divider';
import FlexHeading from '../components/FlexHeading';
import Grid from '../components/Grid';

import Layout from '../components/Layout';
import { AuthContext } from '../contexts/AuthContext';
import { AUTH_TOKEN } from '../utils/constants';

const formStyle: CSSProperties = {
  marginTop: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  rowGap: '20px'
};

const Register = () => {
  const { register, loading } = useContext(AuthContext);
  const router = useRouter();

  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const handleFormSubmission = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    register({
      email,
      password,
      firstName,
      lastName
    })
      .then(() => {
        router.push('/');
      })
      .catch((error: Error) => {
        setError(error.message);
      });
  };

  return (
    <Layout title="Register">
      <Grid>
        <Row>
          <FlexHeading>
            <h1>Register</h1>
          </FlexHeading>
        </Row>

        <Divider margin={10} />

        <Form style={formStyle} onSubmit={(e) => handleFormSubmission(e)}>
          <Row>
            <Column>
              <TextInput
                required
                id={'firstName'}
                labelText={'First Name'}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
            </Column>
            <Column>
              <TextInput
                required
                id={'lastName'}
                labelText={'Last Name'}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </Column>
          </Row>
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
              <Button kind="ghost" type="button" href="/login">
                I already have an account
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

export default Register;
