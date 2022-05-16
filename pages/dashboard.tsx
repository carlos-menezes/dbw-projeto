import { Category, Room, Ticket, TicketStatus } from '@prisma/client';
import {
  Button,
  ButtonSet,
  Column,
  DataTable,
  Link,
  Loading,
  Row,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from 'carbon-components-react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import React, { useContext } from 'react';
import View20 from '@carbon/icons-react/lib/view/20';
import ChatLaunch20 from '@carbon/icons-react/lib/chat--launch/20';
import { PieChart } from '@carbon/charts-react';
import styled from 'styled-components';

import Divider from '../components/Divider';
import FlexHeading from '../components/FlexHeading';
import FlexRow from '../components/FlexRow';
import Layout from '../components/Layout';
import { AuthContext } from '../contexts/AuthContext';
import { AUTH_TOKEN } from '../utils/constants';
import { prisma } from '../services/db';
import FlexColumn from '../components/FlexColumn';
import Grid from '../components/Grid';

type DashboardProps = {
  tickets: (Ticket & { category: { title: string } })[];
  categories: Category[];
  rooms: (Room & { category: { title: string } })[];
};

type BuildDataTableProps = {
  title: string;
  tickets: (Ticket & { category: { title: string } })[];
  ticketStatus: TicketStatus;
  userId?: string;
};

type TableHeader = { header: string; key: string };

const tableHeaders: TableHeader[] = [
  { header: 'Title', key: 'title' },
  { header: 'Category', key: 'category' },
  { header: 'Created At', key: 'createdAt' },
  { header: 'Actions', key: 'actions' }
];

const ActionRow = styled(FlexRow)`
  justify-content: flex-start;
  flex-direction: column;
  gap: 5px;
`;

const ActionColumn = styled(FlexColumn)`
  justify-content: flex-start;
  flex: 0 0 100%;
`;

const CustomTable: React.FC<BuildDataTableProps> = ({
  title,
  tickets,
  ticketStatus,
  userId
}) => {
  return (
    <>
      <Row>
        <Column>
          <h4>
            {title} (
            {
              tickets.filter(
                (t) =>
                  t.status === ticketStatus &&
                  (userId ? t.userId === userId : true)
              ).length
            }
            )
          </h4>
        </Column>
      </Row>

      <Divider margin={5} />

      <DataTable rows={tickets} headers={tableHeaders}>
        {() => (
          <Table
            isSortable
            useZebraStyles
            title={title}
            size="md"
            style={{ wordBreak: 'break-all' }}
          >
            <TableHead>
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableHeader key={header.key}>{header.header}</TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets
                .filter(
                  (t) =>
                    t.status === ticketStatus &&
                    (userId ? t.userId === userId : true)
                )
                .map((row) => (
                  <TableRow key={row.id}>
                    <TableCell style={{ width: '35%' }}>{row.title}</TableCell>
                    <TableCell>{row.category.title}</TableCell>
                    <TableCell>{row.createdAt}</TableCell>
                    <TableCell>
                      <FlexRow>
                        <Column>
                          <Link
                            href={`/ticket/${row.id}`}
                            renderIcon={View20}
                            about="View"
                          ></Link>
                        </Column>
                      </FlexRow>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </DataTable>
    </>
  );
};

const Dashboard: React.FC<DashboardProps> = ({
  tickets,
  categories,
  rooms
}) => {
  const { user } = useContext(AuthContext);

  const getUserCategoryStats = () => {
    const stats: { group: string; value: number }[] = [];

    categories.forEach((c) => {
      const numTicketsForUser = tickets.filter(
        (t) => t.categoryId === c.id && t.userId === user.id
      ).length;

      stats.push({
        group: c.title,
        value: numTicketsForUser
      });
    });

    return stats;
  };

  return (
    <Layout title="Dashboard">
      <Grid maxWidth={'1056px'}>
        {!user ? (
          <Loading />
        ) : (
          <>
            <Row>
              <Column>
                <FlexHeading>
                  <h1>
                    Hello,{' '}
                    <span style={{ fontWeight: 'bold' }}>
                      {user.firstName.concat(' ', user.lastName)}
                    </span>
                    !
                  </h1>
                </FlexHeading>
              </Column>
            </Row>

            <Divider margin={10} />

            <Row>
              <Column lg={4}>
                {/* Personal Statistics */}
                <h4>Personal Statistics</h4>
                <Row>
                  <Column>
                    <PieChart
                      options={{
                        title: 'No. of Tickets',
                        toolbar: {
                          enabled: false
                        },
                        height: '300px',
                        width: '200px'
                      }}
                      data={[
                        {
                          group: TicketStatus.OPEN,
                          value: tickets.filter(
                            (t) =>
                              t.status === TicketStatus.OPEN &&
                              t.userId === user.id
                          ).length
                        },
                        {
                          group: TicketStatus.CLOSED,
                          value: tickets.filter(
                            (t) =>
                              t.status === TicketStatus.CLOSED &&
                              t.userId === user.id
                          ).length
                        }
                      ]}
                    />
                  </Column>
                  <Column>
                    <PieChart
                      options={{
                        title: 'No. Tickets Handled p/ Category',
                        height: '300px',
                        width: '200px',
                        toolbar: {
                          enabled: false
                        }
                      }}
                      data={getUserCategoryStats()}
                    />
                  </Column>
                </Row>

                <Divider margin={15} />

                {/* Global Statistics */}
                <h4>Global Statistics</h4>
                <Row>
                  <Column>
                    <PieChart
                      options={{
                        title: 'No. of Tickets',
                        toolbar: {
                          enabled: false
                        },
                        height: '300px',
                        width: '200px'
                      }}
                      data={[
                        {
                          group: TicketStatus.OPEN,
                          value: tickets.filter(
                            (t) => t.status === TicketStatus.OPEN
                          ).length
                        },
                        {
                          group: TicketStatus.CLOSED,
                          value: tickets.filter(
                            (t) => t.status === TicketStatus.CLOSED
                          ).length
                        },
                        {
                          group: TicketStatus.AVAILABLE,
                          value: tickets.filter(
                            (t) => t.status === TicketStatus.AVAILABLE
                          ).length
                        }
                      ]}
                    />
                  </Column>
                </Row>

                <Divider margin={15} />

                <h4>Administration</h4>
                <ActionRow>
                  <ActionColumn>
                    <Button style={{ width: '100%' }} disabled kind="primary">
                      Edit Categories
                    </Button>
                  </ActionColumn>
                  <ActionColumn>
                    <Button style={{ width: '100%' }} disabled kind="primary">
                      Edit Quick Replies
                    </Button>
                  </ActionColumn>
                </ActionRow>
              </Column>

              <Column>
                {/* Assigned open tickets table */}
                <CustomTable
                  title={'Assigned Open Tickets'}
                  tickets={tickets}
                  ticketStatus={'OPEN'}
                  userId={user.id}
                />

                <Divider margin={15} />

                {/* Assigned closed tickets table */}
                <CustomTable
                  title={'Assigned Closed Tickets'}
                  tickets={tickets}
                  ticketStatus={'CLOSED'}
                  userId={user.id}
                />

                <Divider margin={15} />

                {/* Available tickets table */}
                <CustomTable
                  title={'Available Tickets'}
                  tickets={tickets}
                  ticketStatus={'CLOSED'}
                />

                <Divider margin={15} />

                <Row>
                  <Column>
                    <h4>Live Chat Rooms</h4>
                  </Column>
                </Row>

                <Divider margin={5} />

                {rooms.length === 0 ? (
                  <p>There are no open chat rooms at the moment.</p>
                ) : (
                  <DataTable rows={rooms} headers={tableHeaders}>
                    {() => (
                      <Table
                        isSortable
                        useZebraStyles
                        title={'Live Chat Rooms'}
                        size="md"
                        style={{ wordBreak: 'break-all' }}
                      >
                        <TableHead>
                          <TableRow>
                            {tableHeaders.map((header) => (
                              <TableHeader key={header.key}>
                                {header.header}
                              </TableHeader>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rooms.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell style={{ width: '30%' }}>
                                {row.title}
                              </TableCell>
                              <TableCell>{row.category.title}</TableCell>
                              <TableCell>{row.createdAt}</TableCell>
                              <TableCell>
                                <FlexRow>
                                  <Column>
                                    <Link
                                      href={`/chat/${row.id}`}
                                      renderIcon={ChatLaunch20}
                                      about="View"
                                    ></Link>
                                  </Column>
                                </FlexRow>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </DataTable>
                )}
              </Column>
            </Row>
          </>
        )}
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

  const tickets = await prisma.ticket.findMany({
    include: {
      category: {
        select: {
          title: true
        }
      }
    }
  });
  const categories = await prisma.category.findMany();
  const rooms = await prisma.room.findMany({
    include: {
      category: {
        select: {
          title: true
        }
      }
    }
  });

  return {
    props: {
      tickets: JSON.parse(JSON.stringify(tickets)),
      categories,
      rooms: JSON.parse(JSON.stringify(rooms))
    }
  };
};

export default Dashboard;
