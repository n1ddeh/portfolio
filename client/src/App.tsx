import { type FC } from 'react'
import './index.css'
import { Terminal } from './components/Terminal/Terminal'
import { Portrait } from './components/Portrait/Portrait'
import { TerminalProvider } from './contexts/TerminalContext'

export const App: FC = () => {
    return (
        <div className="flex flex-row justify-between w-full space-x-3">
            <Portrait />
            <TerminalProvider>
                <Terminal />
            </TerminalProvider>
        </div>
    )
}
