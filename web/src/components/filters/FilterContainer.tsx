import type React from "react"
import {useState} from "react"
import type {ReactNode} from "react"
import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import {X, Filter, ChevronDown, ChevronUp} from "lucide-react"
import {cn} from "@/lib/utils"
import {motion, AnimatePresence} from "framer-motion"

interface FilterContainerProps {
    children: ReactNode
    onApply: () => void
    onClear: () => void
    className?: string
    title?: string
    defaultExpanded?: boolean
}

export default function FilterContainer({
                                            children,
                                            onApply,
                                            onClear,
                                            className,
                                            title = "Filters",
                                            defaultExpanded = true,
                                        }: FilterContainerProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onApply()
    }

    const handleClear = () => {
        onClear()
    }

    const toggleExpanded = () => {
        setIsExpanded((prev) => !prev)
    }

    return (
        <Card className={cn("overflow-hidden", className)}>
            <div
                className="flex items-center justify-between cursor-pointer bg-muted/30 border-b"
                onClick={toggleExpanded}
            >
                <div className="flex items-center gap-2 p-4">
                    <Filter size={18} className="text-muted-foreground"/>
                    <h3 className="font-medium">{title}</h3>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                        e.stopPropagation()
                        toggleExpanded()
                    }}
                    type="button"
                >
                    {isExpanded ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                    <span className="sr-only">{isExpanded ? "Collapse filters" : "Expand filters"}</span>
                </Button>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{height: 0, opacity: 0}}
                        animate={{height: "auto", opacity: 1}}
                        exit={{height: 0, opacity: 0}}
                        transition={{duration: 0.2}}
                    >
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4 p-4">
                                    {children}
                                </div>
                                <div className="flex justify-end gap-2  bg-muted/30 border-t py-2 pr-3">
                                    <Button type="button" variant="outline" onClick={handleClear}
                                            className="flex items-center">
                                        <X size={16} className="mr-1"/>
                                        Clear
                                    </Button>
                                    <Button type="submit" className="flex items-center">
                                        <Filter size={16} className="mr-1"/>
                                        Apply
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    )
}
