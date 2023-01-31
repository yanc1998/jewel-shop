import Jimp from 'jimp/es';
import {v4} from 'uuid'
import {Result} from "../../../shared/core/Result";
import {AppError} from "../../../shared/core/errors/AppError";

export async function resizeFile(file, dir) {
    try {
        const file_memory = await Jimp.read(file.buffer)
        const file_name = `${v4()}.${file_memory.getExtension()}`
        file_memory.resize(600, 800).write(`${dir}${file_name}`)
        return Result.Ok(file_name)
    } catch (e) {
        Result.Fail(new AppError.UnexpectedError(e))
    }

}
