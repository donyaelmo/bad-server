import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { ipKeyGenerator, rateLimit } from 'express-rate-limit'
import { REFRESH_TOKEN } from './config'
import { csrfProtection, validateQuery } from './middlewares/security'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { DB_ADDRESS } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'

const { PORT = 3000 } = process.env
const app = express()

app.disable('x-powered-by')
app.use(cookieParser(REFRESH_TOKEN.secret))
app.use(
    cors({
        origin: process.env.ORIGIN_ALLOW || 'http://localhost:5173',
        credentials: true,
    })
)
app.use(serveStatic(path.join(__dirname, 'public')))
app.use(
    rateLimit({
        windowMs: Number(process.env.RATE_LIMIT_DURATION || 60) * 1000,
        limit: Number(process.env.RATE_LIMIT_POINTS || 60),
        skip: (req) => req.path === '/auth/csrf-token',
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req) =>
            ipKeyGenerator(req.socket.remoteAddress || 'unknown'),
    })
)
app.use(urlencoded({ extended: false, limit: '100kb', parameterLimit: 100 }))
app.use(json({ limit: '100kb' }))
app.use(csrfProtection)
app.use(validateQuery)
app.use(routes)
app.use(errors())
app.use(errorHandler)

// eslint-disable-next-line no-console

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
