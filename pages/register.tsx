import {
  Button,
  Column,
  Form,
  Grid,
  PasswordInput,
  Row,
  TextInput
} from 'carbon-components-react';
import { useRouter } from 'next/router';
import { CSSProperties, FormEvent, useContext, useState } from 'react';

import Layout from '../components/Layout';
import { AuthContext } from '../contexts/AuthContext';

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
      <Grid style={gridStyle}>
        <Row>
          <Column>
            <h1>Register</h1>
          </Column>
        </Row>
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

export default Register;
