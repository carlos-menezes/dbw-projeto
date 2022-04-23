import {
  Button,
  Column,
  Form,
  InlineNotification,
  Row,
  Select,
  SelectItem,
  SkeletonText,
  TextArea,
  TextInput
} from 'carbon-components-react';
import { FormEvent, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import Picker from 'emoji-picker-react';
import { Category } from '@prisma/client';
import { AxiosError } from 'axios';

import Layout from '../../components/Layout';
import { api } from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import Link from 'carbon-components-react/lib/components/UIShell/Link';
import CategoryResponse from '../api/category/types/CategoryResponse';
import TicketCreateRequest from '../api/ticket/types/TicketCreateRequest';
import TicketCreateResponse from '../api/ticket/types/TicketCreateResponse';
import Grid from '../../components/Grid';
import Divider from '../../components/Divider';
import ReactMarkdown from 'react-markdown';
import remarkGemoji from 'remark-gemoji';
import remarkGfm from 'remark-gfm';

const CreateTicketForm = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 20px;
  column-gap: 20px;
`;

type FormData = {
  title: string;
  description: string;
  email: string;
  categoryId: string;
};

const Create: React.FC = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [formData, setFormData] = useState<FormData>({
    ...({} as FormData),
    email: isAuthenticated ? user.email : ''
  } as FormData);
  const [ticketData, setTicketData] = useState<{
    id: string;
    commentCode: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<CategoryResponse>('/api/category/all')
      .then(({ data: { categories } }) => {
        setCategories(categories);
        setFormData((state) => ({ ...state, categoryId: categories[0].id }));
      })
      .catch((err: AxiosError) => {
        setFormData((state) => ({ ...state, error: err.response.data }));
      })
      .finally(() => setInitialLoading(false));
  }, []);

  const handleFormSubmission = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    api
      .post<TicketCreateResponse>('/api/ticket/create', {
        title: formData.title,
        description: formData.description,
        email: formData.email,
        categoryId: formData.categoryId
      } as TicketCreateRequest)
      .then(({ data: { id, commentCode } }) => {
        setTicketData({
          id,
          commentCode
        });
      })
      .catch((err: AxiosError) => {
        setError(err.response?.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Layout title="Create Ticket">
      <Grid>
        <Row>
          <Column>
            <h1>Create Ticket</h1>
          </Column>
        </Row>

        <Divider margin={10} />

        <CreateTicketForm onSubmit={(e) => handleFormSubmission(e)}>
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
            <Column>
              <TextInput
                required
                id={'Email'}
                value={formData.email}
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
              <TextArea
                required
                labelText={'Description'}
                value={formData.description}
                onChange={(e) => {
                  setFormData((state) => ({
                    ...state,
                    description: e.target.value
                  }));
                }}
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <label className="bx--label">Preview</label>
              <Row>
                <Column style={{ wordBreak: 'break-all' }}>
                  <ReactMarkdown remarkPlugins={[remarkGemoji, remarkGfm]}>
                    {formData.description}
                  </ReactMarkdown>
                </Column>
              </Row>
            </Column>
          </Row>
          <Row>
            <Column>
              <Button disabled={loading || !!ticketData} type="submit">
                Submit
              </Button>
            </Column>
          </Row>
          {ticketData && (
            <Row>
              <Column>
                <InlineNotification
                  kind={error ? 'error' : 'success'}
                  title={error ? error : 'Ticket created!'}
                  subtitle={
                    <Link href={`/ticket/${ticketData.id}`}>
                      Click here to check the status and use the code{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {ticketData.commentCode}
                      </span>{' '}
                      to comment.
                    </Link>
                  }
                />
              </Column>
            </Row>
          )}
        </CreateTicketForm>
      </Grid>
    </Layout>
  );
};

export default Create;
