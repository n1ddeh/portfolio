import {
    type FC,
    type PropsWithChildren,
    createContext,
    useState,
    useContext,
} from 'react'
import { v4 } from 'uuid'
import { isUndefined, split, trim } from 'lodash'
import { useHello } from '../terminal-programs/useHello'
import { useTime } from '../terminal-programs/useTime'
import { useHelp } from '../terminal-programs/useHelp'
import { useAuthor } from '../terminal-programs/useAuthor'

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

interface TerminalContextProps {
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
}

export enum TerminalCommand {
    HELLO = 'hello',
    HI = 'hi',
    CLEAR = 'clear',
    AUTHOR = 'author',
    HELP = 'help',
    TIME = 'time',
}

const TerminalContext = createContext<TerminalContextProps | undefined>(
    undefined
)

export const TerminalProvider: FC<PropsWithChildren> = ({ children }) => {
    const [lineItems, setLineItems] = useState<TerminalContextProps['data']>([])
    const [hiddenLineItems, setHiddenLineItems] = useState<
        TerminalContextProps['hiddenLineItems']
    >([])
    const [pendingLineItem, setPendingLineItem] =
        useState<TerminalPendingLineItem>({ value: '' })

    const addLineItem = (): void => {
        const sanatizedValue = trim(pendingLineItem.value)

        if (sanatizedValue !== '') {
            setLineItems((currentLineItems) => [
                ...currentLineItems,
                { id: v4(), user: User.USER, value: pendingLineItem.value },
            ])
            commandParser(sanatizedValue)
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
            [command in TerminalCommand]: () => string
        } = {
            [TerminalCommand.CLEAR]: clear,
            [TerminalCommand.AUTHOR]: useAuthor,
            [TerminalCommand.HELP]: useHelp,
            [TerminalCommand.TIME]: useTime,
            [TerminalCommand.HELLO]: useHello,
            [TerminalCommand.HI]: useHello,
        }
        if (options[text as TerminalCommand] !== undefined) {
            const res = options[text as TerminalCommand]()
            if (res !== '') {
                const sanitized = sanatizer(res)
                for (const sanatizedValue of sanitized) {
                    addRootLineItem(sanatizedValue)
                }
            }
        } else {
            addRootLineItem(`msh: command not found: **${text}**`)
        }
    }

    const sanatizer = (text: string): string[] => {
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
