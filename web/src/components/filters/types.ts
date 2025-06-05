export interface FilterProps<T> {
    label: string
    placeholder?: string
    value?: T
    onChange: (value: T) => void
}
