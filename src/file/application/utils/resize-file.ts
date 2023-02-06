import Jimp from 'jimp/es';
import {v4} from 'uuid'
import {Result} from "../../../shared/core/Result";
import {AppError} from "../../../shared/core/errors/AppError";

export async function resizeFile(file, dir) {
    try {
        const validExtensions = ['jpg', 'png', 'jpeg']
        const file_memory = await Jimp.read(file.buffer)
        const extension = file_memory.getExtension()
        if (!validExtensions.includes(extension)) {
            return Result.Fail<string>(new AppError.ValidationError('invalid file extension'))
        }
        const file_name = `${v4()}.${extension}`
        await file_memory.resize(600, 800).writeAsync(`${dir}${file_name}`)
        return Result.Ok(file_name)
    } catch (e) {
        return Result.Fail<string>(new AppError.UnexpectedError(e))
    }

}
