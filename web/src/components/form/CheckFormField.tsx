import { Checkbox } from "@/components/ui/checkbox"
import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { cn } from "@/lib/utils"

interface CheckboxFormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
    label?: string
    description?: string
    className?: string
    disabled?: boolean
    onCheckedChange?: (checked: boolean) => void
    alignLabel?: "start" | "center" | "end"
}

export function CheckboxFormField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
      control,
      name,
      label,
      description,
      className,
      disabled,
      onCheckedChange,
      alignLabel = "start",
  }: CheckboxFormFieldProps<TFieldValues, TName>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem
                    className={cn(
                        "flex flex-row items-center space-x-3 space-y-0 rounded-md p-1",
                        alignLabel === "start" && "items-start",
                        alignLabel === "center" && "items-center",
                        alignLabel === "end" && "items-end",
                        className,
                    )}
                >
                    <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                                field.onChange(checked)
                                if (onCheckedChange) onCheckedChange(!!checked)
                            }}
                            disabled={disabled}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        {label && <FormLabel className="cursor-pointer">{label}</FormLabel>}
                        {description && <FormDescription>{description}</FormDescription>}
                        <FormMessage />
                    </div>
                </FormItem>
            )}
        />
    )
}

export default CheckboxFormField
