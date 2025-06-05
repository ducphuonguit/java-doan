export type Nullable<T> = T | null | undefined;

export class Maybe<T> {
    private constructor(private value: Nullable<T>) {}
    static of<T>(value: Nullable<T>) {
        return new Maybe<T>(value);
    }

    map<R>(f: (wrapped: T) => R): Maybe<NonNullable<R>> {
        if (this.value != null) {
            const fvalue = f(this.value);
            if (fvalue != null) {
                return Maybe.of<NonNullable<R>>(fvalue);
            }
        }
        return Maybe.of<NonNullable<R>>(null);
    }

    flatMap<R>(
        f: (wrapped: T) => Maybe<NonNullable<R>>
    ): Maybe<NonNullable<R>> {
        return this.value == null
            ? Maybe.of<NonNullable<R>>(null)
            : f(this.value);
    }

    get() {
        return this.value;
    }

    getOrElse(defaultValue: T) {
        return this.value ?? defaultValue;
    }
}

export default Maybe;
