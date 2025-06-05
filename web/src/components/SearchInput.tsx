import {Search, X} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import {useEffect, useState} from "react";

interface SearchInputProps {
    initialValue: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
}

export default function SearchInput({
                                        initialValue,
                                        onChange,
                                        disabled = false,
                                        placeholder = "Search",
                                        className = "",
                                    }: SearchInputProps) {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        const timer = setTimeout(() => {
            onChange(value)
        }, 300)

        return () => {
            clearTimeout(timer)
        }
    }, [value, onChange]);


    const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const handleClearSearch = () => {
        setValue("")
        onChange("")
    }

    return <div className={cn(className, "relative")}>
        <Search size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
        <Input
            type="text"
            placeholder={placeholder || "Search"}
            value={value}
            onChange={onSearchInputChange}
            className="pl-10"
            disabled={disabled}

        />
        {value && (
            <Button
                variant="ghost"
                size="icon"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
            >
                <X size={16}/>
            </Button>
        )}
    </div>
}