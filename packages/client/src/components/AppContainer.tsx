import { type FC, type PropsWithChildren } from 'react'

type AppContainerProps = PropsWithChildren
export const AppContainer: FC<AppContainerProps> = ({ children }) => {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="max-w-7xl py-4 px-2 md:px-12 md:py-4 flex items-center justify-center">
                {children}
            </div>
        </div>
    )
}
