import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./ui/alert-dialog"
import {buttonVariants} from "@/components/ui/button.tsx";

interface DeleteConfirmationModalProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onConfirm: () => void
    title: string
    message: string
}

export default function DeleteConfirmationModal({
                                                    isOpen,
                                                    onOpenChange,
                                                    onConfirm,
                                                    title,
                                                    message,
                                                }: DeleteConfirmationModalProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {message}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}
                                       className={buttonVariants({variant: "destructive"})}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
