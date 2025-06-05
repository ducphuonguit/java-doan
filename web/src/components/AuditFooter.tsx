import { Clock } from "lucide-react"
import { formatDateTime, parseDateFromISO } from "@/lib/utils"
import {AuditInfo} from "@/types";

interface AuditFooterProps {
    audit: AuditInfo
    className?: string
}

export function AuditFooter({ audit, className }: AuditFooterProps) {
    // Parse dates and format them
    const createdDate = parseDateFromISO(audit.createdAt)
    const formattedCreatedDate = createdDate ? formatDateTime(createdDate) : "-"

    const updatedDate = parseDateFromISO(audit.updatedAt)
    const formattedUpdatedDate = updatedDate ? formatDateTime(updatedDate) : "-"

    return (
        <div className={`text-xs text-muted-foreground ${className}`}>
            <div className="flex items-center gap-1.5 mb-1">
                <Clock size={14} className="text-muted-foreground" />
                <span>
          Created at {formattedCreatedDate} by {audit.createdBy || "-"}
        </span>
            </div>
            {audit.updatedBy && (
                <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-muted-foreground" />
                    <span>
            Modified at {formattedUpdatedDate} by {audit.updatedBy}
          </span>
                </div>
            )}
        </div>
    )
}
