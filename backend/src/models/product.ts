import { unlink } from 'fs'
import mongoose, { Document, UpdateQuery } from 'mongoose'
import { basename, join } from 'path'

export interface IFile {
    fileName: string
    originalName: string
}

export interface IProduct extends Document {
    title: string
    image: IFile
    category: string
    description: string
    price: number
}

const cardsSchema = new mongoose.Schema<IProduct>(
    {
        title: {
            type: String,
            unique: true,
            required: [true, 'Поле "title" должно быть заполнено'],
            minlength: [2, 'Минимальная длина поля "title" - 2'],
            maxlength: [30, 'Максимальная длина поля "title" - 30'],
        },
        image: {
            fileName: {
                type: String,
                required: [true, 'Поле "image.fileName" должно быть заполнено'],
            },
            originalName: String,
        },
        category: {
            type: String,
            required: [true, 'Поле "category" должно быть заполнено'],
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
            default: null,
        },
    },
    { versionKey: false }
)

cardsSchema.index({ title: 'text' })

// Можно лучше: удалять старое изображением перед обновлением сущности
cardsSchema.pre('findOneAndUpdate', async function deleteOldImage() {
    const update = this.getUpdate() as UpdateQuery<IProduct> | null
    const updateImage = update?.$set?.image
    const docToUpdate = await this.model.findOne(this.getQuery())
    if (
        updateImage &&
        docToUpdate &&
        updateImage.fileName !== docToUpdate.image.fileName
    ) {
        unlink(
            join(
                __dirname,
                '../public',
                process.env.UPLOAD_PATH || 'images',
                basename(docToUpdate.image.fileName)
            ),
            (err) => console.log(err)
        )
    }
})

// Можно лучше: удалять файл с изображением после удаление сущности
cardsSchema.post('findOneAndDelete', async (doc: IProduct) => {
    if (!doc) return
    unlink(
        join(
            __dirname,
            '../public',
            process.env.UPLOAD_PATH || 'images',
            basename(doc.image.fileName)
        ),
        (err) => console.log(err)
    )
})

export default mongoose.model<IProduct>('product', cardsSchema)
