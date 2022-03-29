import {
  Button,
  Column,
  FileUploader,
  Form,
  Grid,
  InlineNotification,
  Row,
  Select,
  SelectItem,
  SkeletonPlaceholder,
  SkeletonText,
  TextArea,
  TextInput
} from 'carbon-components-react';
import {
  CSSProperties,
  FormEvent,
  useContext,
  useEffect,
  useState
} from 'react';

import Layout from '../../components/Layout';
import { Category } from '@prisma/client';
import { api } from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import Link from 'carbon-components-react/lib/components/UIShell/Link';
import CategoryResponse from '../api/category/types/CategoryResponse';
import TicketCreateRequest from '../api/ticket/types/TicketCreateRequest';
import TicketCreateResponse from '../api/ticket/types/TicketCreateResponse';

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

type FormData = {
  title: string;
  description: string;
  email: string;
  categoryId: string;
  file?: File;
  error?: string;
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

  useEffect(() => {
    api
      .get<CategoryResponse>('/api/category/all')
      .then(({ data: { categories } }) => {
        setCategories(categories);
        setFormData((state) => ({ ...state, categoryId: categories[0].id }));
      })
      .catch((err) => {
        const { message: error } = err as Error;
        setFormData((state) => ({ ...state, error }));
      })
      .finally(() => setInitialLoading(false));
  }, []);

  const handleFormSubmission = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    api
      .post<TicketCreateResponse>('/api/ticket/create', {
        title: formData.title,
        description: formData.description,
        email: formData.email,
        fileData: formData.file ? await formData.file.text() : null,
        categoryId: formData.categoryId
      } as TicketCreateRequest)
      .then(({ data: { id, commentCode } }) => {
        setTicketData({
          id,
          commentCode
        });
        setFormData((state) => ({ ...state, error: null }));
      })
      .catch((err) => {
        const { message: error } = err as Error;
        setFormData((state) => ({ ...state, error }));
      });
  };

  return (
    <Layout title="Create Ticket">
      <Grid style={gridStyle}>
        <Row>
          <Column>
            <h1>Create Ticket</h1>
          </Column>
        </Row>
        <Form style={formStyle} onSubmit={(e) => handleFormSubmission(e)}>
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
              <FileUploader
                id="file"
                accept={['.jpg', '.png', '.pdf']}
                buttonKind="tertiary"
                buttonLabel="Add files"
                filenameStatus="edit"
                iconDescription="Clear file"
                labelDescription="only .jpg, .png or .pdf files at 1mb or less"
                labelTitle="Upload"
                onChange={(e) => {
                  setFormData((state) => ({
                    ...state,
                    file: e.target.files[0]
                  }));
                }}
                onDelete={(_) =>
                  setFormData((state) => ({
                    ...state,
                    file: null
                  }))
                }
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <Button
                disabled={loading || initialLoading || !!ticketData}
                type="submit"
              >
                Submit
              </Button>
            </Column>
          </Row>
          {ticketData && (
            <Row>
              <Column>
                <InlineNotification
                  kind={formData.error ? 'error' : 'success'}
                  title={formData.error ? formData.error : 'Ticket created!'}
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
        </Form>
      </Grid>
    </Layout>
  );
};

export default Create;
