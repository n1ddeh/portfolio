import { useState, useCallback, useMemo } from 'react'

export type UseCommandHistoryResponse = {
    commandHistory: string[]
    /**
     *
     * @param input - Input to add to the history
     */
    commandHistoryAdd: (input: string) => void

    commandHistoryForward: () => void

    commandHistoryBack: () => void

    /**
     * Goes to the bottom of the history
     */
    commandHistoryBottom: () => void

    commandHistoryValue: string
}

export const useCommandHistory = (): UseCommandHistoryResponse => {
    const [commandHistory, setCommandHistory] = useState<string[]>([])
    const [historyIndex, setHistoryIndex] = useState<number>(0)

    const commandHistoryAdd = useCallback((input: string) => {
        setCommandHistory((currentHistory) => [input, ...currentHistory])
    }, [])

    const commandHistoryForward = useCallback(() => {
        setHistoryIndex((currentIndex) => Math.max(0, currentIndex - 1))
    }, [])

    const commandHistoryBack = useCallback(() => {
        setHistoryIndex((currentIndex) =>
            Math.min(commandHistory.length - 1, currentIndex + 1)
        )
    }, [commandHistory.length])

    const commandHistoryBottom = (): void => {
        setHistoryIndex(0)
    }

    const commandHistoryValue = useMemo(() => {
        if (commandHistory[historyIndex] === undefined) {
            return ''
        }
        return commandHistory[historyIndex]
    }, [commandHistory, historyIndex])

    return {
        commandHistory,
        commandHistoryValue,
        commandHistoryAdd,
        commandHistoryForward,
        commandHistoryBack,
        commandHistoryBottom,
    }
}
