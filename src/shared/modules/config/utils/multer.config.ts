import {MulterOptions} from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import {HttpException} from "@nestjs/common";
import {diskStorage} from 'multer'

export function multerOptions(path) {
    const options = {
        limits: {
            fileSize: 20 * 1024 * 1024
        },
        async fileFilter(req: Request, file: any, cb: any) {
            if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {

                await cb(null, true)

            } else {

                //new FileError.FileExtensionError('incorrect extension of a file')
                await cb(new HttpException('incorrect file extension', 400), false)

            }
        },
        storage: diskStorage({
            destination: path,
            filename: (req: any, file: any, cb: any) => {
                const splitName = file.originalname.split('.')
                const randomName: string = new Date().toISOString() + '.' + splitName[splitName.length - 1];
                cb(null, randomName)
            }
        })

    }
    return options

}
