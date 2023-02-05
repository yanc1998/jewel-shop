import {UserStatus} from "../../../../../src/user/domain/enums/user.status";
import {Roles} from "../../../../../src/shared/domain/enum.permits";
import {User} from "../../../../../src/user/domain/entities/user.entity";
import {AppError} from "../../../../../src/shared/core/errors/AppError";
import {isUUID} from "@nestjs/common/utils/is-uuid";

describe('user domain test', () => {

    describe('create', () => {

        it('create success', () => {
            const createUserProps = {
                username: "Name",
                email: "test@gmail.com",
                password: "onepassword",
                status: UserStatus.Register,
                roles: [Roles.Admin],
                createdAt: new Date(),
                updatedAt: new Date()

            }
            const userCreatedOrError = User.Create(createUserProps)
            expect(userCreatedOrError.isSuccess).toBeTruthy()
            const userCreated = userCreatedOrError.unwrap()

            expect(userCreated._id).not.toBeNull()
            expect(isUUID(userCreated._id.toString(),'4')).toBeTruthy()
            expect(userCreated.username).toEqual(createUserProps.username)
            expect(userCreated.status).toEqual(createUserProps.status)
            expect(userCreated.email).toEqual(createUserProps.email)
            expect(userCreated.roles).toEqual(createUserProps.roles)
            expect(userCreated.password).toEqual(createUserProps.password)
            expect(userCreated.createdAt).toEqual(createUserProps.createdAt)
            expect(userCreated.updatedAt).toEqual(createUserProps.updatedAt)
        })

        it('create fail', () => {
            const createUserProps = {
                username: "N",
                email: "test@gmail.com",
                password: "onepassword",
                status: UserStatus.Register,
                roles: [Roles.Admin],
                createdAt: new Date(),
                updatedAt: new Date()
            }
            const userCreatedOrError = User.Create(createUserProps)
            expect(userCreatedOrError.isSuccess).toBeFalsy()
        });

        it('create fail, invalid user name', () => {
            const createUserProps = {
                username: "N",
                email: "test@gmail.com",
                password: "onePassword",
                status: UserStatus.Register,
                roles: [Roles.Admin],
                createdAt: new Date(),
                updatedAt: new Date()
            }
            const userCreatedOrError = User.Create(createUserProps)
            expect(userCreatedOrError.isSuccess).toBeFalsy()
            const error = userCreatedOrError.unwrapError()
            expect(error).toBeInstanceOf(AppError.ValidationError)
            expect(error.message).not.toBeNull()
            expect(error.message).toMatch('username')
        });

        it('create fail, invalid password', () => {
            const createUserProps = {
                username: "Name",
                email: "test@gmail.com",
                password: "one",
                status: UserStatus.Register,
                roles: [Roles.Admin],
                createdAt: new Date(),
                updatedAt: new Date()
            }
            const userCreatedOrError = User.Create(createUserProps)
            expect(userCreatedOrError.isSuccess).toBeFalsy()
            const error = userCreatedOrError.unwrapError()
            expect(error).toBeInstanceOf(AppError.ValidationError)
            expect(error.message).not.toBeNull()
            expect(error.message).toMatch('password')
        });

        it('create fail, invalid email', () => {
            const createUserProps = {
                username: "Name",
                email: "test.gmail.com",
                password: "onePassword",
                status: UserStatus.Register,
                roles: [Roles.Admin],
                createdAt: new Date(),
                updatedAt: new Date()
            }
            const userCreatedOrError = User.Create(createUserProps)
            expect(userCreatedOrError.isSuccess).toBeFalsy()
            const error = userCreatedOrError.unwrapError()
            expect(error).toBeInstanceOf(AppError.ValidationError)
            expect(error.message).not.toBeNull()
            expect(error.message).toMatch('email')
        });
    })

    describe('new', () => {

        it('new success', () => {
            const newUserProps = {
                username: "Name",
                email: "test@gmail.com",
                password: "onepassword",
                status: UserStatus.Register,
                roles: [Roles.Admin],
            }
            const userCreatedOrError = User.New(newUserProps)
            expect(userCreatedOrError.isSuccess).toBeTruthy()
            const userCreated = userCreatedOrError.unwrap()
            expect(userCreated.createdAt).not.toBeNull()
        })
    })

    describe('update', () => {

        it('update success', () => {

            const newUserProps = {
                username: "Name",
                email: "test@gmail.com",
                password: "onepassword",
                status: UserStatus.Register,
                roles: [Roles.Admin],
            }
            const updateUserProps = {
                username: "NewName",
                email: "newtest@gmail.com",
                password: "newOnePassword",
                status: UserStatus.Pending,
                roles: [Roles.Client],
            }
            const userCreated = User.New(newUserProps).unwrap()
            const userUpdatedOrError = userCreated.Update(updateUserProps)
            expect(userUpdatedOrError.isSuccess).toBeTruthy()
            const userUpdated = userUpdatedOrError.unwrap()

            expect(userUpdated._id).toEqual(userCreated._id)
            expect(userUpdated.username).toEqual(updateUserProps.username)
            expect(userCreated.status).toEqual(updateUserProps.status)
            expect(userCreated.email).toEqual(updateUserProps.email)
            expect(userCreated.roles).toEqual(updateUserProps.roles)
            expect(userCreated.password).toEqual(updateUserProps.password)
            expect(userCreated.updatedAt).not.toBeNull()
        })
    })

})
