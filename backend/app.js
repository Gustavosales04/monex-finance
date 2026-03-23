import 'dotenv/config'
console.log("DB_SERVER:", process.env.DB_SERVER)
import express from  'express'
import publicRoutes from './routes/public.js'
import privateRoutes from './routes/private.js'
import {connectDB} from './routes/connection.js'
import auth from './middlewares/auth.js'
import cors from "cors";

connectDB();

const app = express()

app.use(cors())
app.use(express.json())
app.use('/',publicRoutes)
app.use('/', auth,privateRoutes)

// app.get('/', (req, res) => {
//   res.send('API funcionando!');
// });

app.listen(3000, () => console.log('Servidor rodando!!'));