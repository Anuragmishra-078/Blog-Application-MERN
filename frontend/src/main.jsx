import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from "@/components/ui/sonner"
import { Provider } from 'react-redux'
import store, { persistor } from './redux/Store'
import { PersistGate } from 'redux-persist/integration/react'
import ThemeProvider from './components/ThemeProvider'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </PersistGate>
        </Provider>

        <Toaster />
    </StrictMode>,
)