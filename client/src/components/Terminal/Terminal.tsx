import { map, range } from 'lodash'
import { FC } from 'react'
import { TerminalToolbar } from './TerminalToolbar'

export const Terminal: FC = () => {
    return (
        <div
            className="flex flex-grow rounded-2xl relative pt-8 pb-3"
            style={{
                width: 920,
                height: 480,
                backgroundColor: '#E1E1E1',
                borderRadius: 20,
            }}
        >
            <TerminalToolbar />
        </div>
    )
}
