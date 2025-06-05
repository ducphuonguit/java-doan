import useQueryState, {Converters} from "@/hooks/useQueryState.ts";
import {useState} from "react";

export default function useSelectFilter<T>(key: string, converter: Converters<T>) {
    const [paramValue, setParamValue] = useQueryState<T>(key, converter)
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
