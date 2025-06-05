import {PropsWithChildren, useCallback, useEffect, useMemo, useState} from "react";
import {QueryKeyValuePair, QueryStateContext} from "@/context/query-state/QueryStateContext.tsx";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";

export function QueryStateContextProvider(props: PropsWithChildren) {
    const [batch, setBatch] = useState<QueryKeyValuePair[]>([]);
    const batchSetQuery = useCallback((kv: QueryKeyValuePair) => {
        setBatch((prev) => [...prev, kv]);
    }, []);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const updateRouterQuery = useCallback(() => {
        const updatedSearchParams = new URLSearchParams(
            searchParams
        );
        batch.forEach((x) => {
            updatedSearchParams.delete(x.key);
        });
        batch.forEach((x) => {
            if (x.value !== undefined) {
                if (Array.isArray(x.value)) {
                    x.value.forEach((v) =>
                        updatedSearchParams.append(x.key, v)
                    );
                } else {
                    updatedSearchParams.append(x.key, x.value);
                }
            }
        });
        const hash = window.location.hash;
        const url = `${location.pathname}?${updatedSearchParams.toString()}${hash ? hash : ""}`;
        navigate(url);
    }, [batch, searchParams, navigate, location.pathname]);

    useEffect(() => {
        if (batch.length === 0) {
            return;
        }
        const timeoutId = setTimeout(() => {
            updateRouterQuery();
            setBatch([]);
        }); // in next event cycle
        return () => {
            clearTimeout(timeoutId);
        };
    }, [batch, updateRouterQuery]);

    const contextValue = useMemo(() => {
        return { batchSetQuery };
    }, [batchSetQuery]);

    return (
        <QueryStateContext.Provider value={contextValue}>
            {props.children}
        </QueryStateContext.Provider>
    );
}

export default QueryStateContextProvider;
