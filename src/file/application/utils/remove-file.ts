import * as fs from "fs";

export function removeFile(fileName, dir) {
    try {
        return fs.unlinkSync(`${dir}${fileName}`)
    } catch (e) {

    }

}
