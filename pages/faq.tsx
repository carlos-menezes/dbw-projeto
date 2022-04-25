import { colors } from '@carbon/colors';
import { Category, Question } from '@prisma/client';
import { AxiosError } from 'axios';
import {
  Accordion,
  AccordionItem,
  Button,
  ButtonSet,
  Column,
  InlineNotification,
  Loading,
  Row
} from 'carbon-components-react';
import Router from 'next/router';
import { useContext, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGemoji from 'remark-gemoji';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';

import Divider from '../components/Divider';
import FlexHeading from '../components/FlexHeading';
import Grid from '../components/Grid';
import Layout from '../components/Layout';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';
import CategoryResponse from './api/category/types/CategoryResponse';
import QuestionAllResponse from './api/question/types/QuestionAllResponse';
import QuestionCreateResponse from './api/question/types/QuestionCreateResponse';
import QuestionDeleteResponse from './api/question/types/QuestionDeleteResponse';
import QuestionUpdateRequest from './api/question/types/QuestionUpdateRequest';

type PinnedAcordionItemProps = {
  pinned: boolean;
};

const PinnedAcordionItem = styled(AccordionItem)`
  border-top: 1px solid
    ${(props: PinnedAcordionItemProps) =>
      props.pinned ? colors.green[20] : colors.gray[20]};
`;

const CategoryQuestionsRow = styled(Row)`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  margin-bottom: 30px;
`;

const ActionRow = styled(Row)`
  margin-top: 10px;
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
        <Grid>
          <Row>
            <FlexHeading>
              <h1>Frequently Asked Questions</h1>
            </FlexHeading>
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
                        <PinnedAcordionItem
                          pinned={q.pinned}
                          title={q.title}
                          // Pinned questions have a green top border
                        >
                          <Row>
                            <Column>
                              {/* <JustifiedParagraph> */}
                              <ReactMarkdown
                                remarkPlugins={[remarkGemoji, remarkGfm]}
                              >
                                {q.description}
                              </ReactMarkdown>
                              {/* </JustifiedParagraph> */}
                            </Column>
                          </Row>

                          {isAuthenticated && (
                            <ActionRow>
                              <Column>
                                <ButtonSet>
                                  <Button
                                    size="small"
                                    kind="primary"
                                    onClick={() =>
                                      Router.push(`/question/edit/${q.id}`)
                                    }
                                  >
                                    Edit
                                  </Button>
                                  <Button
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
                                      kind="secondary"
                                    >
                                      Unpin
                                    </Button>
                                  ) : (
                                    <Button
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
                            </ActionRow>
                          )}
                        </PinnedAcordionItem>
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
