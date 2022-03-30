import { colors } from '@carbon/colors';
import { Category, Question } from '@prisma/client';
import { AxiosError } from 'axios';
import {
  Accordion,
  AccordionItem,
  Button,
  ButtonSet,
  Column,
  Grid,
  InlineNotification,
  Loading,
  Row
} from 'carbon-components-react';
import Router from 'next/router';
import { CSSProperties, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import Divider from '../components/Divider';
import Layout from '../components/Layout';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';
import CategoryResponse from './api/category/types/CategoryResponse';
import QuestionAllResponse from './api/question/types/QuestionAllResponse';
import QuestionCreateResponse from './api/question/types/QuestionCreateResponse';
import QuestionDeleteResponse from './api/question/types/QuestionDeleteResponse';
import QuestionUpdateRequest from './api/question/types/QuestionUpdateRequest';

const gridStyle: CSSProperties = {
  maxWidth: '672px'
};

const CategoryQuestionsRow = styled(Row)`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  margin-bottom: 30px;
`;

const JustifiedParagraph = styled.p`
  text-align: justify;
  word-wrap: break-word;
`;

const FAQ: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  useEffect(() => {
    const initialFetch = async () => {
      try {
        const {
          data: { categories }
        } = await api.get<CategoryResponse>('/api/category/all');
        setCategories(categories);

        const {
          data: { questions }
        } = await api.get<QuestionAllResponse>('/api/question/all');
        setQuestions(questions);
      } catch (err) {
        setError((err as AxiosError).response.data);
      } finally {
        setInitialLoading(false);
      }
    };

    initialFetch();
  }, []);

  const updateQuestionPinnedStatus = (id: string, pinned: boolean) => {
    api
      .patch<QuestionCreateResponse>('/api/question/update', {
        id,
        data: {
          pinned
        }
      } as QuestionUpdateRequest)
      .then(() => {
        Router.reload();
      })
      .catch((err: AxiosError) => {
        setError(err.response.data);
      });
  };

  const deleteQuestion = (id: string) => {
    api
      .delete<QuestionDeleteResponse>(`/api/question/delete/${id}`)
      .then(() => {
        Router.reload();
      })
      .catch((err: AxiosError) => {
        setError(err.response.data);
      });
  };

  return (
    <Layout title="FAQ">
      {initialLoading ? (
        <Loading />
      ) : error ? (
        <InlineNotification
          kind={'error'}
          title={'An error occurred!'}
          subtitle={error}
        />
      ) : (
        <Grid style={gridStyle}>
          <Row>
            <Column>
              <h1>Frequently Asked Questions</h1>
            </Column>
          </Row>
          <Divider margin={20} />
          {categories.map((c) => (
            <CategoryQuestionsRow>
              <Row>
                <Column>
                  <h1>{c.title}</h1>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Accordion>
                    {questions
                      .filter((q) => q.categoryId === c.id)
                      .sort((a, _b) => (a.pinned ? -1 : 0)) // Pinned questions come first
                      .map((q) => (
                        <AccordionItem
                          title={q.title}
                          // Pinned questions have a green top border
                          style={{
                            borderTop: `1px solid ${
                              q.pinned ? colors.green[20] : colors.gray[20]
                            }`
                          }}
                        >
                          <Row style={{ marginBottom: '10px' }}>
                            <Column>
                              <JustifiedParagraph>
                                {q.description}
                              </JustifiedParagraph>
                            </Column>
                          </Row>
                          {isAuthenticated && (
                            <Row>
                              <Column>
                                <ButtonSet>
                                  <Button size="small" kind="primary">
                                    Edit
                                  </Button>
                                  <Button
                                    size="small"
                                    kind="danger"
                                    onClick={() => deleteQuestion(q.id)}
                                  >
                                    Delete
                                  </Button>
                                  {q.pinned ? (
                                    <Button
                                      onClick={() =>
                                        updateQuestionPinnedStatus(q.id, false)
                                      }
                                      size="small"
                                      kind="secondary"
                                    >
                                      Unpin
                                    </Button>
                                  ) : (
                                    <Button
                                      size="small"
                                      kind="secondary"
                                      onClick={() =>
                                        updateQuestionPinnedStatus(q.id, true)
                                      }
                                    >
                                      Pin
                                    </Button>
                                  )}
                                </ButtonSet>
                              </Column>
                            </Row>
                          )}
                        </AccordionItem>
                      ))}
                  </Accordion>
                </Column>
              </Row>
            </CategoryQuestionsRow>
          ))}
        </Grid>
      )}
    </Layout>
  );
};

export default FAQ;
