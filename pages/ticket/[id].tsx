import { colors } from '@carbon/colors';
import { Category, Ticket, TicketMessage, User } from '@prisma/client';
import { AxiosError } from 'axios';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonSet,
  Column,
  Form,
  InlineNotification,
  Loading,
  Tag,
  TextArea,
  TextInput
} from 'carbon-components-react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { FormEvent, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import Divider from '../../components/Divider';
import Grid from '../../components/Grid';
import JustifiedParagraph from '../../components/JustifiedParagraph';

import Layout from '../../components/Layout';
import Row from '../../components/FlexRow';
import { AuthContext } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import QuestionCreateRequest from '../api/question/types/QuestionCreateRequest';
import QuestionCreateResponse from '../api/question/types/QuestionCreateResponse';
import TicketInfoResponse from '../api/ticket/types/TicketInfoResponse';
import TicketMessageCreateRequest from '../api/ticket/types/TicketMessageCreateRequest';
import TicketMessageCreateResponse from '../api/ticket/types/TicketMessageCreateResponse';
import TicketMessageUpdateRequest from '../api/ticket/types/TicketMessageUpdateRequest';
import TicketMessageUpdateResponse from '../api/ticket/types/TicketMessageUpdateResponse';
import TicketUpdateRequest from '../api/ticket/types/TicketUpdateRequest';
import TicketUpdateResponse from '../api/ticket/types/TicketUpdateResponse';
import FlexRow from '../../components/FlexRow';
import FlexColumn from '../../components/FlexColumn';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkGemoji from 'remark-gemoji';

const CommentCodeForm = styled(Form)`
  row-gap: 10px;
`;

const ActionColumn = styled(FlexColumn)`
  justify-content: flex-end;
  column-gap: 5px;
`;

const CommentsHeader = styled(FlexRow)`
  align-items: center;
`;

const TicketMessageRow = styled(FlexRow)`
  background-clip: content-box;
  box-sizing: border-box;
  padding: 20px;
  border: 1px solid
    ${(props: { $reply: boolean; $agent: boolean }) =>
      props.$reply
        ? colors.green[40]
        : props.$agent
        ? colors.blue[20]
        : colors.gray[10]};
  text-align: justify;
  justify-content: space-around;
  flex-direction: column;
  row-gap: 10px;
`;

const statusTagColor = {
  AVAILABLE: 'blue',
  OPEN: 'green',
  CLOSED: 'red'
};

const TicketId = () => {
  const router = useRouter();
  const ticketId = router.query['id'];

  const { isAuthenticated, user } = useContext(AuthContext);

  const [ticketData, setTicketData] = useState<
    (Ticket & { messages: TicketMessage[] } & { category: Category }) | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [comment, setComment] = useState<string | null>(null);
  const [commentCode, setCommentCode] = useState<string | null>(null);
  const [isTicketCreator, setIsTicketCreator] = useState<boolean>(false);
  const [invalidCommentCode, setInvalidCommentCode] = useState<boolean | null>(
    null
  );
  const [faqEntryId, setFaqEntryId] = useState<string | null>(null);

  const createFAQEntry = (
    title: string,
    description: string,
    categoryId: string
  ) => {
    api
      .post<QuestionCreateResponse>('/api/question/create', {
        title,
        description,
        categoryId
      } as QuestionCreateRequest)
      .then(({ data: { id } }) => {
        setFaqEntryId(id);
      })
      .catch((err: AxiosError) => {
        setError(err.response.data);
      });
  };

  const updateTicketStatus = (action: 'ASSIGN' | 'OPEN' | 'CLOSE') => {
    const data: Partial<Ticket> = {
      userId: user.id
    };

    switch (action) {
      case 'OPEN':
      case 'ASSIGN':
        data.status = 'OPEN';
        data.userId = user.id;
        break;
      case 'CLOSE':
        data.status = 'CLOSED';
        data.userId = undefined;
        break;
    }
    api
      .patch<TicketUpdateResponse>('/api/ticket/update', {
        id: ticketId,
        data
      } as TicketUpdateRequest)
      .then(({ data: { ticket } }) => {
        setTicketData(ticket);
      })
      .catch((err: AxiosError) => {
        setError(err.response.data);
      });
  };

  const updateTicketMessageReply = (id: string, isReply: boolean) => {
    api
      .patch<TicketMessageUpdateResponse>('/api/ticket/message/update', {
        messageId: id,
        ticketId,
        data: {
          isReply
        }
      } as TicketMessageUpdateRequest)
      .then(() => {
        Router.reload();
      })
      .catch((err: AxiosError) => {
        setError(err.response.data);
      });
  };

  const deleteTicketMessage = (id: string) => {
    api
      .delete<TicketMessageUpdateResponse>(`/api/ticket/message/delete/${id}`)
      .then(() => {
        Router.reload();
      })
      .catch((err: AxiosError) => {
        setError(err.response.data);
      });
  };

  const handleCommentFormSubmission = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    api
      .post<TicketMessageCreateResponse>('/api/ticket/message/create', {
        userId: isAuthenticated ? user.id : null,
        message: comment,
        ticketId
      } as TicketMessageCreateRequest)
      .then(() => {
        Router.reload();
      })
      .catch((err: AxiosError) => {
        setError(err.response.data);
      });
  };

  const handleCommentCodeFormSubmission = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (commentCode === ticketData.commentCode) {
      setIsTicketCreator(true);
    } else {
      setInvalidCommentCode(true);
    }
  };

  /**
   * Get the ticket data before the components are shown to the user.
   */
  useEffect(() => {
    if (!ticketId) {
      return;
    }

    api
      .get<TicketInfoResponse>(`/api/ticket/${ticketId}`)
      .then(({ data: { ticket } }) => {
        setTicketData(ticket);
      })
      .catch((err: AxiosError) => {
        console.log(err.response.data.error);

        setError(err.response.data.error);
      })
      .finally(() => {
        setInitialLoading(false);
      });
  }, [ticketId]);

  return (
    <Layout title={`Ticket #${ticketId}`}>
      {initialLoading ? (
        <Loading />
      ) : (
        <>
          <Grid>
            {error ? (
              <InlineNotification
                kind={'error'}
                title={'Error!'}
                subtitle={error}
              />
            ) : (
              <>
                <FlexRow>
                  <Column>
                    <Breadcrumb>
                      <BreadcrumbItem>Ticket</BreadcrumbItem>
                      <BreadcrumbItem>
                        {ticketData?.category.title}
                      </BreadcrumbItem>
                      <BreadcrumbItem>
                        <Link href={`/tickets/${ticketData?.id}`}>
                          {ticketData?.id}
                        </Link>
                      </BreadcrumbItem>
                    </Breadcrumb>
                  </Column>
                </FlexRow>
                <FlexRow>
                  <Column>
                    <h2>{ticketData?.title}</h2>
                  </Column>
                </FlexRow>
                <Row>
                  <Column sm={12} md={4} lg={4}>
                    <p>{ticketData?.email}</p>
                  </Column>
                  <Column sm={12} md={4} lg={4}>
                    <p>{new Date(ticketData?.createdAt).toUTCString()}</p>
                  </Column>
                  <Column sm={3} md={3} lg={3}>
                    <Tag
                      title="Status"
                      type={statusTagColor[ticketData?.status.toString()]}
                    >
                      {ticketData?.status}
                    </Tag>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <JustifiedParagraph>
                      <ReactMarkdown remarkPlugins={[remarkGfm, remarkGemoji]}>
                        {ticketData?.description}
                      </ReactMarkdown>
                    </JustifiedParagraph>
                  </Column>
                </Row>

                <Divider margin={5} />

                <>
                  {isAuthenticated && (
                    <Row>
                      <ActionColumn>
                        {/* If a reply has been set, an authenticated user is able to create
  a new FAQ entry from it. */}
                        {ticketData.messages.filter((m) => m.isReply).length >
                          0 && (
                          <Button
                            kind="secondary"
                            onClick={(_e) =>
                              createFAQEntry(
                                ticketData.title,
                                ticketData.messages.filter((m) => m.isReply)[0]
                                  .message,
                                ticketData.categoryId
                              )
                            }
                          >
                            Create FAQ Entry
                          </Button>
                        )}

                        {ticketData.status === 'AVAILABLE' && (
                          <Button
                            kind="primary"
                            onClick={(_e) => updateTicketStatus('ASSIGN')}
                          >
                            Assign
                          </Button>
                        )}
                        {ticketData.status === 'CLOSED' && (
                          <Button
                            kind="primary"
                            onClick={(_e) => updateTicketStatus('OPEN')}
                          >
                            OPEN
                          </Button>
                        )}
                        {ticketData.status !== 'CLOSED' && (
                          <Button
                            kind="danger--tertiary"
                            onClick={(_e) => updateTicketStatus('CLOSE')}
                          >
                            Close
                          </Button>
                        )}
                      </ActionColumn>
                    </Row>
                  )}

                  {/* FAQ creation notification */}
                  {faqEntryId && (
                    <Row>
                      <FlexColumn>
                        <InlineNotification
                          kind={'success'}
                          title={'Success!'}
                          subtitle={`FAQ entry created`}
                        />
                        <Button
                          kind="primary"
                          onClick={(_e) => Router.push(`/faq`)}
                        >
                          View
                        </Button>
                      </FlexColumn>
                    </Row>
                  )}

                  <Divider margin={10} />

                  <CommentsHeader>
                    <Column>
                      <h4>Comments ({ticketData?.messages.length})</h4>
                    </Column>
                  </CommentsHeader>

                  <Divider margin={5} />

                  {/* If user is not authenticated and the code hasn't been submitted yet, show the input. */}
                  {!isAuthenticated && !isTicketCreator && (
                    <>
                      <Form
                        onSubmit={(e) => handleCommentCodeFormSubmission(e)}
                      >
                        <Row>
                          <Column>
                            <TextInput
                              invalid={invalidCommentCode}
                              invalidText={'Invalid comment code.'}
                              onChange={(e) => setCommentCode(e.target.value)}
                              id={'code'}
                              placeholder={'Code'}
                              labelText={''}
                            />
                          </Column>
                          <Column>
                            <Button type="submit" kind="primary" size="field">
                              Submit
                            </Button>
                          </Column>
                        </Row>
                      </Form>
                      <Divider margin={10} />
                    </>
                  )}

                  {/* If the user is authenticated or the code has been submitted, allow the user to comment on the ticket EXCEPT if the ticket has been closed. */}
                  {(isTicketCreator ||
                    (isAuthenticated && ticketData.userId === user.id)) &&
                    ticketData.status !== 'CLOSED' && (
                      <Form onSubmit={handleCommentFormSubmission}>
                        <Row>
                          <Column>
                            <TextArea
                              onChange={(e) => setComment(e.target.value)}
                              wrap="true"
                              labelText={'Comment'}
                              cols={400}
                              rows={6}
                            />
                          </Column>
                        </Row>
                        <Divider margin={2} />
                        <Row>
                          <ActionColumn>
                            <Button
                              disabled={!comment}
                              type="submit"
                              kind="primary"
                            >
                              Submit
                            </Button>
                          </ActionColumn>
                        </Row>
                      </Form>
                    )}

                  <Divider margin={10} />

                  {/* If the agent is authenticated and the ticket hasn't been assigned, prompt the agent to assign themselves the ticket. */}
                  {isAuthenticated && ticketData.userId === null && (
                    <Row>
                      <Column>
                        You must assign this ticket to yourself before
                        commenting.
                      </Column>
                    </Row>
                  )}

                  {ticketData?.messages
                    .sort((a, _b) => (a.isReply ? -1 : 0)) // Pin the reply, if it exists
                    .map((m: TicketMessage & { user: User }) => (
                      <Column key={m.id} style={{ marginBottom: '20px' }}>
                        <TicketMessageRow
                          $agent={!!m.userId}
                          $reply={m.isReply}
                        >
                          <Column>
                            <p>
                              {m.userId ? (
                                <>
                                  <span style={{ fontWeight: 700 }}>
                                    {m.user.firstName} {m.user.lastName}
                                  </span>{' '}
                                  ({m.user.email})
                                </>
                              ) : (
                                <>{ticketData.email}</>
                              )}
                            </p>
                            <p>{new Date(m.createdAt).toUTCString()}</p>
                          </Column>
                          <Column>
                            <JustifiedParagraph>
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkGemoji]}
                              >
                                {m.message}
                              </ReactMarkdown>
                            </JustifiedParagraph>
                          </Column>
                          {/* Agents should be able to select a reply as the answer to the question. They are also ablet o delete a message. */}
                          {isAuthenticated && (
                            <Column>
                              <ButtonSet>
                                <Button
                                  kind="tertiary"
                                  onClick={(_) =>
                                    updateTicketMessageReply(m.id, !m.isReply)
                                  }
                                >
                                  {m.isReply
                                    ? 'Deselect Reply'
                                    : 'Select Reply'}
                                </Button>
                                <Button
                                  kind="danger--tertiary"
                                  onClick={(_) => deleteTicketMessage(m.id)}
                                >
                                  Delete
                                </Button>
                              </ButtonSet>
                            </Column>
                          )}
                        </TicketMessageRow>
                      </Column>
                    ))}
                </>
              </>
            )}
          </Grid>
        </>
      )}
    </Layout>
  );
};

export default TicketId;
