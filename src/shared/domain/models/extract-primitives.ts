export type ExtractPrimitives<T> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in keyof T as T[K] extends { value: any } ? K : never]: T[K] extends { value: infer V } ? V : never;
};

export type ExtractOptionalPrimitives<T> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in keyof T as T[K] extends { value: any } ? K : never]?: T[K] extends { value: infer V } ? V : never;
};
