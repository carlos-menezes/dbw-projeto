import { Category } from '@prisma/client';
import { AxiosError } from 'axios';
import {
  Row,
  Column,
  Button,
  Form,
  Select,
  SelectItem,
  SkeletonText,
  TextInput,
  InlineNotification
} from 'carbon-components-react';
import { nanoid } from 'nanoid';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import { parseCookies } from 'nookies';
import { FormEvent, useEffect, useState } from 'react';
import styled from 'styled-components';

import Divider from '../../components/Divider';
import FlexHeading from '../../components/FlexHeading';
import Grid from '../../components/Grid';
import Layout from '../../components/Layout';
import { api } from '../../services/api';
import { AUTH_TOKEN } from '../../utils/constants';
import CategoryResponse from '../api/category/types/CategoryResponse';
import ChatCreateRequest from '../api/chat/types/ChatCreateRequest';
import ChatCreateResponse from '../api/chat/types/ChatCreateResponse';

const ChatRoomCreationForm = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 20px;
`;

type FormData = {
  title: string;
  categoryId: string;
};

const ChatIndex = () => {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [formData, setFormData] = useState<FormData>({} as FormData);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    api
      .get<CategoryResponse>('/api/category/all')
      .then(({ data: { categories } }) => {
        setCategories(categories);
        setFormData((state) => ({ ...state, categoryId: categories[0].id }));
      })
      .catch((err: AxiosError) => {
        setError(err.response?.data);
      })
      .finally(() => setInitialLoading(false));
  }, []);

  const handleFormSubmission = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { title, categoryId } = formData;
    api
      .post<ChatCreateResponse>('/api/chat/create', {
        title,
        categoryId
      } as ChatCreateRequest)
      .then(({ data: { id } }) => {
        Router.push(`/chat/${id}`);
      })
      .catch((error: AxiosError) => {
        setError(error.response?.data);
      });
  };

  return (
    <Layout title="Live Chat">
      <Grid>
        <Row>
          <Column>
            <FlexHeading>
              <h1>Live Chat</h1>
            </FlexHeading>
          </Column>
        </Row>

        <Divider margin={10} />

        <ChatRoomCreationForm onSubmit={(e) => handleFormSubmission(e)}>
          <Row>
            <Column>
              <TextInput
                required
                id={'Title'}
                labelText={'Title'}
                onChange={(e) => {
                  setFormData((state) => ({
                    ...state,
                    title: e.target.value
                  }));
                }}
              />
            </Column>
          </Row>
          <Row>
            <Column>
              {initialLoading || categories == null ? (
                <>
                  <SkeletonText style={{ height: '100%' }} />
                </>
              ) : (
                <Select
                  labelText={'Category'}
                  id={'category'}
                  defaultValue={categories[0]?.id}
                  onChange={(e) => {
                    setFormData((state) => ({
                      ...state,
                      categoryId: e.target.value
                    }));
                  }}
                >
                  {categories.map((cat) => (
                    <SelectItem
                      id={cat.id}
                      key={cat.id}
                      text={cat.title}
                      value={cat.id}
                    />
                  ))}
                </Select>
              )}
            </Column>
          </Row>
          <Row>
            <Column>
              <Button kind="primary" type="submit">
                Submit
              </Button>
            </Column>
          </Row>
        </ChatRoomCreationForm>
        {error !== null && (
          <Row>
            <Column>
              <InlineNotification
                kind={'error'}
                title={'Error'}
                subtitle={error !== null ? error : ''}
              />
            </Column>
          </Row>
        )}
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

export default ChatIndex;
