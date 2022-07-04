export class EmailSendDto {
    to: string
    body: {
        message: string,
        data: any
    }
}