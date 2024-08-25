import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
let port = process.env.PORT
import userRoutes from './routes/userRoute.js'
import adminRoutes from './routes/adminRoute.js'
import ownerRoutes from './routes/ownerRoute.js'
import path from 'path'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


connectDB()

let app = express()

app.use(express.json())
app.use(express.urlencoded({ extended : true}))

app.use(cookieParser())

app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/owner', ownerRoutes)
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.send('server is ready'))
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`Server Started listening on port ${port}`))