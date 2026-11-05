import { randomBytes } from 'crypto'
import { NextFunction, Request, Response } from 'express'
import { Joi } from 'celebrate'
import BadRequestError from '../errors/bad-request-error'
import ForbiddenError from '../errors/forbidden-error'

const csrfCookieName = '_csrf'

export function csrfToken(req: Request, res: Response) {
    const token =
        req.signedCookies[csrfCookieName] || randomBytes(32).toString('hex')
    res.cookie('_csrf', token, {
        signed: true,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    })
    res.set('Cache-Control', 'no-store').json({ csrfToken: token })
}

export function csrfProtection(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    const unsafe =
        !['GET', 'HEAD', 'OPTIONS'].includes(req.method) ||
        ['/auth/token', '/auth/logout'].includes(req.path)
    if (
        unsafe &&
        (!req.signedCookies[csrfCookieName] ||
            req.get('X-CSRF-Token') !== req.signedCookies[csrfCookieName])
    ) {
        return next(new ForbiddenError('Невалидный CSRF-токен'))
    }
    return next()
}

const querySchema = Joi.object({
    page: Joi.number().integer().min(1).max(100000).default(1),
    limit: Joi.number().integer().min(1).max(10).default(10),
    search: Joi.string().max(100).allow(''),
    status: Joi.string().valid('new', 'completed', 'cancelled', 'delivering'),
    sortField: Joi.string().valid(
        'createdAt',
        'orderNumber',
        'totalAmount',
        'name',
        'email',
        'orderCount',
        'lastOrderDate',
        'status'
    ),
    sortOrder: Joi.string().valid('asc', 'desc'),
    totalAmountFrom: Joi.number().min(0),
    totalAmountTo: Joi.number().min(0),
    orderCountFrom: Joi.number().integer().min(0),
    orderCountTo: Joi.number().integer().min(0),
    orderDateFrom: Joi.string().isoDate(),
    orderDateTo: Joi.string().isoDate(),
    registrationDateFrom: Joi.string().isoDate(),
    registrationDateTo: Joi.string().isoDate(),
    lastOrderDateFrom: Joi.string().isoDate(),
    lastOrderDateTo: Joi.string().isoDate(),
})

export function validateQuery(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    const query = { ...req.query }
    if (typeof query.limit === 'string' && Number(query.limit) > 10) {
        query.limit = '10'
    }
    const { error, value } = querySchema.validate(query)
    if (error) return next(new BadRequestError('Невалидные параметры запроса'))
    req.query = value
    return next()
}
