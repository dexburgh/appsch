const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes');

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.listen(3000, () => console.log('MediBurgh Billing API running on port 3000'));