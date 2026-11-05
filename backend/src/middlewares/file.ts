import { randomUUID } from 'crypto'
import { mkdirSync } from 'fs'
import { join } from 'path'
import multer from 'multer'

const destination = join(
    __dirname,
    '../public',
    process.env.UPLOAD_PATH_TEMP || 'temp'
)
mkdirSync(destination, { recursive: true })

const storage = multer.diskStorage({
    destination,
    filename: (_req, _file, cb) => cb(null, randomUUID()),
})

export default multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 - 1, files: 1, fields: 0 },
    fileFilter: (_req, file, cb) => {
        cb(
            null,
            [
                'image/png',
                'image/jpeg',
                'image/jpg',
                'image/gif',
                'image/webp',
            ].includes(file.mimetype)
        )
    },
})
