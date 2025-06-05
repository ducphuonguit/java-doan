import type React from "react"
import { Input } from "@/components/ui/input"
import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface TextInputFormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render">,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "defaultValue" | "name"> {
    label?: string
    placeholder?: string
    description?: string
    className?: string
}

export function TextInputFormField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
      control,
      name,
      label,
      placeholder,
      required,
      description,
      className,
      disabled,
      ...inputProps
  }: TextInputFormFieldProps<TFieldValues, TName>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    {label && (
                        <FormLabel>
                            {label} {required && "*"}
                        </FormLabel>
                    )}
                    <FormControl>
                        <Input placeholder={placeholder} disabled={disabled} {...field} {...inputProps} />
                    </FormControl>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default TextInputFormField
