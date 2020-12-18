import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import responseTime from 'response-time';
import { renderServerSideApp } from './renderServerSideApp';

const {
  PUBLIC_URL = '',
  RAZZLE_PUBLIC_DIR: PUBLIC_DIR = path.resolve(__dirname, '../public'),
} = process.env;

export const app = express();

app.disable('x-powered-by');
app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(bodyParser.json());

// Serve static assets
app.use(
  PUBLIC_URL,
  express.static(PUBLIC_DIR, {
    maxAge: '30 days',
  })
);

app.use(
  responseTime((_req, res, time) => {
    res.setHeader('X-Response-Time', `${time.toFixed(2)}ms`);
    res.setHeader('Server-Timing', `renderServerSideApp;dur=${time}`);
  })
);

app.use(renderServerSideApp);
