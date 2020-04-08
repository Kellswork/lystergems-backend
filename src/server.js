import 'core-js/stable';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import routes from './resources/routesIndex';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) =>
  res.status(200).json({
    message: 'Welcome to Kells shopping site',
  }),
);
app.use('/api/v1', routes);

export const server = () => {
  app.listen(PORT, () => console.log(`app listening on port ${PORT}!`));
};

export default app;
