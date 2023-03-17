import { map, range } from 'lodash'
import { forwardRef } from 'react'

export interface ToolbarProps {
    title?: string
}

export type Ref = HTMLDivElement

export const Toolbar = forwardRef<Ref, ToolbarProps>(({ title }, ref) => {
    return (
        <div
            style={{
                background: 'rgba(82, 147, 202, 0.12)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(5px)',
            }}
            className="z-10 w-full h-8 absolute top-0 rounded-t-2xl drop-shadow-md px-2 py-1 before:content-[''] before:bg-toolbar before:absolute before:w-full before:h-full before:inset-0 before:rounded-t-2xl before:opacity-60"
            ref={ref}
        >
            <div className="relative w-full h-full flex justify-center items-center">
                <div className="absolute left-0 top-1">
                    <div className="flex items-center h-full space-x-2 flex-row">
                        {map(range(3), (i) => (
                            <div
                                key={`toolbarAction-${i}`}
                                className="rounded-full w-4 h-4"
                                style={{
                                    backgroundColor: '#D9D9D9',
                                }}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <p className="font-terminal pointer-events-none select-none">
                        {title !== undefined ? title : '-msh'}
                    </p>
                </div>
            </div>
        </div>
    )
})

Toolbar.displayName = 'Toolbar'
