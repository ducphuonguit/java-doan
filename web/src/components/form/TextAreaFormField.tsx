import type React from "react"
import { Textarea } from "@/components/ui/textarea"
import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface TextAreaFormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render">,
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "defaultValue" | "name"> {
    label?: string
    placeholder?: string
    description?: string
    className?: string
    rows?: number
}

export function TextAreaFormField<
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
      rows = 3,
      ...textareaProps
  }: TextAreaFormFieldProps<TFieldValues, TName>) {
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
                        <Textarea
                            placeholder={placeholder}
                            disabled={disabled}
                            rows={rows}
                            {...field}
                            {...textareaProps}
                        />
                    </FormControl>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default TextAreaFormField
