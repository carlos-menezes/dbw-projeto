import {
  Row,
  Column,
  SkeletonPlaceholder,
  Form,
  TextArea,
  Button
} from 'carbon-components-react';
import { GetServerSideProps } from 'next';
import { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { generateUsername } from 'unique-username-generator';
import styled from 'styled-components';

import { prisma } from '../../services/db';
import Divider from '../../components/Divider';
import FlexHeading from '../../components/FlexHeading';
import Grid from '../../components/Grid';
import Layout from '../../components/Layout';
import { AuthContext } from '../../contexts/AuthContext';
import { colors } from '@carbon/colors';
import FlexColumn from '../../components/FlexColumn';
import ReactMarkdown from 'react-markdown';
import remarkGemoji from 'remark-gemoji';

const MessageForm = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 20px;
`;

type UserMessageProps = {
  user: string;
  message: string;
  currentUser: boolean;
};

const UserMessage: React.FC<UserMessageProps> = ({
  user,
  message,
  currentUser
}) => {
  return (
    <FlexColumn
      style={{
        justifyContent: currentUser ? 'flex-end' : 'flex-start',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '20px',
        backgroundColor: currentUser ? colors.green[10] : colors.gray[10]
      }}
    >
      <Row>
        <Column>
          <p style={{ fontWeight: 700 }}>{user}</p>
        </Column>
      </Row>
      <Row>
        <Column>
          <p>
            <ReactMarkdown remarkPlugins={[remarkGemoji]}>
              {message}
            </ReactMarkdown>
          </p>
        </Column>
      </Row>
    </FlexColumn>
  );
};

type Message = { user: string; message: string };

type ChatRoomProps = {
  id: string;
  title: string;
  categoryTitle: string;
  createdAt: string;
  error: boolean;
};

const ChatRoom: React.FC<ChatRoomProps> = ({
  id,
  title,
  categoryTitle,
  createdAt
}) => {
  // This should be a set (`new Set()` but working with sets here is tricky; https://stackoverflow.com/a/58806947/3307678)
  const [users, setUsers] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  const socketRef = useRef<Socket | null>(null);

  const {
    user: authenticatedUser,
    isAuthenticated,
    loading
  } = useContext(AuthContext);

  useEffect(() => {
    if (loading) {
      return;
    }

    const socket = io();
    socketRef.current = socket;

    const connectHandler = () => {
      let name: string = '';
      if (isAuthenticated) {
        name = authenticatedUser.firstName.concat(
          ' ',
          authenticatedUser.lastName
        );
      } else {
        name = generateUsername('-');
      }
      console.log(name);

      setCurrentUser(name);
      socket.emit('createRoom', id);
      socket.emit('joinRoom', id, name);
    };
    socket.once('connect', connectHandler);

    const updateMessagesHandler = (message: string, user: string) => {
      setMessages((previousState) => [...previousState, { message, user }]);
    };
    socket.on('newMessage', updateMessagesHandler);

    const updateRoomHandler = (users: string[]) => {
      setUsers(users);
    };
    socket.on('updateRoom', updateRoomHandler);

    return () => {
      socket.off('connect', connectHandler);
      socket.off('updateRoom', updateRoomHandler);
      socket.off('newMessage', updateMessagesHandler);
    };
  }, [loading, setUsers]);

  const handleMessageSubmission = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socketRef.current.emit('messageSent', id, message, currentUser);
    setMessage('');
  };

  return (
    <Layout title="Chat">
      <Grid>
        <Row>
          <Column>
            <FlexHeading>
              <h2>{title}</h2>
            </FlexHeading>
          </Column>
        </Row>
        <Divider margin={5} />
        <Row>
          <Column sm={6} md={4} lg={8}>
            <p>
              Started on <span style={{ fontWeight: 'bold' }}>{createdAt}</span>
            </p>
          </Column>
          <Column sm={3} md={3} lg={3}>
            <p>
              Category:{' '}
              <span style={{ fontWeight: 'bold' }}>{categoryTitle}</span>
            </p>
          </Column>
        </Row>

        <Divider margin={10} />

        <Row>
          <Column sm={16} md={10} lg={8}>
            <Row>
              <Column>
                <div
                  style={{
                    minHeight: '500px',
                    border: `1px solid ${colors.gray[10]}`,
                    wordBreak: 'break-word',
                    padding: '10px'
                  }}
                >
                  {messages.map((msg) => (
                    <>
                      <UserMessage
                        user={msg.user}
                        message={msg.message}
                        currentUser={msg.user === currentUser}
                      />
                      <Divider margin={5} />
                    </>
                  ))}
                </div>
              </Column>
            </Row>
            <Divider margin={5} />
            <Row>
              <Column>
                <div
                  style={{
                    width: '100%',
                    border: `1px solid ${colors.gray[10]}`,
                    padding: '10px'
                  }}
                >
                  <MessageForm onSubmit={(e) => handleMessageSubmission(e)}>
                    <Row>
                      <Column>
                        <TextArea
                          required
                          onChange={(e) => setMessage(e.target.value)}
                          value={message}
                          light
                          id={'message'}
                          labelText={'Message'}
                        />
                      </Column>
                    </Row>
                    <Row>
                      <Column>
                        <Button kind="primary" type="submit">
                          Submit
                        </Button>
                      </Column>
                    </Row>
                  </MessageForm>
                </div>
              </Column>
            </Row>
          </Column>

          <Column>
            {users === null ? (
              <SkeletonPlaceholder />
            ) : (
              users.map((user) => (
                <>
                  <FlexColumn
                    sm={12}
                    md={12}
                    lg={8}
                    key={user}
                    style={{
                      backgroundColor:
                        user === currentUser
                          ? colors.green[10]
                          : colors.gray[10],
                      minHeight: '45px',
                      alignItems: 'center'
                    }}
                  >
                    <p>{user}</p>
                  </FlexColumn>
                  <Divider margin={5} />
                </>
              ))
            )}
          </Column>
        </Row>

        <Divider margin={10} />
      </Grid>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const roomId = context.query.id as string;

  try {
    const {
      id,
      title,
      category: { title: categoryTitle },
      createdAt
    } = await prisma.room.findUnique({
      where: { id: roomId },
      include: { category: { select: { title: true } } }
    });

    return {
      props: {
        id,
        title,
        categoryTitle,
        createdAt: createdAt.toISOString()
      }
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }
};

export default ChatRoom;
