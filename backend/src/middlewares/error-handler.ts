import { ErrorRequestHandler } from 'express'
import { MulterError } from 'multer'

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    const statusCode =
        err instanceof MulterError ? 400 : err.statusCode || err.status || 500
    const message =
        statusCode === 500 ? 'На сервере произошла ошибка' : err.message
    res.status(statusCode).send({ message })
}

export default errorHandler
