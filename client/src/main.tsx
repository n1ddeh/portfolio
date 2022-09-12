import { StrictMode, FC } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { AppContainer } from './components/AppContainer'

const Root: FC = () => {
    return (
        <StrictMode>
            <AppContainer>
                <App />
            </AppContainer>
        </StrictMode>
    )
}

const rootElement = document.getElementById('root')
if (rootElement === null) throw new Error('Failed to find the root element')

createRoot(rootElement).render(<Root />)
