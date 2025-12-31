const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('AI Invoice Management System Backend Running');
});

// AI processing endpoint placeholder
app.post('/api/process-invoice', async (req, res) => {
  res.json({ message: 'Invoice processing started' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
