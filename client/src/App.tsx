import { type FC } from 'react'
import './index.css'
import { Terminal } from './components/Terminal/Terminal'
import { TerminalProvider } from './contexts/TerminalContext/TerminalContext'
import { AnalyticsProvider } from './contexts/AnalyticsContext'

export const App: FC = () => {
    return (
        <AnalyticsProvider>
            <div className="flex flex-row justify-between w-full space-x-3">
                <TerminalProvider>
                    <Terminal />
                </TerminalProvider>
            </div>
        </AnalyticsProvider>
    )
}
