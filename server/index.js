require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit')

connectDB();

const app = express();
const PORT = process.env.PORT || 5001;


const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 60, 
  standardHeaders: true, 
  legacyHeaders: false, 
  
  
  message: {
    error: {
      code: "RATE_LIMIT",
      message: "Too many requests from this IP, please try again after a minute"
    }
  }
});



app.use(cors()); 
app.use(express.json()); 

app.use('/api', limiter); 

app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tickets', require('./routes/tickets'));


app.get('/', (req, res) => {
  res.send('HelpDesk API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});