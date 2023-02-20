import { type FC, memo, type DOMAttributes, useState, useEffect } from 'react'
import { WindowM } from '../Common/WindowM'
import { User, useTerminalContext } from '../../contexts/TerminalContext'
import { map } from 'lodash'
import './Terminal.css'

export const Terminal: FC = memo(() => {
    const { data, updatePendingLineItem, addLineItem, pendingLineItem } =
        useTerminalContext()

    const [shouldScrollOnNextTick, setShouldScrollOnNextTick] =
        useState<boolean>(false)

    useEffect(() => {
        if (shouldScrollOnNextTick) {
            scrollToBottomOfTerminal()
            setShouldScrollOnNextTick(false)
        }
    }, [shouldScrollOnNextTick])

    const lineItems = map(data, (lineItem) => {
        return (
            <div key={lineItem.id} className="leading-tight">
                {lineItem.user === User.USER ? (
                    <span className="text-green-700">{'> '}</span>
                ) : undefined}
                {lineItem.value}
            </div>
        )
    })

    const onKeyDownEventHandler: DOMAttributes<HTMLInputElement>['onKeyDown'] =
        (event) => {
            if (event.key === 'Enter') {
                addLineItem()
            }

            setShouldScrollOnNextTick(true)
        }

    const scrollToBottomOfTerminal = (): void => {
        const terminalWindowElement = document.getElementById('terminal-window')
        if (terminalWindowElement == null) return
        terminalWindowElement.scrollTo(0, terminalWindowElement.scrollHeight)
    }

    const onChangeEventHandler: DOMAttributes<HTMLInputElement>['onChange'] = (
        event
    ) => {
        updatePendingLineItem({ value: event.currentTarget.value })
    }

    const onTerminalClickHandler = (): void => {
        const inputElement = document.getElementById('user-input')
        if (inputElement == null) throw new Error('Input not found')
        inputElement.focus()
    }

    return (
        <WindowM
            windowId="Terminal"
            width={960}
            height={480}
            toolbarProps={{ title: '-msh' }}
        >
            <div
                id="terminal-window"
                onClick={onTerminalClickHandler}
                className="flex flex-grow rounded-2xl relative pt-8 pb-3 overflow-y-auto"
            >
                <div className="flex flex-col w-full pl-3 text-lg">
                    {lineItems}
                    <div className="relative mt-2">
                        <span className="absolute">
                            <span className="text-purple-700">{'> '}</span>
                            <span>
                                {pendingLineItem.value.slice(
                                    0,
                                    pendingLineItem.value.length - 1
                                )}
                            </span>
                            <span className="caret-block">
                                {pendingLineItem.value === ''
                                    ? '|'
                                    : pendingLineItem.value.at(-1)}
                            </span>
                        </span>
                        <input
                            type="text"
                            id="user-input"
                            name="user-input"
                            className="relative opacity-0 outline-none bg-transparent caret-violet-600"
                            value={pendingLineItem.value}
                            onKeyDown={onKeyDownEventHandler}
                            onChange={onChangeEventHandler}
                        />
                    </div>
                </div>
            </div>
        </WindowM>
    )
})

Terminal.displayName = 'Terminal'
