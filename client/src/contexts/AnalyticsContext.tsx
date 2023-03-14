import { type AnalyticsEvent } from '../data/types/AnalyticsEvent'
import {
    createContext,
    type FC,
    type PropsWithChildren,
    useContext,
    useMemo,
} from 'react'
import { getAnalytics, logEvent as firebaseLogEvent } from 'firebase/analytics'
import { isUndefined } from 'lodash'

interface AnalyticsContextProps {
    logEvent: (event: AnalyticsEvent, data?: object) => void
}

const AnalyticsContext = createContext<AnalyticsContextProps | undefined>(
    undefined
)

export const AnalyticsProvider: FC<PropsWithChildren> = ({ children }) => {
    const analytics = useMemo(() => getAnalytics(), [])

    const logEvent = (event: AnalyticsEvent, data: object = {}): void => {
        firebaseLogEvent(analytics, event, data)
    }

    return (
        <AnalyticsContext.Provider value={{ logEvent }}>
            {children}
        </AnalyticsContext.Provider>
    )
}

export const useAnalyticsContext = (): AnalyticsContextProps => {
    const context = useContext(AnalyticsContext)
    if (isUndefined(context))
        throw new Error(
            'useAnalyticsContext() must be used within an AnalyticsProvider'
        )
    return context
}
