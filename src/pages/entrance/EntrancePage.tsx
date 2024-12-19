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
import { TPoint } from '../../types/Point';

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
    const [points, setPoints] = useState<TPoint[] | []>();
    const point = useRef<HTMLInputElement | null>(null);
    const [isPoint, setIsPoint] = useState<boolean>(false);
    const [errorInput, setErrorInput] = useState<string>('');
    const gameAreaWidth = useRef<number>(0);
    const gameAreaHeight = useRef<number>(0);
    const gameArea = useRef<Element | null>(null);
    const sizePoint = 48;

    useEffect(() => {
        console.log('===== Mouted EntrancePage.tsx =====');
        const gameAreaElement = document.querySelector('.' + cx('gaming-area'));
        gameArea.current = gameAreaElement;
        gameAreaWidth.current = gameAreaElement?.clientWidth || 0;
        gameAreaHeight.current = gameAreaElement?.clientHeight || 0;

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

    const handlePointValidation = () => {
        if ((point.current?.value && !isNumber(point.current?.value)) || !point.current?.value) {
            setIsPoint(true);
            setErrorInput('Please enter a number');
            return false;
        }
        if (point.current?.value && isNumber(point.current?.value) && parseInt(point.current?.value) > 5000) {
            setIsPoint(true);
            setErrorInput('Please enter a number less than 5000');
            return false;
        }
        return true;
    };

    /**
     * function handle start or restart game
     */
    const handleResetGame = useCallback(() => {
        if (startText === 'Play') {
            if (!handlePointValidation()) return;
            setIsPoint(false);
            setPoints(() => [...handleCreatePoint(point.current?.value)]);
            setStartText('Restart');
            return;
        }
        if (gameArea.current) gameArea.current.innerHTML = '';

        setPoints([]);
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

    const handleCreatePoint = useCallback(
        (amountOfPoints: string | undefined) => {
            if (!amountOfPoints || parseInt(amountOfPoints) > 5000) {
                return [];
            }

            const length = parseInt(amountOfPoints);
            const pointArray: TPoint[] = [];
            for (let i = 1; i <= length; i++) {
                pointArray.push({
                    value: i,
                    position: {
                        x: Math.random() * (gameAreaWidth.current - sizePoint),
                        y: Math.random() * (gameAreaHeight.current - sizePoint),
                    },
                    zIndex: length - i,
                });
            }
            return pointArray || [];
        },
        [point.current?.value],
    );

    return (
        <div className={cx('wrapper__entrance-page', 'd-flex items-center w-full h-full', '')}>
            <div className={cx('game-menu')}>
                <div className={cx('menu__item', '')}>
                    <h2>{title}</h2>
                </div>
                <div className={cx('menu__item', '')}>
                    <label htmlFor="point">Points:</label>
                    <input className={cx(isPoint && 'input-error')} id="point" ref={point} />
                    {isPoint && <p className={cx('error', 'text-red-600')}>{errorInput}</p>}
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
                {points?.map((point) => (
                    <Point
                        key={point.value}
                        parent={gameArea.current}
                        value={point.value}
                        position={point.position}
                        zIndex={point.zIndex}
                        sizePoint={sizePoint}
                    />
                ))}
            </div>
        </div>
    );
};

export default EntrancePage;
