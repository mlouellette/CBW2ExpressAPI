const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

const PORT = process.env.PORT;

// Importing my api page
const apiRouter = require('./server/api');
app.use('/api', apiRouter);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

