import React, { useEffect, useState } from 'react';

// The components

// The customized hooks
import { useHandleBindingClass } from '../../../../hooks/useHandleBindingClass';

// CSS
import styles from './Point.module.css';

export interface IPoint {
    value: string;
    position: {
        x: number;
        y: number;
    };
    tailwindCSS?: string;
}

const Point: React.FC<IPoint> = ({ value, position }) => {
    const cx = useHandleBindingClass(styles);

    // state
    const [seconds, setSeconds] = useState<number>(30.0);
    const [timeIntervalId, setTimeIntervalId] = useState<NodeJS.Timeout>();

    useEffect(() => {
        return () => {
            clearInterval(timeIntervalId);
        }; // Dọn dẹp interval khi component unmount
    }, []);

    useEffect(() => {
        if (seconds == 0) {
            clearInterval(timeIntervalId);

            // handle remove DOM
            return;
        }
    }, [seconds]);

    // functions
    const handleClickPoint = () => {
        if (seconds !== 0) {
            setTimeIntervalId(
                setInterval(() => {
                    setSeconds((prevSeconds) => parseFloat((prevSeconds - 1).toFixed(1)));
                }, 100),
            );
        }
    };

    return (
        <div
            className={cx(value, 'base_point')}
            style={{ top: `${position.y}%`, right: `${position.x}%` }}
            onClick={handleClickPoint}
        >
            <p className={cx('point__value')}>{value}</p>
            <p className={cx('point__time')}>{seconds !== 30 && `${seconds / 10}${(seconds / 10) % 1 !== 0 ? 's' : '.0s'}`}</p>
        </div>
    );
};

export default Point;
