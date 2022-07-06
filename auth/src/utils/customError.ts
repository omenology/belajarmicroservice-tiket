import { ValidationError } from "express-validator"

export class ErrorValidationRequest extends Error {
    constructor(public errors:ValidationError[]) {
        super()
    }
}

export class ErrorDatabaseConnection extends Error {
    constructor(public message:string) {
        super()
    }
}