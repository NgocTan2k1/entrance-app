import React from 'react';
import './GlobalStyles.css';

export interface IGlobalStyles {
    children: React.ReactNode;
}

const GlobalStyles: React.FC<IGlobalStyles> = ({ children }) => {
    return <>{children}</>;
};

export default GlobalStyles;
