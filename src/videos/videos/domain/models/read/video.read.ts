// FITU Is this a DTO or a domain
export class VideoRead {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly description: string,
        public readonly url: string,
        public amountOfComments: number,
        public readonly userId: string
    ) {}

    static create({
        id,
        title,
        description,
        url,
        userId,
        amountOfComments = 0,
    }: {
        id: string;
        title: string;
        description: string;
        url: string;
        userId: string;
        amountOfComments?: number;
    }) {
        return new VideoRead(id, title, description, url, amountOfComments, userId);
    }

    static fromPrimitives({
        id,
        title,
        description,
        url,
        userId,
        amountOfComments,
    }: {
        id: string;
        title: string;
        description: string;
        url: string;
        userId: string;
        amountOfComments: number;
    }) {
        return new VideoRead(id, title, description, url, amountOfComments, userId);
    }

    // FITU does this goes here?
    increaseAmountOfComments() {
        const newAmountOfComments = this.amountOfComments + 1;
        this.amountOfComments = newAmountOfComments;
    }
}
