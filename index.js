const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
