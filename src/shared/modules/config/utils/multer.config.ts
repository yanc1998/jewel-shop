import {MulterOptions} from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import {HttpException} from "@nestjs/common";
import {diskStorage, memoryStorage} from 'multer'
import {v4} from 'uuid';

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
        storage: memoryStorage({
            filename: (req: any, file: any, cb: any) => {
                const splitName = file.originalname.split('.')
                const randomName: string = v4() + '.' + splitName[splitName.length - 1];
                cb(null, randomName)
            }
        })

    } as MulterOptions
    return options

}
