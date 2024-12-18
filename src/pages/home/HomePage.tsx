import React, { useCallback, useEffect } from 'react';

// The customized hooks
import { useHandleBindingClass } from '../../hooks/useHandleBindingClass';
import { useHandleNavigation } from '../../hooks/useHandleNavigation';

// CSS
import styles from './HomePage.module.css';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IHomePage {}

const HomePage: React.FC<IHomePage> = () => {
    const cx = useHandleBindingClass(styles);
    const handleNavigation = useHandleNavigation();

    console.log(styles);

    useEffect(() => {
        console.log('===== Mouted HomePage.tsx =====');
        return () => {
            console.log('===== Unmouted HomePage.tsx component =====');
        };
    }, []);

    const handleRedirect = useCallback((path: string) => {
        handleNavigation('/' + path);
    }, []);

    return (
        <div className={cx('wrapper__home-page', 'w-full h-full')}>
            <div className={cx('text')}>
                <h1>Welcome</h1>
                <h2>
                    To start the game{' '}
                    <span className="color[#00a2e5]" onClick={() => handleRedirect('entrance')}>
                        Click here
                    </span>
                </h2>
            </div>
        </div>
    );
};
export default HomePage;
