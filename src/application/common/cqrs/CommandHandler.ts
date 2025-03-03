export interface CommandHandler<T, U extends Record<string, any> | undefined> {
    handle(command: T): Promise<U>;
}
