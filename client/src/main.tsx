import { StrictMode, type FC } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { AppContainer } from './components/AppContainer'
// eslint-disable-next-line import/no-unresolved
import 'virtual:fonts.css'
import { WindowProvider } from './contexts/WindowContext'

const Root: FC = () => {
    return (
        <StrictMode>
            <WindowProvider>
                <AppContainer>
                    <App />
                </AppContainer>
            </WindowProvider>
        </StrictMode>
    )
}

const rootElement = document.getElementById('root')
if (rootElement === null) throw new Error('Failed to find the root element')

createRoot(rootElement).render(<Root />)
