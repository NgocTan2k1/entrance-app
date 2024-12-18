import React from 'react';

// The customized hooks
import { useHandleBindingClass } from '../../hooks/useHandleBindingClass';

// CSS
import styles from './BaseButton.module.css';

export interface IBaseButton {
    name: string;
    onClickFn: () => void;
    tailwindCSS?: string;
    responsiveTailwindCSS?: string;
}

const BaseButton: React.FC<IBaseButton> = ({ name, onClickFn, tailwindCSS = '', responsiveTailwindCSS = '' }) => {
    const cx = useHandleBindingClass(styles);
    return (
        <button className={cx('base_button', tailwindCSS, responsiveTailwindCSS)} onClick={onClickFn}>
            {name}
        </button>
    );
};

export default BaseButton;
