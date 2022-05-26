# dbw-projeto

## [IMAGE GALLERY](https://imgur.com/a/cKflNNq)

For the final project of the Web-Based Development 2022 course, it was intended to develop a helpdesk system. To this end, students must implement the requirements that specify the helpdesk using a set of technologies of their choice based on the Node ecosystem.

The developed system has 3 main components:

- **Frequently Asked Questions, FAQ**: composed over time with the questions and their solutions that are frequently asked by users of the helpdesk service in order not to overload agents;
- **Live chat**: logged in agents may answer to questions in real time in a chat room;
- **Ticketing system**: a set of features which allows users to create questions and agents to solve said questions.

Tools used:

- TypeScript
- Next.js
- Prisma
- socket.io
- Carbon Design Components

For a more comprehensive list, check `package.json`.

## Getting Started

1. Fork the repository: `git clone https://github.com/carlos-menezes/dbw-projeto.git && cd dbw-projeto`
2. `npm i`
3. Create a MongoDB database and fill `.env` with the connection string, aswell as a token for
4. `npx prisma generate`
5. `npm run dev`

## Future Work

Although there will be no further development in this project, we muster a couple of points which would be subject to further work:

- **Implement refresh tokens**: sessions expire after one hour, which does not contribute to a great UX;
- **Split components into smaller units**: many components in this project deserve to be seggregated into separate files, which would allow for an easier unit testing of said components.

socket.io and Next.js isn't a good experience. I think there's a chance to build a better developer experience in this space without having to roll your own server (see: `server/server.ts`).
