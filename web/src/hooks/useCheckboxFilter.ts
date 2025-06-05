import useQueryState, {booleanConverters} from "@/hooks/useQueryState.ts";
import {useState} from "react";

export default function useCheckboxFilter(key: string) {
    const [paramValue, setParamValue] = useQueryState<boolean>(key, booleanConverters)
    const [value, setValue] = useState<boolean | undefined>(paramValue)

    const onChange = (value: boolean | undefined | null) => {
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
