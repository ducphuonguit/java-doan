import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import type {FilterProps} from "./types"


export default function TextFilter({label, placeholder = "Search...", value, onChange}: FilterProps<string>) {
    const randomId = Math.random().toString(36).substring(2, 15);
    return (
        <div className="space-y-2">
            <Label htmlFor={randomId}>{label}</Label>
            <Input id={randomId} placeholder={placeholder} value={value?.toString() ?? ""}
                   onChange={(e) => onChange(e.target.value)}/>
        </div>
    )
}
