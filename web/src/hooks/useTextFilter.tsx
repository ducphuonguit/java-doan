import {Converters, useQueryState} from "@/hooks/useQueryState.ts";
import {useState} from "react";

export default function useTextFilter<T>(key: string, converters: Converters<T>) {
    const [paramValue, setParamValue] = useQueryState<T>(key, converters)
    const [value, setValue] = useState<T | undefined>(paramValue)

    const onChange = (value: T | undefined | null) => {
        if(!value){
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
