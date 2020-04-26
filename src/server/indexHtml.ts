import { ChunkExtractor } from '@loadable/server';
import ServerStyleSheets from '@material-ui/styles/ServerStyleSheets';
import { pickBy } from 'lodash';
import { HelmetData } from 'react-helmet-async';
import { ServerData } from '../components/ServerData';

export const indexHtml = ({
  helmet,
  serverData,
  markup,
  extractor,
  sheets,
}: {
  helmet: HelmetData;
  serverData: ServerData;
  markup: string;
  extractor: ChunkExtractor;
  sheets: ServerStyleSheets;
}) => `<!doctype html>
<html ${helmet.htmlAttributes.toString()}>
<head>
  ${helmet.title.toString()}
  ${helmet.meta.toString()}
  ${extractor.getLinkTags()}
  ${helmet.link.toString()}
  ${extractor.getStyleTags()}
  ${helmet.style.toString()}
  <style id="jss-ssr">${sheets.toString()}</style>
  ${helmet.noscript.toString()}
  ${helmet.script.toString()}
</head>
<body ${helmet.bodyAttributes.toString()}>
  <div id="root">${markup}</div>
  <script>
    window.env = ${JSON.stringify(clientEnv)};
    window.__SERVER_DATA__ = ${JSON.stringify(serverData)};
  </script>
  ${extractor.getScriptTags()}
</body>
</html>
`;

const clientEnv: NodeJS.ProcessEnv = {
  NODE_ENV: process.env.NODE_ENV,
  PUBLIC_URL: process.env.PUBLIC_URL,
  VERSION: process.env.VERSION,
  ...pickBy(process.env, (val, key) => key.startsWith('RAZZLE_')),
};
