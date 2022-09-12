import { map, range } from 'lodash'
import { FC } from 'react'

export const TerminalToolbar: FC = () => {
    return (
        <div
            className="w-full h-8 absolute top-0 rounded-t-2xl drop-shadow-md px-2 py-1"
            style={{ backgroundColor: '#696969' }}
        >
            <div className="relative w-full h-full flex justify-center items-center">
                <div className="absolute left-0 top-1">
                    <div className="flex items-center h-full space-x-2 flex-row">
                        {map(range(3), () => (
                            <div
                                className="rounded-full w-4 h-4"
                                style={{
                                    backgroundColor: '#D9D9D9',
                                }}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <p>-msh</p>
                </div>
            </div>
        </div>
    )
}
