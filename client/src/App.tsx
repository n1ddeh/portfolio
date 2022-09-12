import { FC } from 'react'
import './index.css'
import { images } from './images'
import { Terminal } from './components/Terminal/Terminal'

export const App: FC = () => {
    return (
        <div className="flex flex-row justify-between w-full space-x-3">
            <img
                src={images.mark}
                className="object-cover rounded-2xl"
                style={{
                    width: 438,
                    height: 481,
                }}
            />
            <Terminal />
        </div>
    )
}
