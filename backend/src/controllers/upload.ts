import { NextFunction, Request, Response } from 'express'
import { promises as fs } from 'fs'
import path from 'path'
import sharp from 'sharp'
import BadRequestError from '../errors/bad-request-error'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { file } = req
    if (!file) return next(new BadRequestError('Файл не загружен'))
    const converted = `${file.path}.png`
    try {
        if (file.size <= 2048)
            throw new BadRequestError('Файл должен быть больше 2 КБ')
        await sharp(file.path, { limitInputPixels: 25000000 })
            .rotate()
            .png()
            .toFile(converted)
        const filename = `${file.filename}.png`
        await fs.rename(converted, path.join(path.dirname(file.path), filename))
        return res.status(201).json({
            fileName: `/${process.env.UPLOAD_PATH || 'images'}/${filename}`,
            originalName: path.basename(file.originalname),
        })
    } catch (_error) {
        await fs.unlink(converted).catch(() => undefined)
        return next(new BadRequestError('Некорректное изображение'))
    } finally {
        await fs.unlink(file.path).catch(() => undefined)
    }
}
