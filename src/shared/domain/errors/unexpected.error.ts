export class UnexpectedError extends Error {
    constructor(message = 'Unexpected error') {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
