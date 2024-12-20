import React, { useCallback, useEffect, useState } from 'react';

// The customized hooks
import { useHandleBindingClass } from '../../../../hooks/useHandleBindingClass';

// CSS
import styles from './Point.module.css';
import useEntranceStore from '../../../../stores/useEntranceStores';

export interface IPoint {
    sizePoint: number;
    value: number;
    index: number;
    zIndex: number;
    position: {
        x: number;
        y: number;
    };
    tailwindCSS?: string;
    parent?: Element | null;
    onClickPoint: (point: number) => void;
}

const Point: React.FC<IPoint> = ({ sizePoint, value, index, zIndex, position, onClickPoint }) => {
    const cx = useHandleBindingClass(styles);

    // stores
    const isFail = useEntranceStore((state) => state.isFail);
    const autoPlayTrigger = useEntranceStore((state) => state.autoPlayTrigger);

    // state
    const [seconds, setSeconds] = useState<number>(30.0);
    const [timeIntervalId, setTimeIntervalId] = useState<NodeJS.Timeout | undefined>(undefined);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [opacity, setOpacity] = useState<number>(1);

    useEffect(() => {
        // console.log('===== Mouted Point.tsx =====');
        return () => {
            clearInterval(timeIntervalId);
            // console.log('===== Unmouted Point.tsx component =====');
        };
    }, []);

    useEffect(() => {
        if (autoPlayTrigger === value) {
            handleClickPoint();
        }
    }, [autoPlayTrigger]);

    useEffect(() => {
        if (seconds == 0 || isFail) {
            clearInterval(timeIntervalId);
            const pointElement = document.querySelector('.' + cx(`point_${index}`)) as HTMLElement;
            if (pointElement) pointElement.style.zIndex = '0';
            setTimeIntervalId(undefined);
        }
    }, [seconds, isFail]);

    // functions
    const handleClickPoint = useCallback(() => {
        if (!isFail) {
            setIsActive(true);
            if (seconds !== 0) {
                setTimeIntervalId(
                    setInterval(() => {
                        setSeconds((prevSeconds) => parseFloat((prevSeconds - 1).toFixed(1)));
                        setOpacity((prev) => prev - 0.03);
                    }, 100),
                );
            }
            onClickPoint(index);
        }
    }, [isFail]);

    return (
        <div
            className={cx(`base_point`, `point_${index}`, isActive && 'active', `w-[${sizePoint}px] h-[${sizePoint}px]`)}
            style={{
                top: `${position.y}px`,
                left: `${position.x}px`,
                zIndex: zIndex,
                opacity: opacity,
                backgroundColor: isActive ? `rgb(250, 128, 114, ${opacity})` : '',
                borderColor: `rgb(250, 128, 114, ${opacity})`,
            }}
            onClick={handleClickPoint}
        >
            <p className={cx('point__index')}>{index}</p>
            {(timeIntervalId || isFail) && (
                <p className={cx('point__time')}>{isActive && `${seconds / 10}${(seconds / 10) % 1 !== 0 ? 's' : '.0s'}`}</p>
            )}
        </div>
    );
};

export default Point;
