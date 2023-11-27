import { isUndefined, filter } from 'lodash'
import {
    createContext,
    type RefObject,
    type FC,
    type PropsWithChildren,
    useContext,
    useState,
    useCallback,
} from 'react'

interface WindowRef {
    id: string
    ref: RefObject<HTMLDivElement>
}

interface WindowContextProps {
    addWindow: (windowRef: WindowRef) => void
    removeWindow: (windowId: string) => void
    bringWindowForward: (windowRef: WindowRef) => void
}

const WindowContext = createContext<WindowContextProps | undefined>(undefined)

export const WindowProvider: FC<PropsWithChildren> = ({ children }) => {
    const [, setWindowRefs] = useState<WindowRef[]>([])

    const setZIndex = useCallback(() => {
        setWindowRefs((currentWindowRefs: WindowRef[]) => {
            for (let i = 0; i < currentWindowRefs.length; i++) {
                const cRef = currentWindowRefs[i].ref.current

                if (cRef == null) {
                    continue
                }

                cRef.style.zIndex = `${-(i + 1) + currentWindowRefs.length}`
            }

            return [...currentWindowRefs]
        })
    }, [setWindowRefs])

    const addWindow = useCallback(
        (windowRef: WindowRef): void => {
            setWindowRefs((currentWindowRefs) => {
                return [windowRef, ...currentWindowRefs]
            })
            setZIndex()
        },
        [setZIndex]
    )

    const removeWindow = useCallback(
        (windowId: string): void => {
            setWindowRefs((currentWindowRefs) => {
                return filter(
                    currentWindowRefs,
                    (wr: WindowRef) => wr.id !== windowId
                )
            })
            setZIndex()
        },
        [setZIndex]
    )

    const bringWindowForward = useCallback(
        (windowRef: WindowRef): void => {
            setWindowRefs((currentWindowRefs) => {
                return [
                    windowRef,
                    ...filter(
                        currentWindowRefs,
                        (wr: WindowRef) => wr.id !== windowRef.id
                    ),
                ]
            })
            setZIndex()
        },
        [setZIndex]
    )

    return (
        <WindowContext.Provider
            value={{ addWindow, removeWindow, bringWindowForward }}
        >
            {children}
        </WindowContext.Provider>
    )
}

export const useWindowContext = (): WindowContextProps => {
    const context = useContext(WindowContext)
    if (isUndefined(context))
        throw new Error(
            'useWindowContext() must be used within an WindowProvider'
        )
    return context
}
