import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// customized components
import GlobalStyles from './global/GlobalStyles';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <GlobalStyles>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </GlobalStyles>
    </React.StrictMode>,
);
