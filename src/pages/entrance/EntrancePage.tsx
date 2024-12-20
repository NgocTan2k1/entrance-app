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
import useEntranceStore from '../../stores/useEntranceStores';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IEntrancePage {}

const EntrancePage: React.FC<IEntrancePage> = () => {
    const cx = useHandleBindingClass(styles);

    // stores
    const isDone = useEntranceStore((state) => state.isDone);
    const setIsDone = useEntranceStore((state) => state.setIsDone);
    const isFail = useEntranceStore((state) => state.isFail);
    const setIsFail = useEntranceStore((state) => state.setIsFail);
    const setAutoPlayTrigger = useEntranceStore((state) => state.setAutoPlayTrigger);

    // const
    const sizePoint = 48;

    // states
    const [title, setTitle] = useState<string>("LET'S PLAY");
    const [startText, setStartText] = useState<string>('Play');
    const [isAuto, setIsAuto] = useState<boolean>(false);
    const [seconds, setSeconds] = useState<number>(0.0);
    const currentPoint = useRef<number>(0);
    const [isPoint, setIsPoint] = useState<boolean>(false);
    const [errorInput, setErrorInput] = useState<string>('');
    const points = useRef<TPoint[] | []>([]);
    const point = useRef<HTMLInputElement | null>(null);
    const intervalAuto = useRef<NodeJS.Timeout>(null);
    const intervalTime = useRef<NodeJS.Timeout>(null);
    const timeoutDone = useRef<NodeJS.Timeout>(null);
    const gameArea = useRef<Element | null>(null);
    const gameAreaWidth = useRef<number>(0);
    const gameAreaHeight = useRef<number>(0);

    useEffect(() => {
        // console.log('===== Mouted EntrancePage.tsx =====');
        const gameAreaElement = document.querySelector('.' + cx('gaming-area'));
        gameArea.current = gameAreaElement;
        gameAreaWidth.current = gameAreaElement?.clientWidth || 0;
        gameAreaHeight.current = gameAreaElement?.clientHeight || 0;

        return () => {
            // console.log('===== Unmouted EntrancePage.tsx component =====');
            if (timeoutDone.current) clearTimeout(timeoutDone.current);
            if (intervalTime.current) clearInterval(intervalTime.current);
            if (intervalAuto.current) clearTimeout(intervalAuto.current);
        };
    }, []);

    useEffect(() => {
        // when Play => reset Times = 0
        if (startText === 'Restart') {
            intervalTime.current = setInterval(() => {
                setSeconds((prevSeconds) => parseFloat((prevSeconds + 1).toFixed(1)));
            }, 100);
        }

        // when Play => set Times = 0
        if (startText === 'Play') {
            setSeconds(parseFloat((0).toFixed(1)));
        }

        // stop Time when "all cleared" or "game over"
        if ((isDone || isFail) && intervalTime.current) {
            clearInterval(intervalTime.current);
        }

        // auto play done
        if (isDone && intervalAuto.current) {
            clearInterval(intervalAuto.current);
        }

        return () => {
            if (intervalTime.current) clearInterval(intervalTime.current);
            if (intervalAuto.current) clearInterval(intervalAuto.current);
        };
    }, [startText, isDone, isFail]);

    useEffect(() => {
        if (isAuto) {
            intervalAuto.current = setInterval(() => {
                if (currentPoint.current + 1 <= points.current.length) {
                    setAutoPlayTrigger(points.current[currentPoint.current].value);
                }
            }, 2000);
        } else {
            if (intervalAuto.current) clearInterval(intervalAuto.current);
        }
    }, [isAuto]);

    // functions
    /**
     * The validation input function
     * @returns boolean
     */
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
     * The function handle start or restart game
     */
    const handleResetGame = useCallback(() => {
        if (startText === 'Play') {
            handlePlayGame();
            return;
        }
        handleRestartGame();
    }, [startText]);

    const handlePlayGame = useCallback(() => {
        if (!handlePointValidation()) return;
        setIsPoint(false);
        setSeconds(parseFloat((0).toFixed(1)));
        setIsFail(false);
        setIsDone(false);
        points.current = handleCreatePoint(point.current?.value);
        currentPoint.current = 0;
        setStartText('Restart');
        setIsAuto(false);
        return;
    }, [startText]);

    const handleRestartGame = useCallback(() => {
        if (!handlePointValidation()) return;
        setTitle("LET'S PLAY");
        setIsPoint(false);
        setSeconds(parseFloat((0).toFixed(1)));
        setIsFail(false);
        setIsDone(false);
        points.current = handleCreatePoint(point.current?.value);
        currentPoint.current = 0;
        if (intervalAuto.current) clearInterval(intervalAuto.current);
        if (timeoutDone.current) clearTimeout(timeoutDone.current);
        setIsAuto(false);
        return;
    }, [startText]);

    /**
     * The function handle auto play game
     */
    const handleAutoPlay = useCallback(() => {
        if (isAuto === true) {
            setIsAuto(false);
            return;
        }
        // handle auto play
        setIsAuto(true);
    }, [isAuto]);

    /**
     * The function create point array
     */
    const handleCreatePoint = useCallback(
        (amountOfPoints: string | undefined) => {
            if (!amountOfPoints || parseInt(amountOfPoints) > 5000) {
                return [];
            }

            const length = parseInt(amountOfPoints);
            const pointArray: TPoint[] = [];
            for (let i = 1; i <= length; i++) {
                pointArray.push({
                    value: Math.random(),
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

    const handleClickPoint = useCallback(
        (point: number) => {
            if (currentPoint.current + 1 < point) {
                setIsFail(true);
                setTitle('GAME OVER');
                return;
            }

            if (currentPoint.current + 1 === points.current.length) {
                timeoutDone.current = setTimeout(() => {
                    if (intervalTime.current) clearInterval(intervalTime.current);

                    setIsDone(true);
                    setTitle('ALL CLEARED');
                }, 3000);
                return;
            }

            currentPoint.current++;
        },
        [currentPoint.current],
    );

    return (
        <div className={cx('wrapper__entrance-page', 'd-flex items-center w-full h-full', '')}>
            <div className={cx('game-menu')}>
                <div className={cx('menu__item', isDone && 'text-green-600', isFail && 'text-red-500')}>
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
                        <BaseButton name={'Auto Play ' + `${!isAuto ? 'ON' : 'OFF'}`} onClickFn={handleAutoPlay}></BaseButton>
                    )}
                </div>
            </div>
            <div className={cx('gaming-area', '')}>
                {points &&
                    points.current?.map((point, index) => (
                        <Point
                            key={point.value}
                            parent={gameArea.current}
                            index={index + 1}
                            value={point.value}
                            position={point.position}
                            zIndex={point.zIndex}
                            sizePoint={sizePoint}
                            onClickPoint={handleClickPoint}
                        />
                    ))}
            </div>
        </div>
    );
};

export default EntrancePage;
