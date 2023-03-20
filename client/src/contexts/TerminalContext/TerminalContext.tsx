import {
    type FC,
    type PropsWithChildren,
    createContext,
    useState,
    useContext,
} from 'react'
import { v4 } from 'uuid'
import { isUndefined, random, split, trim, last, isString } from 'lodash'
import { useHello } from '../../terminal-programs/useHello'
import { useTime } from '../../terminal-programs/useTime'
import { useHelp } from '../../terminal-programs/useHelp'
import { useAuthor } from '../../terminal-programs/useAuthor'
import { useRickRoll } from '../../terminal-programs/useRickRoll'
import { sleep } from '../../utils/sleep'
import { useContactMe } from '../../terminal-programs/useContactMe'
import { useSource } from '../../terminal-programs/useSource'
import { useAnalyticsContext } from '../AnalyticsContext'
import { AnalyticsEvent } from '../../data/types/AnalyticsEvent'
import { TerminalCommand } from '../../data/types/TerminalCommand'
import {
    useCommandHistory,
    type UseCommandHistoryResponse,
} from './hooks/useCommandHistory'

export enum User {
    ROOT = 'ROOT',
    USER = 'USER',
}

interface TerminalLineItem {
    id: string
    value: string
    user: User
}

type TerminalPendingLineItem = Pick<TerminalLineItem, 'value'>

type TerminalContextProps = {
    data: TerminalLineItem[]
    hiddenLineItems: TerminalLineItem[]

    /**
     * What the user is typing
     */
    pendingLineItem: TerminalPendingLineItem

    /**
     * Adds the pendingLineItem to data and clears it
     */
    addLineItem: () => void

    addRootLineItem: (text: string) => void

    /**
     *  Sets the pending line item
     */
    updatePendingLineItem: (newLineItem: TerminalPendingLineItem) => void

    /**
     * Type an input into the terminal
     */
    typePendingLineItem: (
        newLineItem: TerminalPendingLineItem,
        options?: { finalItem?: TerminalPendingLineItem }
    ) => Promise<void>

    /**
     * Determines if `typePendingLineItem()` is firing
     */
    isTyping: boolean
} & Pick<
    UseCommandHistoryResponse,
    'commandHistoryForward' | 'commandHistoryBack' | 'commandHistoryValue'
>

const TerminalContext = createContext<TerminalContextProps | undefined>(
    undefined
)

export const TerminalProvider: FC<PropsWithChildren> = ({ children }) => {
    const {
        commandHistoryValue,
        commandHistoryForward,
        commandHistoryBack,
        commandHistoryAdd,
        commandHistoryBottom,
    } = useCommandHistory()

    const [lineItems, setLineItems] = useState<TerminalContextProps['data']>([])

    const { logEvent } = useAnalyticsContext()
    const [hiddenLineItems, setHiddenLineItems] = useState<
        TerminalContextProps['hiddenLineItems']
    >([])
    const [pendingLineItem, setPendingLineItem] =
        useState<TerminalPendingLineItem>({ value: '' })

    const [isTyping, setIsTyping] = useState<boolean>(false)

    const addLineItem = (): void => {
        const sanitizedValue = trim(pendingLineItem.value)

        if (sanitizedValue !== '') {
            commandHistoryAdd(sanitizedValue)
            commandHistoryBottom()
            setLineItems((currentLineItems) => [
                ...currentLineItems,
                { id: v4(), user: User.USER, value: pendingLineItem.value },
            ])
            commandParser(sanitizedValue)
        }

        setPendingLineItem({ value: '' })
    }

    /**
     * Adds text from the ROOT user to the terminal interface
     */
    const addRootLineItem = (text: string): void => {
        setLineItems((currentLineItems) => [
            ...currentLineItems,
            { id: v4(), user: User.ROOT, value: text },
        ])
    }

    const updatePendingLineItem = (
        newLineItem: TerminalPendingLineItem
    ): void => {
        setPendingLineItem(newLineItem)
    }

    const typePendingLineItem = async (
        newLineItem: TerminalPendingLineItem,
        options: { finalItem?: TerminalPendingLineItem } = {}
    ): Promise<void> => {
        setPendingLineItem({ value: '' })

        if (newLineItem.value.length === 0) return

        setIsTyping(true)

        const lineItemsOverTime: Array<{ value: string; time: number }> = [
            { value: newLineItem.value[0], time: 0 },
        ]

        const minMs = 10
        const maxMs = 50

        for (let i = 1; i < newLineItem.value.length; i++) {
            const nextValue =
                lineItemsOverTime[i - 1].value + newLineItem.value[i]
            lineItemsOverTime.push({
                value: nextValue,
                time: random(minMs, maxMs),
            })
        }

        for (const lineItem of lineItemsOverTime) {
            setPendingLineItem({ value: lineItem.value })
            await sleep(lineItem.time)
        }

        const lastItem =
            options.finalItem?.value ?? last(lineItemsOverTime)?.value

        if (lastItem !== undefined) {
            addRootLineItem(lastItem)
        }

        setPendingLineItem({ value: '' })
        setIsTyping(false)
    }

    const clear = (): string => {
        setHiddenLineItems((currentHiddenLineItems) => [
            ...lineItems,
            ...currentHiddenLineItems,
        ])
        setLineItems([])
        return ''
    }

    const commandParser = (text: string): void => {
        const options: {
            [command in TerminalCommand]: () => string | string[]
        } = {
            [TerminalCommand.CLEAR]: clear,
            [TerminalCommand.AUTHOR]: useAuthor,
            [TerminalCommand.HELP]: useHelp,
            [TerminalCommand.TIME]: useTime,
            [TerminalCommand.HELLO]: useHello,
            [TerminalCommand.HI]: useHello,
            [TerminalCommand.RICK_ROLL]: useRickRoll,
            [TerminalCommand.CONTACT_ME]: useContactMe,
            [TerminalCommand.SOURCE]: useSource,
        }
        if (options[text as TerminalCommand] !== undefined) {
            let res = options[text as TerminalCommand]()
            if (!isString(res)) {
                res = res.join('\n')
            }
            if (res !== '') {
                const sanitized = sanitizer(res)
                for (const sanitizedValue of sanitized) {
                    addRootLineItem(sanitizedValue)
                }
                sendAnalyticsForCommand(text)
            }
        } else {
            addRootLineItem(`msh: command not found: **${text}**`)
        }
    }

    const sendAnalyticsForCommand = (text: string): void => {
        if (text === TerminalCommand.CONTACT_ME) {
            logEvent(AnalyticsEvent.TERMINAL_COMMAND_CONTACT_ME)
        }
    }

    const sanitizer = (text: string): string[] => {
        const lines = split(text, '\n')
        return lines
    }

    return (
        <TerminalContext.Provider
            value={{
                data: lineItems,
                hiddenLineItems,
                pendingLineItem,
                addLineItem,
                addRootLineItem,
                updatePendingLineItem,
                typePendingLineItem,
                isTyping,
                commandHistoryValue,
                commandHistoryForward,
                commandHistoryBack,
            }}
        >
            {children}
        </TerminalContext.Provider>
    )
}

export const useTerminalContext = (): TerminalContextProps => {
    const context = useContext(TerminalContext)
    if (isUndefined(context))
        throw new Error(
            'useTerminalContext() must be used within an TerminalProvider'
        )
    return context
}

export const useAddRootLineItem = (): ((text: string) => void) => {
    const context = useTerminalContext()
    return context.addRootLineItem
}
