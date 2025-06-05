import { useCallback, useContext, useMemo } from "react";
import {useSearchParams} from "react-router-dom";
import {QueryStateContext} from "@/context/query-state/QueryStateContext.tsx";
import Maybe from "@/lib/maybe.ts";

// import {
//   ComparatorOperator,
//   mapStringToComparatorOperator,
// } from "models/comparatorOperator";

export type Converters<T> = {
    decoder: (t: string | string[] | undefined) => T | undefined;
    encoder: (t: T) => string | string[] | undefined;
};

export const stringConverters: Converters<string> = {
    decoder: (t) => t?.toString(),
    encoder: (t) => t ? t : undefined,
};

export const numberConverters: Converters<number> = {
    decoder: (t) => (typeof t === "string" ? Number.parseInt(t) : undefined),
    encoder: (t) => t.toString(),
};

export const floatConverters: Converters<number> = {
    decoder: (t) => (typeof t === "string" ? Number.parseFloat(t) : undefined),
    encoder: (t) => t.toString(),
};

export const dateConverters: Converters<Date> = {
    decoder: (t) => {
        if (typeof t !== "string") return;
        const d = new Date(t);
        if (isNaN(d.getDate())) return;
        return d;
    },
    encoder: (t) => t.toISOString(),
};

export const booleanConverters: Converters<boolean> = {
    decoder: (t) => (typeof t === "string" ? t === "true" : undefined),
    encoder: (t) => (t ? "true" : "false"),
};

// export const comparatorOperatorConverters: Converters<ComparatorOperator> = {
//   decoder: (t) =>
//     typeof t === "string" ? mapStringToComparatorOperator(t) : undefined,
//   encoder: (t) => t,
// };

export function useQueryState<T>(
    key: string,
    { encoder, decoder }: Converters<T>,
    isList?: boolean
): [T | undefined, (value: T | undefined) => void] {
    const [searchParams] = useSearchParams();
    const { batchSetQuery } = useContext(QueryStateContext);
    const query = useMemo(() => {
        if (isList) {
            return decoder(searchParams.getAll(key));
        }
        return decoder(searchParams.get(key) ?? undefined);
    }, [decoder, key, searchParams, isList]);

    const setQuery = useCallback(
        (value: T | undefined) => {
            batchSetQuery({
                key,
                value: Maybe.of(value).map(encoder).get() ?? undefined,
            });
        },
        [batchSetQuery, encoder, key]
    );

    return [query, setQuery];
}

export default useQueryState;
