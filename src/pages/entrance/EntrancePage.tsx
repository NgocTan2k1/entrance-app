import React, { useCallback, useEffect, useRef, useState } from 'react';

// The components
import Point from './components/point/Point';

// The customized hooks
import { useHandleBindingClass } from '../../hooks/useHandleBindingClass';

// CSS
import styles from './EntrancePage.module.css';
import BaseButton from '../../components/button/BaseButton';

// The helpers
import { isNumber } from '../../utils/helpers';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IEntrancePage {}

const EntrancePage: React.FC<IEntrancePage> = () => {
    const cx = useHandleBindingClass(styles);

    // states
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [title, setTitle] = useState<string>("LET'S PLAY");
    const [startText, setStartText] = useState<string>('Play');
    const [autoText, setAutoText] = useState<string>('ON');
    const [seconds, setSeconds] = useState<number>(0.0);
    const point = useRef<HTMLInputElement | null>(null);
    const [isPoint, setIsPoint] = useState<boolean>(false);

    useEffect(() => {
        console.log('===== Mouted EntrancePage.tsx =====');
        return () => {
            console.log('===== Unmouted EntrancePage.tsx component =====');
        };
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (startText === 'Restart') {
            interval = setInterval(() => {
                setSeconds((prevSeconds) => parseFloat((prevSeconds + 1).toFixed(1)));
            }, 100);
        }
        if (startText === 'Play') {
            setSeconds(parseFloat((0).toFixed(1)));
        }

        return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
    }, [startText]);

    // functions
    /**
     * function handle restart game
     */
    const handleResetGame = useCallback(() => {
        if ((point.current?.value && !isNumber(point.current?.value)) || !point.current?.value) {
            setIsPoint(true);
            return;
        }
        setIsPoint(false);

        if (startText === 'Play') {
            setStartText('Restart');
            return;
        }
        setStartText('Play');
        setAutoText('ON');
    }, [startText]);

    /**
     * function handle auto play game
     */
    const handleAutoPlay = useCallback(() => {
        if (autoText === 'ON') {
            setAutoText('OFF');
            return;
        }

        setAutoText('ON');
    }, [autoText]);

    return (
        <div className={cx('wrapper__entrance-page', 'd-flex items-center w-full h-full', '')}>
            <div className={cx('game-menu')}>
                <div className={cx('menu__item', '')}>
                    <h2>{title}</h2>
                </div>
                <div className={cx('menu__item', '')}>
                    <label htmlFor="point">Points:</label>
                    <input className={cx(isPoint && 'input-error')} id="point" ref={point} />
                    {isPoint && <p className={cx('error', 'text-red-600')}>Please input a number</p>}
                </div>
                <div className={cx('menu__item', '')}>
                    <label htmlFor="point">Times:</label>
                    <p>
                        {seconds / 10}
                        {(seconds / 10) % 1 !== 0 ? 's' : '.0s'}
                    </p>
                </div>
                <div className={cx('menu__item', '')}>
                    <BaseButton name={startText} onClickFn={handleResetGame}></BaseButton>
                    {startText === 'Restart' && title !== 'GAME OVER' && (
                        <BaseButton name={'Auto Play ' + autoText} onClickFn={handleAutoPlay}></BaseButton>
                    )}
                </div>
            </div>
            <div className={cx('gaming-area', '')}>
                <Point value="1" position={{ x: 50, y: 40 }} />
            </div>
        </div>
    );
};

export default EntrancePage;
