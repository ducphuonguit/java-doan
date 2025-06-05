import {useEffect, useState} from 'react';

function useDebounce<T>(value: T, delay: number = 300, callback?: () => void): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cancel timeout if value or delay changes
        return () => {
            clearTimeout(handler);
            callback?.()
        };
    }, [value, delay, callback]);

    useEffect(() => {

    }, []);

    return debouncedValue;
}

export default useDebounce;
