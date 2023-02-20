import { type FC, type PropsWithChildren, createContext, useState } from 'react'
import { v4 } from 'uuid'
import { trim } from 'lodash'

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

const TerminalContext = createContext<TerminalContextProps | undefined>(
    undefined
)

export const TerminalProvider: FC<PropsWithChildren> = ({ children }) => {
    const [lineItems, setLineItems] = useState<TerminalContextProps['data']>([])
    const [pendingLineItem, setPendingLineItem] =
        useState<TerminalPendingLineItem>({ value: '' })

    const addLineItem = (): void => {
        const sanatizedValue = trim(pendingLineItem.value)

        if (sanatizedValue !== '') {
            setLineItems((currentLineItems) => [
                ...currentLineItems,
                { id: v4(), user: User.USER, value: pendingLineItem.value },
            ])
        }

        setPendingLineItem({ value: '' })
    }

    const updatePendingLineItem = (
        newLineItem: TerminalPendingLineItem
    ): void => {
        setPendingLineItem(newLineItem)
    }

    return (
        <TerminalContext.Provider
            value={{
                data: lineItems,
                pendingLineItem,
                addLineItem,
                updatePendingLineItem,
            }}
        >
            {children}
        </TerminalContext.Provider>
    )
}
