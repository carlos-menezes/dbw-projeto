import { Category, Question } from '@prisma/client';
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
import { CSSProperties, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import Divider from '../components/Divider';
import Layout from '../components/Layout';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';
import CategoryResponse from './api/category/types/CategoryResponse';
import QuestionAllResponse from './api/question/types/QuestionAllResponse';

const gridStyle: CSSProperties = {
  maxWidth: '672px'
};

const CategoryQuestionsRow = styled(Row)`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  margin-bottom: 30px;
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
        const { message: error } = err as Error;
        setError(error);
      } finally {
        setInitialLoading(false);
      }
    };

    initialFetch();
  }, []);

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
                      .map((q) => (
                        <AccordionItem title={q.title}>
                          <Row style={{ marginBottom: '10px' }}>
                            <p contentEditable={true}>{q.description}</p>
                          </Row>
                          {isAuthenticated && (
                            <Row>
                              <ButtonSet>
                                <Button kind="tertiary">Edit</Button>
                                <Button kind="danger--tertiary">Delete</Button>
                              </ButtonSet>
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
