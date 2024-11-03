import {
  AlertDialog,
} from "@/app/_components/ui/alert-dialog";
import { Button } from "@/app/_components/ui/button";
import { Dialog, DialogTrigger } from "@/app/_components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import {
  MoreHorizontalIcon,
  ClipboardCopyIcon,
  EditIcon,
} from "lucide-react";
import { useState } from "react";
import { AndonReportDataDto } from "@/app/_data-access/andon/report/get-report-data";
import UpsertReportDialogContent from "./upsert-dialog-content-report";

interface DefectReportTableDropdownMenuProps {
  defectReport: AndonReportDataDto;
}

const DefectReportTableDropdownMenu = ({
  defectReport,
}: DefectReportTableDropdownMenuProps) => {
  const [editDialogOpen, setEditDialogIsOpen] = useState(false);
  return (
    <AlertDialog>
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogIsOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <MoreHorizontalIcon size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-1.5"
              onClick={() => navigator.clipboard.writeText(defectReport.id)}
            >
              <ClipboardCopyIcon size={16} />
              Copiar ID
            </DropdownMenuItem>
            <DialogTrigger asChild>
              <DropdownMenuItem className="gap-1.5">
                <EditIcon size={16} />
                Editar
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu> 
        <UpsertReportDialogContent
          defaultValues={{
            id: defectReport.id,
            year_month: defectReport.year_month,
            andon_process: defectReport.andon_process,
            equipment_line: defectReport.equipment_line,
            reason: defectReport.reason,
            end_date: defectReport.end_date.toISOString(),
            cause_department: defectReport.cause_department,
            andon_time: defectReport.andon_time,
            createdat: defectReport.createdat,
            status: defectReport.status,
            action_plan_file_url: defectReport.action_plan_file_url
          }}
          setDialogIsOpen={setEditDialogIsOpen}
        />
      </Dialog>
    </AlertDialog>
  );
};

export default DefectReportTableDropdownMenu;
