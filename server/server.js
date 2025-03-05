require('dotenv').config();
const app = require('./app');
const { logger } = require('./src/utils/logger');
const { appConfig } = require('./src/config/app.config');

const port = appConfig.port;

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});