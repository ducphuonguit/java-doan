import {Checkbox} from "@/components/ui/checkbox"
import {Label} from "@/components/ui/label"

export default function CheckboxFilter({label,  value = false, onChange}: {
                                           label: string
                                           value?: boolean
                                           onChange: (value: boolean) => void
                                       }
) {
    const randomId = Math.random().toString(36).substring(2, 15)
    return (
        <div className="flex items-center space-x-2 h-full pt-8">
            <Checkbox id={randomId} checked={value} onCheckedChange={(checked) => onChange(checked as boolean)}  className="cursor-pointer"/>
            <Label htmlFor={randomId} className="cursor-pointer">{label}</Label>
        </div>
    )
}
