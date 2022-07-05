import {MulterOptions} from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import {HttpException} from "@nestjs/common";
import {diskStorage} from 'multer'

export const multerOption: MulterOptions = {
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
        filename: (req: any, file: any, cb: any) => {
            const randomName: string = Date.now().toString() + file.originalname;
            cb(null, randomName)
        }
    })

}
