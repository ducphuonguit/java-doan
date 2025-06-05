import { useMemo } from "react";
import {Converters, useQueryState} from "@/hooks/useQueryState.ts";


function isNonNullable<T>(x?: T): x is T {
    return x != null;
}

export function useQueryListState<T>(
    key: string,
    converters: Converters<T>
): [T[] | undefined, (value: T[] | undefined) => void] {
    const listConverters = useMemo<Converters<T[]>>(() => {
        return {
            decoder: (t) => {
                switch (typeof t) {
                    case "object":
                    case "string":
                        return (typeof t === "object" ? t : [t])
                            .map(converters.decoder)
                            .filter(isNonNullable);
                    default:
                        return undefined;
                }
            },
            encoder: (t) => t.map((x) => converters.encoder(x).toString()),
        };
    }, [converters]);
    return useQueryState(key, listConverters, true);
}

export default useQueryListState;
