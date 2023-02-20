import { type FC, type PropsWithChildren } from 'react'

type AppContainerProps = PropsWithChildren
export const AppContainer: FC<AppContainerProps> = ({ children }) => {
    return (
        <div className="w-full h-full flex justify-center">
            <div className="min-h-screen max-w-7xl w-full px-12 py-4 flex items-center justify-center">
                <div className="">{children}</div>
            </div>
        </div>
    )
}
