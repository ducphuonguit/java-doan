import { Switch } from "@/components/ui/switch"
import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { cn } from "@/lib/utils"

interface SwitchFormFieldProps<
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

export function SwitchFormField<
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
  }: SwitchFormFieldProps<TFieldValues, TName>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn("flex flex-row items-center justify-between space-y-0 rounded-md p-1", className)}>
                    <div className="space-y-0.5">
                        {label && <FormLabel>{label}</FormLabel>}
                        {description && <FormDescription>{description}</FormDescription>}
                    </div>
                    <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={(checked: boolean) => {
                                field.onChange(checked)
                                if (onCheckedChange) onCheckedChange(checked)
                            }}
                            disabled={disabled}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default SwitchFormField
