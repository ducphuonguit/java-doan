import {useCallback, useEffect, useMemo, useRef} from "react";
import useQueryState, {
    Converters,
    numberConverters,
    stringConverters,
} from "./useQueryState";
import {deserializeListSorting, serializeListSorting} from "@/lib/sorting.ts";

export type SortDirection = "asc" | "desc";

export interface ListSorting {
    field: string;
    direction: SortDirection;
}

interface PageQueryBaseHookValue {
    currentPage: number;
    onPageChange: (page: number) => void;
}

interface PageQueryHookValue extends PageQueryBaseHookValue {
    currentSorting: ListSorting | null;
    onSortingChange: (sorting: ListSorting | null) => void;
    searchText: string;
    onSearchTextChange: (input: string) => void;
}

export const sortConverters: Converters<ListSorting> = {
    decoder: (s) => {
        const parsed = Array.isArray(s)
            ? deserializeListSorting(s[0])
            : deserializeListSorting(s);
        return parsed ?? undefined;
    },
    encoder: (s) => serializeListSorting(s),
};

export function usePageQuery(key: string = ""): PageQueryHookValue {
    const [page, setPage] = useQueryState(key + "page", numberConverters);
    const [sorting, setSorting] = useQueryState(key + "sort", sortConverters);
    const [searchText, setSearchText] = useQueryState(
        key + "q",
        stringConverters
    );

    const currentPage = useMemo(() => {
        return page ?? 1;
    }, [page]);

    const onPageChange = useCallback(
        (page: number) => {
            setPage(page);
        },
        [setPage]
    );

    const hasSorted = useRef(false);

    const onSortingChange = useCallback(
        (sorting: ListSorting | null) => {
            setSorting(sorting ?? undefined);
            hasSorted.current = !!sorting;
        },
        [setSorting]
    );

    const onSearchTextChange = useCallback(
        (value: string) => {
            setSearchText(value);
        },
        [setSearchText]
    );

    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            onPageChange(1);
        }
    }, [searchText]); // eslint-disable-line react-hooks/exhaustive-deps

    // useEffect(() => {
    //     if (hasSorted.current) {
    //         hasSorted.current = false;
    //         onPageChange(1);
    //     }
    // }, [sorting]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        currentPage,
        onPageChange,
        currentSorting: sorting ?? null,
        onSortingChange,
        searchText: searchText?.trim() ?? "",
        onSearchTextChange,
    };
}
