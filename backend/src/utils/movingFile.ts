import { existsSync, mkdirSync, renameSync } from 'fs'
import { basename, join } from 'path'
import BadRequestError from '../errors/bad-request-error'

function movingFile(imagePath: string, from: string, to: string) {
    const fileName = basename(imagePath)
    if (imagePath !== `/images/${fileName}`) {
        throw new BadRequestError('Некорректный путь к изображению')
    }
    const source = join(from, fileName)
    const destination = join(to, fileName)
    mkdirSync(to, { recursive: true })
    if (existsSync(source)) {
        renameSync(source, destination)
    } else if (!existsSync(destination)) {
        throw new BadRequestError('Изображение не найдено')
    }
}

export default movingFile
