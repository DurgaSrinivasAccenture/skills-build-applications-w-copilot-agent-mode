import { createApp } from './index';
import db from './config/database';
import { API_BASE_URL } from './config/api';

const port = Number(process.env.PORT || 8000);
const app = createApp();

app.listen(port, () => {
  const codespaceName = process.env.CODESPACE_NAME;
  
  console.log(`Octofit Tracker API running on http://localhost:${port}`);
  
  if (codespaceName) {
    console.log(`Codespaces API URL: https://${codespaceName}-8000.app.github.dev`);
  } else {
    console.log(`Codespaces API URL: ${API_BASE_URL}`);
  }
});

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
