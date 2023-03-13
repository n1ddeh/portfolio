import {
    type FC,
    memo,
    type DOMAttributes,
    useState,
    useEffect,
    useMemo,
    useLayoutEffect,
} from 'react'
import { WindowM } from '../Common/WindowM'
import {
    TerminalCommand,
    User,
    useTerminalContext,
} from '../../contexts/TerminalContext'
import { map } from 'lodash'
import './Terminal.css'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'

export const Terminal: FC = memo(() => {
    const {
        data,
        updatePendingLineItem,
        typePendingLineItem,
        addLineItem,
        pendingLineItem,
        isTyping,
    } = useTerminalContext()

    const [shouldScrollOnNextTick, setShouldScrollOnNextTick] =
        useState<boolean>(false)

    useEffect(() => {
        if (shouldScrollOnNextTick) {
            scrollToBottomOfTerminal()
            setShouldScrollOnNextTick(false)
        }
    }, [shouldScrollOnNextTick])

    useLayoutEffect(() => {
        const onBoot = async (): Promise<void> => {
            await typePendingLineItem({ value: 'Welcome!' })
            await typePendingLineItem({ value: 'My name is Mark Minkoff' })
            await typePendingLineItem(
                {
                    value: 'I am a Full Stack Enginner currently building @ ManageXR',
                },
                {
                    finalItem: {
                        value: 'I am a Full Stack Enginner currently building @ [ManageXR](https://www.managexr.com/)',
                    },
                }
            )
            await typePendingLineItem(
                {
                    value: 'Connect with me on LinkedIn, Github, or contact me at markminkoff00 at gmail',
                },
                {
                    finalItem: {
                        value: 'Connect with me on [LinkedIn](https://www.linkedin.com/in/markminkoff/), [Github](https://github.com/n1ddeh), or contact me at markminkoff00 at gmail',
                    },
                }
            )
            await typePendingLineItem(
                { value: 'type help for more commands' },
                { finalItem: { value: 'type **help** for more commands' } }
            )
        }

        void onBoot()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const lineItems = map(data, (lineItem) => {
        return (
            <div key={lineItem.id} className="leading-tight block">
                {lineItem.user === User.USER ? (
                    <span className="text-green-700 inline-block mr-2">
                        {'>'}
                    </span>
                ) : undefined}
                <ReactMarkdown className="inline-block" linkTarget="_blank">
                    {lineItem.value}
                </ReactMarkdown>
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

    const isPendingLineItemValidCommand = useMemo(() => {
        for (const command of Object.values(TerminalCommand)) {
            if (command === pendingLineItem.value) return true
        }
        return false
    }, [pendingLineItem.value])

    const validCommandClass = isTyping
        ? ''
        : isPendingLineItemValidCommand
        ? 'text-green-600'
        : 'text-red-600'

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
                            <span className={validCommandClass}>
                                {pendingLineItem.value.slice(
                                    0,
                                    pendingLineItem.value.length - 1
                                )}
                            </span>
                            <span
                                className={`${validCommandClass} caret-block`}
                            >
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
