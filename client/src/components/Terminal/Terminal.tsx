import { type FC, memo } from 'react'
import { WindowM } from '../Common/WindowM'

export const Terminal: FC = memo(() => {
    return (
        <WindowM
            windowId="Terminal"
            width={960}
            height={480}
            toolbarProps={{ title: '-msh' }}
        >
            <div className="flex flex-grow rounded-2xl relative pt-8 pb-3"></div>
        </WindowM>
    )
})

Terminal.displayName = 'Terminal'
