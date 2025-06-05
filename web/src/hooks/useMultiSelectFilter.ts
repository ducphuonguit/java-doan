import {Converters} from "@/hooks/useQueryState.ts";
import {useState} from "react";
import useQueryListState from "@/hooks/useQueryListState.tsx";


export default function useMultiSelectFilter<T>(key: string, converters: Converters<T>) {
    const [paramValue, setParamValue] = useQueryListState<T>(key, converters)

    const [value, setValue] = useState<T[] | undefined>(paramValue)

    const onChange = (value: T[] | undefined | null) => {
        if (!value) {
            setValue(undefined)
            return;
        }
        setValue(value)
    }

    const onApply = () => {
        setParamValue(value)
    }

    const onClear = () => {
        setValue(undefined)
        setParamValue(undefined)
    }

    return {
        value,
        paramValue,
        onChange,
        onApply,
        onClear
    }
}