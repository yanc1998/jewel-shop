import * as fs from "fs";
import {File} from "../../../../../src/file/domain/entities/file.entity";
import {isUUID} from "@nestjs/common/utils/is-uuid";
import {AppError} from "../../../../../src/shared/core/errors/AppError";

describe('file domain test', () => {
    const pathFile = process.cwd() + '/unit-test/public/'
    beforeAll(() => {
        // remove all files
        const files = fs.readdirSync(pathFile).filter((fileName) => fileName != 'test.jpg')
        files.map((file) => fs.unlinkSync(pathFile + file))
    })

    describe('create', () => {

        it('create success', () => {
            const fileCreateProps = {
                url: '121232s3434.jpg',
                createdAt: new Date(),
                updatedAt: new Date()
            }
            const fileCreatedOrError = File.Create(fileCreateProps)
            expect(fileCreatedOrError.isSuccess).toBeTruthy()
            const fileCreated = fileCreatedOrError.unwrap()
            expect(fileCreated._id).not.toBeNull()
            expect(isUUID(fileCreated._id.toString(), '4')).toBeTruthy()
            expect(fileCreated.url).toEqual(fileCreateProps.url)
            expect(fileCreated.createdAt).not.toBeNull()
        })
    })

    describe('new', () => {

        it('new success', async () => {
            const fileNewProps = {
                file: {buffer: fs.readFileSync(pathFile + 'test.jpg')},
                fileDir: pathFile,
            }
            const fileNewOrError = await File.New(fileNewProps)
            expect(fileNewOrError.isSuccess).toBeTruthy()
            const fileNew = fileNewOrError.unwrap()
            expect(fileNew.createdAt).not.toBeNull()
            const createdFile = fs.existsSync(pathFile + fileNew.url)
            expect(createdFile).toBeTruthy()
        })

        it('new error', async () => {
            const fileNewProps = {
                file: {buffer: ''},
                fileDir: pathFile,
            }
            const fileNewOrError = await File.New(fileNewProps)
            expect(fileNewOrError.isSuccess).not.toBeTruthy()
            const fileError = fileNewOrError.unwrapError()
            expect(fileError).toBeInstanceOf(AppError.UnexpectedError)
        })
    })

    describe('update', () => {

        it('update success', async () => {
            const fileCreateProps = {
                url: '121232s3434.jpg',
                createdAt: new Date(),
                updatedAt: new Date()
            }
            const fileCreated = File.Create(fileCreateProps).unwrap()
            const fileUpdateProps = {
                file: {buffer: fs.readFileSync(pathFile + 'test.jpg')},
                fileDir: pathFile,
            }

            const fileUpdatedOrError = await fileCreated.Update(fileUpdateProps)
            expect(fileUpdatedOrError.isSuccess).toBeTruthy()
            const fileUpdated = fileUpdatedOrError.unwrap()
            expect(fileUpdated.updatedAt).not.toBeNull()
        })
    })

})
