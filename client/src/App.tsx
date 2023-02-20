import { type FC } from 'react'
import './index.css'
import { Terminal } from './components/Terminal/Terminal'
import { Portrait } from './components/Portrait/Portrait'

export const App: FC = () => {
    return (
        <div className="flex flex-row justify-between w-full space-x-3">
            <Portrait />
            <Terminal />
        </div>
    )
}
