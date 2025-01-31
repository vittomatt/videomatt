export class VideoRead {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly description: string,
        public readonly url: string,
        public readonly amountOfComment: number,
        public readonly userId: string
    ) {}
}
