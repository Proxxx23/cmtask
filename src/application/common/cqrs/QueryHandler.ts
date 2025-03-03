export interface QueryHandler<T extends Record<string, any>, U extends Record<string, any>> {
    handle(query: T): Promise<U>;
}
