import {
    type FC,
    type PropsWithChildren,
    createContext,
    useState,
    useContext,
} from 'react'
import { v4 } from 'uuid'
import { isUndefined, random, chain, trim, last } from 'lodash'
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
import { useCommandParser } from './hooks/useCommandParser'

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
    const [lineItems, setLineItems] = useState<TerminalContextProps['data']>([])
    const [isTyping, setIsTyping] = useState<boolean>(false)
    const [pendingLineItem, setPendingLineItem] =
        useState<TerminalPendingLineItem>({ value: '' })

    const { logEvent } = useAnalyticsContext()

    const clearLineItems = (): string[] => {
        setLineItems([])
        return ['']
    }

    const {
        commandHistoryValue,
        commandHistoryForward,
        commandHistoryBack,
        commandHistoryAdd,
        commandHistoryBottom,
    } = useCommandHistory()

    const commandCallbackMap: {
        [commandKey in TerminalCommand]: () => string[]
    } = {
        [TerminalCommand.CLEAR]: clearLineItems,
        [TerminalCommand.AUTHOR]: useAuthor,
        [TerminalCommand.HELP]: useHelp,
        [TerminalCommand.TIME]: useTime,
        [TerminalCommand.HELLO]: useHello,
        [TerminalCommand.HI]: useHello,
        [TerminalCommand.RICK_ROLL]: useRickRoll,
        [TerminalCommand.CONTACT_ME]: (() => {
            logEvent(AnalyticsEvent.TERMINAL_COMMAND_CONTACT_ME)
            return useContactMe
        })(),
        [TerminalCommand.SOURCE]: useSource,
    }

    const { commandParser } = useCommandParser({ commandCallbackMap })

    const addLineItem = (): void => {
        const sanitizedValue = trim(pendingLineItem.value)

        if (sanitizedValue === '') return

        setPendingLineItem({ value: '' })
        commandHistoryAdd(sanitizedValue)
        commandHistoryBottom()
        setLineItems((currentLineItems) => [
            ...currentLineItems,
            { id: v4(), user: User.USER, value: pendingLineItem.value },
        ])
        const commandResult = commandParser(sanitizedValue)

        const lineItemsToAdd: TerminalLineItem[] =
            commandResult === false
                ? [
                      {
                          id: v4(),
                          user: User.ROOT,
                          value: `msh: command not found: **${sanitizedValue}**`,
                      },
                  ]
                : chain(commandResult)
                      .compact()
                      .map((result) => ({
                          id: v4(),
                          user: User.USER,
                          value: result,
                      }))
                      .value()

        setLineItems((currentLineItems) => [
            ...currentLineItems,
            ...lineItemsToAdd,
        ])
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

    return (
        <TerminalContext.Provider
            value={{
                data: lineItems,
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
