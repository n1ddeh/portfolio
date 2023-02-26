export const useTime = (): string => {
    const now = new Date()
    return now.toLocaleTimeString()
}
