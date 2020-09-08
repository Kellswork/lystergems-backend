import 'core-js/stable';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';
import throng from 'throng';

import routes from './resources/routesIndex';

const app = express();
const PORT = process.env.PORT || 3000;
const CONCURRENCY = process.env.WEB_CONCURRENCY || 1;

function startMaster() {
  console.log(`Started master`);
  app.listen(PORT, () =>
    console.log(
      `app listening on port ${PORT}! with ${CONCURRENCY} concurrency`,
    ),
  );
}

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) =>
  res.status(200).json({
    message: 'Welcome to the shopping site',
  }),
);
app.use('/api/v1', routes);

function startWorker(id) {
  console.log(`Started worker ${id}`);

  process.on('SIGTERM', () => {
    console.log(`Worker ${id} exiting...`);
    console.log('(cleanup would happen here)');
    process.exit();
  });
}

export const server = () => {
  throng({
    workers: 4,
    master: startMaster,
    start: startWorker,
  });
};

export default app;
