import { type FC } from 'react'
import { images } from '../../images'
import { WindowM } from '../Common/WindowM'

export const Portrait: FC = () => {
    return (
        <WindowM windowId="Portrait" width={300} height={481}>
            <img
                src={images.mark}
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
