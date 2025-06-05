

import type React from "react"
import { forwardRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Badge } from "./badge"
import { X } from "lucide-react"

export interface TagInputProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
  label?: string
  error?: string
  helperText?: string
  className?: string
  id?: string
  badgeVariant?: "primary" | "secondary" | "outline" | "success" | "warning" | "danger" | "info"
}

const TagInput = forwardRef<HTMLDivElement, TagInputProps>(
  (
    {
      tags,
      onTagsChange,
      placeholder = "Add a tag",
      label,
      error,
      helperText,
      className,
      id,
      badgeVariant = "secondary",
      ...props
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = useState("")
    const inputId = id || Math.random().toString(36).substring(2, 9)

    const handleAddTag = () => {
      if (!inputValue.trim()) return

      if (!tags.includes(inputValue.trim())) {
        onTagsChange([...tags, inputValue.trim()])
      }

      setInputValue("")
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        handleAddTag()
      }
    }

    const handleRemoveTag = (tag: string) => {
      onTagsChange(tags.filter((t) => t !== tag))
    }

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn("block text-sm font-medium", error ? "text-red-500" : "text-gray-700")}
          >
            {label}
          </label>
        )}
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <Badge key={tag} variant={badgeVariant} className="gap-1">
              {tag}
              <button
                type="button"
                className="ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-gray-200 focus:outline-none"
                onClick={() => handleRemoveTag(tag)}
              >
                <X size={12} />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex">
          <input
            id={inputId}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "flex h-10 w-full rounded-l-md border px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
              error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500",
            )}
            onKeyDown={handleKeyDown}
          />
          <Button type="button" onClick={handleAddTag} className="rounded-l-none">
            Add
          </Button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
      </div>
    )
  },
)

TagInput.displayName = "TagInput"

export { TagInput }
