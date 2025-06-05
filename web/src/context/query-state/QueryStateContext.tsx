import {createContext} from "react";

export type QueryKeyValuePair = {
    key: string;
    value: string | string[] | undefined;
};

export type QueryStateContextValue = {
    batchSetQuery: (kv: QueryKeyValuePair) => void;
};

export const QueryStateContext = createContext<QueryStateContextValue>({
    batchSetQuery: () => {},
});
