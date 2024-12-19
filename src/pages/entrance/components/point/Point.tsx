import React, { useCallback, useEffect, useState } from 'react';

// The components

// The customized hooks
import { useHandleBindingClass } from '../../../../hooks/useHandleBindingClass';

// CSS
import styles from './Point.module.css';

export interface IPoint {
    sizePoint: number;
    value: number;
    zIndex: number;
    position: {
        x: number;
        y: number;
    };
    tailwindCSS?: string;
    parent?: Element | null;
}

const Point: React.FC<IPoint> = ({ sizePoint, value, zIndex, position }) => {
    const cx = useHandleBindingClass(styles);

    // state
    const [seconds, setSeconds] = useState<number>(30.0);
    const [timeIntervalId, setTimeIntervalId] = useState<NodeJS.Timeout | undefined>(undefined);
    const [isActive, setIsActive] = useState<boolean>(false);

    useEffect(() => {
        console.log('===== Mouted Point.tsx =====');
        return () => {
            clearInterval(timeIntervalId);
            console.log('===== Unmouted Point.tsx component =====');
        };
    }, []);

    useEffect(() => {
        if (seconds == 0) {
            clearInterval(timeIntervalId);
            setTimeIntervalId(undefined);
            // const pointElement = document.querySelector('.' + cx(`point_${value}`));
            // if (pointElement) parent?.removeChild(pointElement);
            // return;
        }
    }, [seconds]);

    // functions
    const handleClickPoint = useCallback(() => {
        setIsActive(true);
        if (seconds !== 0) {
            setTimeIntervalId(
                setInterval(() => {
                    setSeconds((prevSeconds) => parseFloat((prevSeconds - 1).toFixed(1)));
                }, 100),
            );
        }
    }, []);

    return (
        <div
            className={cx(`base_point`, `point_${value}`, isActive && 'active', `w-[${sizePoint}px] h-[${sizePoint}px]`)}
            style={{ top: `${position.y}px`, left: `${position.x}px`, zIndex: zIndex }}
            onClick={handleClickPoint}
        >
            <p className={cx('point__value')}>{value}</p>
            {timeIntervalId && (
                <p className={cx('point__time')}>
                    {seconds !== 30 && `${seconds / 10}${(seconds / 10) % 1 !== 0 ? 's' : '.0s'}`}
                </p>
            )}
        </div>
    );
};

export default Point;
