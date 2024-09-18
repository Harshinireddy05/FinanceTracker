// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const Transaction = require('./models/transaction.js');
// const mongoose = require('mongoose');
// const app = express();
// const port = 3030;

// app.use(cors());
// app.use(express.json());
// app.get('/api/test', (req, res) => {
//     res.send('Test ok!');
// });

// app.post('/api/transaction', async(req, res) => {
//     console.log(process.env.MONGODB_URL);
//     await mongoose.connect(process.env.MONGODB_URL);
//     const {name, description, datetime, price} = req.body;
//     const newTransaction = await Transaction.create({name, description, datetime, price});
//     res.json(newTransaction);
// });

// app.get('/api/transaction', async(req, res) => {
//     await mongoose.connect(process.env.MONGODB_URL);
//     const transactions = await Transaction.find();
//     res.json(transactions);
// });

// app.listen(port, 3030);

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Transaction = require('./models/transaction.js');
const mongoose = require('mongoose');
const app = express();
const port = 3030;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.get('/api/test', (req, res) => {
    res.send('Test ok!');
});

app.post('/api/transaction', async(req, res) => {
    try {
        const {name, description, datetime, price} = req.body;
        const newTransaction = await Transaction.create({
            name,
            description,
            datetime,
            price: parseFloat(price)
        });
        res.status(201).json(newTransaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

app.get('/api/transaction', async(req, res) => {
    try {
        const transactions = await Transaction.find().sort({datetime: -1});
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});