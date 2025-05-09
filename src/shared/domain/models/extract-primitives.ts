export type ExtractPrimitives<T> = {
    [K in keyof T as T[K] extends { value: any } ? K : never]: T[K] extends { value: infer V } ? V : never;
};

export type ExtractOptionalPrimitives<T> = {
    [K in keyof T as T[K] extends { value: any } ? K : never]?: T[K] extends { value: infer V } ? V : never;
};
