import { type FC } from 'react'
import { MarkImage } from '../../images'
import { WindowM } from '../Common/WindowM'

export const Portrait: FC = () => {
    return (
        <WindowM windowId="Portrait" width={300} height={481}>
            <img
                src={MarkImage}
                draggable="false"
                className="object-cover rounded-2xl select-none"
                alt="mark"
                style={{
                    width: 438,
                    height: 'auto',
                }}
            />
        </WindowM>
    )
}
