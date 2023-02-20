import {
    type FC,
    memo,
    useRef,
    type PropsWithChildren,
    useLayoutEffect,
    useMemo,
    useState,
} from 'react'
import { Toolbar, type ToolbarProps } from './Toolbar'
import Draggable, { type DraggableProps } from 'react-draggable'
import { useWindowContext } from '../../contexts/WindowContext'

export type WindowMProps = PropsWithChildren<{
    windowId: string
    toolbarProps?: ToolbarProps
    width?: number
    height?: number
    title?: string
}>

export const WindowM: FC<WindowMProps> = memo(
    ({ windowId, children, toolbarProps, width, height }) => {
        const windowContentRef = useRef<HTMLDivElement>(null)
        const toolbarRef = useRef<HTMLDivElement>(null)
        const [mouseOverToolbar, setMouseOverToolbar] = useState<boolean>(false)

        const { addWindow, removeWindow, bringWindowForward } =
            useWindowContext()

        const windowRef = useMemo(() => {
            return {
                id: windowId,
                ref: windowContentRef,
            }
        }, [windowId])

        const draggableProps: Partial<DraggableProps> = {
            onStart: () => {
                bringWindowForward(windowRef)

                if (!mouseOverToolbar) {
                    return false
                }
            },
            onStop: () => {
                bringWindowForward(windowRef)
            },
        }

        useLayoutEffect(() => {
            addWindow(windowRef)

            return () => {
                removeWindow(windowId)
            }
        }, [addWindow, removeWindow, windowId, windowRef])

        return (
            <Draggable nodeRef={windowContentRef} {...draggableProps}>
                <div
                    ref={windowContentRef}
                    id={windowId}
                    className="flex relative w-full h-full z-0 rounded-2xl"
                    onClick={() => {
                        bringWindowForward(windowRef)
                    }}
                    style={{
                        width,
                        height,
                        backgroundColor: '#E1E1E1',
                    }}
                >
                    <Toolbar
                        onMouseEnter={() => {
                            setMouseOverToolbar(true)
                        }}
                        onMouseLeave={() => {
                            setMouseOverToolbar(false)
                        }}
                        ref={toolbarRef}
                        {...toolbarProps}
                    />
                    {children}
                </div>
            </Draggable>
        )
    }
)

WindowM.displayName = 'WindowM'
