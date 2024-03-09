import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmDialogBox({
    children,
    title,
    text,
    on_confirm,
    is_dialog_open,
    set_dialog_open,
}: {
    title: string;
    children: React.ReactNode;
    text: string;
    is_dialog_open: boolean;
    set_dialog_open: (arg0:boolean) => void;
    on_confirm: () => void;
}) {
    return (
        <Dialog open={is_dialog_open} onOpenChange={set_dialog_open}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">{title}</DialogTitle>
                </DialogHeader>
                <div>
                    <span className="text-lg">{text}</span>
                </div>
                <DialogFooter>
                    <Button onClick={()=>{
                        set_dialog_open(false)
                        on_confirm()
                    }} variant={"destructive"}>
                        Yes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
