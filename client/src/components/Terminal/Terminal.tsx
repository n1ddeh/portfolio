import { type FC, memo, type DOMAttributes } from 'react'
import { WindowM } from '../Common/WindowM'
import { useTerminalContext } from '../../contexts/TerminalContext'
import { map } from 'lodash'
import './Terminal.css'

export const Terminal: FC = memo(() => {
    const { data, updatePendingLineItem, addLineItem, pendingLineItem } =
        useTerminalContext()

    const lineItems = map(data, (lineItem) => {
        return <div key={lineItem.id}>{lineItem.value}</div>
    })

    const onKeyDownEventHandler: DOMAttributes<HTMLInputElement>['onKeyDown'] =
        (event) => {
            if (event.key === 'Enter') {
                addLineItem()
            }
        }

    const onChangeEventHandler: DOMAttributes<HTMLInputElement>['onChange'] = (
        event
    ) => {
        updatePendingLineItem({ value: event.currentTarget.value })
    }

    return (
        <WindowM
            windowId="Terminal"
            width={960}
            height={480}
            toolbarProps={{ title: '-msh' }}
        >
            <div className="flex flex-grow rounded-2xl relative pt-8 pb-3 overflow-y-auto">
                <div className="flex flex-col w-full space-y-1 pl-3 text-lg">
                    {lineItems}
                    <div className="relative">
                        <span className="absolute">
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
