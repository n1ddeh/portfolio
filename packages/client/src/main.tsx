import { type FC } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { AppContainer } from './components/AppContainer'
import { WindowProvider } from './contexts/WindowContext'
import './firebase-config'

const Root: FC = () => {
    return (
        <WindowProvider>
            <AppContainer>
                <App />
            </AppContainer>
        </WindowProvider>
    )
}

const rootElement = document.getElementById('root')
if (rootElement === null) throw new Error('Failed to find the root element')

createRoot(rootElement).render(<Root />)
