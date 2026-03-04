// const express = require('express');
import express from  'express'
// const cors = require('cors');
import publicRoutes from


require('dotenv').config();

const { connectDB } = require('./database/connection');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});