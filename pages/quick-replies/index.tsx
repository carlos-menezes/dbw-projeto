import { QuickReply, User } from '@prisma/client';
import {
  Button,
  Column,
  Form,
  Row,
  TextArea,
  Tooltip
} from 'carbon-components-react';
import jwtDecode from 'jwt-decode';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import TrashCan20 from '@carbon/icons-react/lib/trash-can/20';
import remarkGemoji from 'remark-gemoji';
import styled from 'styled-components';

import { prisma } from '../../services/db';
import Divider from '../../components/Divider';
import FlexHeading from '../../components/FlexHeading';
import Grid from '../../components/Grid';
import Layout from '../../components/Layout';
import { AUTH_TOKEN } from '../../utils/constants';
import { FormEvent, useContext, useState } from 'react';
import FlexRow from '../../components/FlexRow';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { colors } from '@carbon/colors';
import FlexColumn from '../../components/FlexColumn';
import { api } from '../../services/api';
import CreateQuickReplyRequest from '../api/quick-reply/types/CreateQuickReplyRequest';
import Router from 'next/router';
import { AuthContext } from '../../contexts/AuthContext';
import DeleteQuickReplyRequest from '../api/quick-reply/types/DeleteQuickReplyRequest';

type QuickRepliesIndexProps = {
  replies: QuickReply[];
};

const CreateQuickReplyForm = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 20px;
`;

const QuickRepliesIndex: React.FC<QuickRepliesIndexProps> = ({ replies }) => {
  const [reply, setReply] = useState<string | null>();
  const { user } = useContext(AuthContext);

  const handleQuickReplyDeletion = async (id: string) => {
    // TODO: display error
    api.delete(`/api/quick-reply/delete/${id}`).finally(() => {
      Router.push('/quick-replies');
    });
  };

  const handleCreateQuickReplyFormSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // TODO: display error
    api
      .post('/api/quick-reply/create', {
        reply,
        user: user.id
      } as CreateQuickReplyRequest)
      .finally(() => {
        Router.push('/quick-replies');
      });
  };

  return (
    <Layout title="My Quick Replies">
      <Grid>
        <Row>
          <Column>
            <FlexHeading>
              <h1>My Quick Replies</h1>
            </FlexHeading>
          </Column>
        </Row>

        <Divider margin={10} />

        <Row>
          <FlexColumn lg={4} style={{ gap: '10px', flexDirection: 'column' }}>
            {replies.map((reply) => (
              <FlexRow
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: `1px solid ${colors.gray[10]}`,
                  padding: '10px'
                }}
              >
                <FlexColumn
                  sm={16}
                  md={14}
                  lg={14}
                  style={{ justifyContent: 'center', wordBreak: 'break-word' }}
                >
                  <p>
                    {reply.description.slice(0, 20)}
                    {reply.description.length > 20 && '...'}
                  </p>
                </FlexColumn>
                <FlexColumn style={{ justifyContent: 'center' }}>
                  <Tooltip align={'center'}>
                    <ReactMarkdown plugins={[remarkGfm, remarkGemoji]}>
                      {reply.description}
                    </ReactMarkdown>
                  </Tooltip>
                </FlexColumn>
                <FlexColumn style={{ justifyContent: 'center' }}>
                  <Button
                    kind="danger--ghost"
                    hasIconOnly
                    iconDescription="Delete"
                    renderIcon={TrashCan20}
                    onClick={(_e) => handleQuickReplyDeletion(reply.id)}
                  />
                </FlexColumn>
              </FlexRow>
            ))}
          </FlexColumn>

          <Column>
            <CreateQuickReplyForm
              onSubmit={(e) => handleCreateQuickReplyFormSubmit(e)}
            >
              <Row>
                <Column>
                  <TextArea
                    required
                    labelText={'Reply'}
                    onChange={(e) => setReply(e.target.value)}
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <Button type="submit">Submit</Button>
                </Column>
              </Row>
            </CreateQuickReplyForm>
            <Divider margin={10} />

            <Row>
              <Column>
                <label className="bx--label">Preview</label>
                <Row>
                  <Column style={{ wordBreak: 'break-all' }}>
                    <ReactMarkdown remarkPlugins={[remarkGemoji, remarkGfm]}>
                      {reply}
                    </ReactMarkdown>
                  </Column>
                </Row>
              </Column>
            </Row>
          </Column>
        </Row>
      </Grid>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { [AUTH_TOKEN]: token } = parseCookies(context);

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  // should be validated first
  const user = jwtDecode<User>(token);

  const replies = await prisma.quickReply.findMany({
    where: {
      userId: user.id
    }
  });

  return {
    props: {
      replies
    }
  };
};

export default QuickRepliesIndex;
