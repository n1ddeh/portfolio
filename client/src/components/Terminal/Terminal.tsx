import {
    type FC,
    memo,
    type DOMAttributes,
    useMemo,
    useLayoutEffect,
    useRef,
    useCallback,
} from 'react'
import { WindowM } from '../Common/WindowM'
import {
    User,
    useTerminalContext,
} from '../../contexts/TerminalContext/TerminalContext'
import { map } from 'lodash'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import './Terminal.css'
import { TerminalCommand } from '../../data/types/TerminalCommand'

export const Terminal: FC = memo(() => {
    const {
        data,
        updatePendingLineItem,
        typePendingLineItem,
        addLineItem,
        pendingLineItem,
        isTyping,
        commandHistoryBack,
        commandHistoryForward,
        commandHistoryValue,
    } = useTerminalContext()

    const inputRef = useRef<HTMLTextAreaElement>(null)

    useLayoutEffect(() => {
        const onBoot = async (): Promise<void> => {
            await typePendingLineItem({ value: 'Welcome!' })
            await typePendingLineItem({ value: 'My name is Mark Minkoff' })
            await typePendingLineItem(
                {
                    value: 'I am a Full Stack Engineer currently building @ ManageXR',
                },
                {
                    finalItem: {
                        value: 'I am a Full Stack Engineer currently building @ [ManageXR](https://www.managexr.com/)',
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

    const setCursorEnd = useCallback(() => {
        const inputElement = inputRef.current

        if (inputElement === null) return

        inputElement.setSelectionRange(
            commandHistoryValue.length,
            commandHistoryValue.length
        )
    }, [commandHistoryValue.length])

    const onKeyDownEventHandler: DOMAttributes<HTMLTextAreaElement>['onKeyDown'] =
        (event) => {
            if (isTyping) return

            if (event.key === 'Enter') {
                addLineItem()
            } else if (event.key === 'ArrowUp') {
                commandHistoryBack()
                updatePendingLineItem({ value: commandHistoryValue })
                setTimeout(setCursorEnd, 0)
            } else if (event.key === 'ArrowDown') {
                commandHistoryForward()
                updatePendingLineItem({ value: commandHistoryValue })
                setTimeout(setCursorEnd, 0)
            }

            setTimeout(scrollToBottomOfTerminal, 0)
        }

    const scrollToBottomOfTerminal = (): void => {
        const terminalWindowElement = document.getElementById('terminal-window')
        if (terminalWindowElement == null) return
        terminalWindowElement.scrollTo(0, terminalWindowElement.scrollHeight)
    }

    const onChangeEventHandler: DOMAttributes<HTMLTextAreaElement>['onChange'] =
        (event) => {
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

    const commandColor = isTyping
        ? ''
        : isPendingLineItemValidCommand
        ? '#128022'
        : '#801212'

    return (
        <WindowM
            windowId="Terminal"
            className="py-2 h-96  md:h-auto md:!w-160 md:aspect-video"
            toolbarProps={{ title: '-msh' }}
        >
            <div
                id="terminal-window"
                onClick={onTerminalClickHandler}
                className="flex flex-grow rounded-2xl relative pt-8 pb-3 overflow-y-auto"
            >
                <div className="flex flex-col w-full pl-3 text-sm md:text-md">
                    {lineItems}
                    <div className=" relative mt-2">
                        <span className="absolute">
                            <span className="text-purple-700">{'> '}</span>
                            <span style={{ color: commandColor }}>
                                {pendingLineItem.value.slice(
                                    0,
                                    pendingLineItem.value.length - 1
                                )}
                            </span>
                            <div
                                style={{ color: commandColor, width: '1ch' }}
                                className={`caret-block inline`}
                            >
                                {pendingLineItem.value === ''
                                    ? ''
                                    : pendingLineItem.value.at(-1)}
                            </div>
                        </span>
                        <textarea
                            id="user-input"
                            name="user-input"
                            ref={inputRef}
                            className="relative opacity-0 outline-none bg-transparent caret-violet-600"
                            value={pendingLineItem.value}
                            onKeyDown={onKeyDownEventHandler}
                            onChange={onChangeEventHandler}
                            disabled={isTyping}
                        />
                    </div>
                </div>
            </div>
        </WindowM>
    )
})

Terminal.displayName = 'Terminal'
