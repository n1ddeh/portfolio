export type OptionalId<T extends { id: string }> = { id?: string } & Omit<
    T,
    'id'
>
