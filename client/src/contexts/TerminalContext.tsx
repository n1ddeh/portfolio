import {
    type FC,
    type PropsWithChildren,
    createContext,
    useState,
    useContext,
} from 'react'
import { v4 } from 'uuid'
import { isUndefined, trim } from 'lodash'

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

    /**
     *  Sets the pending line item
     */
    updatePendingLineItem: (newLineItem: TerminalPendingLineItem) => void
}

enum TerminalCommand {
    CLEAR = 'clear',
    NAME = 'name',
    HELP = 'help',
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

    const clear = (): void => {
        setHiddenLineItems((currentHiddenLineItems) => [
            ...lineItems,
            ...currentHiddenLineItems,
        ])
        setLineItems([])
    }

    const name = (): void => {
        addRootLineItem('Mark Minkoff')
    }

    const help = (): void => {
        const docs: { [command in TerminalCommand]: string } = {
            [TerminalCommand.CLEAR]: 'hides line items from the terminal',
            [TerminalCommand.NAME]: 'prints the autahor\'s name',
            [TerminalCommand.HELP]: 'documentation per available command',
        }
        const commands = Object.keys(docs).sort()
        for (const command of commands) {
            addRootLineItem(`${command} - ${docs[command as TerminalCommand]}`)
        }
    }

    const commandParser = (text: string): void => {
        const options: { [command in TerminalCommand]: () => void } = {
            [TerminalCommand.CLEAR]: clear,
            [TerminalCommand.NAME]: name,
            [TerminalCommand.HELP]: help,
        }
        if (options[text as TerminalCommand] !== undefined) {
            options[text as TerminalCommand]()
        } else {
            addRootLineItem(`msh: command not found: ${text}`)
        }
    }

    return (
        <TerminalContext.Provider
            value={{
                data: lineItems,
                hiddenLineItems,
                pendingLineItem,
                addLineItem,
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
