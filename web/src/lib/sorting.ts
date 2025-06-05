export type SortDirection = "asc" | "desc";

const ASC_SUFFIX = "+";
const DESC_SUFFIX = "-";
const POSSIBLE_SUFFIX = [ASC_SUFFIX, DESC_SUFFIX] as const;
type SortDirectionSuffix = (typeof POSSIBLE_SUFFIX)[number];

const suffixBySortDirection: Record<SortDirection, SortDirectionSuffix> = {
    asc: ASC_SUFFIX,
    desc: DESC_SUFFIX,
};

const sortDirectionBySuffix: Partial<Record<string, SortDirection>> = {
    [ASC_SUFFIX]: "asc",
    [DESC_SUFFIX]: "desc",
};

export interface ListSorting {
    field: string;
    direction: SortDirection;
}

export function serializeListSorting(sorting: ListSorting): string {
    return `${sorting.field}${suffixBySortDirection[sorting.direction]}`;
}

export function deserializeListSorting(
    v: string | null | undefined
): ListSorting | null {
    if (v == null) {
        return null;
    }

    const suffix = v.slice(-1);
    const fieldName = v.slice(0, -1);
    const direction = sortDirectionBySuffix[suffix];
    if (direction == null || !fieldName) {
        return null;
    }

    return {
        field: fieldName,
        direction,
    };
}

export function deserializeListSortings(values: string[]): ListSorting[] {
    return values.map(deserializeListSorting).filter((x) => !!x);
}

