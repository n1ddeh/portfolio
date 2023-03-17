import {
    type FC,
    memo,
    useRef,
    type PropsWithChildren,
    useLayoutEffect,
    useMemo,
} from 'react'
import { Toolbar, type ToolbarProps } from './Toolbar'
import { useWindowContext } from '../../contexts/WindowContext'

export type WindowMProps = PropsWithChildren<{
    windowId: string
    toolbarProps?: ToolbarProps
    className?: string
    title?: string
}>

export const WindowM: FC<WindowMProps> = memo(
    ({ windowId, children, toolbarProps, className = '' }) => {
        const windowContentRef = useRef<HTMLDivElement>(null)
        const toolbarRef = useRef<HTMLDivElement>(null)

        const { addWindow, removeWindow, bringWindowForward } =
            useWindowContext()

        const windowRef = useMemo(() => {
            return {
                id: windowId,
                ref: windowContentRef,
            }
        }, [windowId])

        useLayoutEffect(() => {
            addWindow(windowRef)

            return () => {
                removeWindow(windowId)
            }
        }, [addWindow, removeWindow, windowId, windowRef])

        return (
            <div
                ref={windowContentRef}
                id={windowId}
                className={`flex relative z-0 rounded-2xl ${className}`}
                style={{
                    background: 'rgba(191, 191, 191, 0.90)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(1px)',
                }}
                onClick={() => {
                    bringWindowForward(windowRef)
                }}
            >
                <Toolbar ref={toolbarRef} {...toolbarProps} />
                {children}
            </div>
        )
    }
)

WindowM.displayName = 'WindowM'
