import { DataTable } from "../_components/ui/data-table";
import Header, {
  HeaderLeft,
  HeaderRight,
  HeaderSubtitle,
  HeaderTitle,
} from "@/app/_components/header";
import SelectMonthAndLine from "./_components/filter-month-and-line";
import { getDefectAccData } from "../_data-access/andon/report/get-defect-acc-by-time";
import { DefectAccDataDto } from "../_data-access/andon/report/get-defect-acc-by-time";
import ChartDefect from "./_components/chart-defect-time";
import ChartDefectByQty from "./_components/chart-defect-qty";
import { getDefectQtyAccData } from "../_data-access/andon/report/get-defect-acc-by-qty";
import { DefectQtyAccDataDto } from "../_data-access/andon/report/get-defect-acc-by-qty";
import { AndonReportDataDto } from "../_data-access/andon/report/get-report-data";
import { getAndonReportData } from "../_data-access/andon/report/get-report-data";
import { defectReportColumns } from "./_components/table-defect-report";

// Essa página será montada uma vez e reutilizada (SSG), podendo ser incrementada de forma regenerativa (ISR)
export const dynamic = "force-dynamic";

const AndonPage = async ({
  searchParams,
}: {
  searchParams: { month?: string; line?: string };
}) => {
  const currentDate = new Date();
  const targetLine = searchParams.line ? searchParams.line : "All";
  const defaultMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
  const targetMonth = searchParams.month || defaultMonth;
  const defectAccData: DefectAccDataDto[] = await getDefectAccData(
    targetMonth,
    targetLine,
  );
  const defectQtyAccData: DefectQtyAccDataDto[] = await getDefectQtyAccData(
    targetMonth,
    targetLine,
  );

  const andonReportData: AndonReportDataDto[] = await getAndonReportData(
    targetMonth,
    targetLine,
  );

  return (
    <div className="w-full space-y-8 rounded-lg bg-background p-8">
      <Header>
        <HeaderLeft>
          <HeaderSubtitle>Andon</HeaderSubtitle>
          <HeaderTitle>
            Instant Stop Loss 3min↓ - H&A (Monitoring AA1 & AC1)
          </HeaderTitle>
        </HeaderLeft>
        <HeaderRight>
          <div className="flex gap-4">
            <SelectMonthAndLine
              initialMonth={targetMonth}
              initialLine={targetLine}
            />
          </div>
        </HeaderRight>
      </Header>
      <div className="flex w-full flex-row gap-4 overflow-auto">
        <div className="flex w-full flex-col gap-2">
          <div>
            <ChartDefect data={defectAccData} />
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <ChartDefectByQty data={defectQtyAccData} />
        </div>
      </div>
      <DataTable columns={defectReportColumns} data={andonReportData} />
    </div>
  );
};

export default AndonPage;
