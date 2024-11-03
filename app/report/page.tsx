import { DataTable } from "@/app/_components/ui/data-table";
import Header, {
  HeaderLeft,
  HeaderRight,
  HeaderSubtitle,
  HeaderTitle,
} from "@/app/_components/header";
import SelectMonthAndLine from "@/app/report/_components/filter-month-and-line";
import { getDefectAccData } from "@/app/_data-access/andon/report/get-defect-acc-by-time";
import { DefectAccDataDto } from "@/app/_data-access/andon/report/get-defect-acc-by-time";
import ChartDefect from "@/app/report/_components/chart-defect-time";
import ChartDefectByQty from "@/app/report/_components/chart-defect-qty";
import { getDefectQtyAccData } from "@/app/_data-access/andon/report/get-defect-acc-by-qty";
import { DefectQtyAccDataDto } from "@/app/_data-access/andon/report/get-defect-acc-by-qty";
import { defectReportColumns } from "@/app/report/_components/table-report-columns";
import { AndonReportDataDto } from "@/app/_data-access/andon/report/get-report-data";
import { getAndonReportData } from "@/app/_data-access/andon/report/get-report-data";

export const dynamic = "force-dynamic";

interface SearchParams {
  month?: string;
  line?: string;
}

interface ReportData {
  defectAccData: DefectAccDataDto[];
  defectQtyAccData: DefectQtyAccDataDto[];
  andonReportData: AndonReportDataDto[];
}

const getFormattedDate = () => {
  const currentDate = new Date();
  return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
};

const fetchReportData = async (targetMonth: string, targetLine: string): Promise<ReportData> => {
  const [defectAccData, defectQtyAccData, andonReportData] = await Promise.all([
    getDefectAccData(targetMonth, targetLine),
    getDefectQtyAccData(targetMonth, targetLine),
    getAndonReportData(targetMonth, targetLine)
  ]);

  return {
    defectAccData,
    defectQtyAccData,
    andonReportData
  };
};

const AndonPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const targetLine = searchParams.line || "All";
  const targetMonth = searchParams.month || getFormattedDate();
  
  const { defectAccData, defectQtyAccData, andonReportData } = await fetchReportData(
    targetMonth,
    targetLine
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
          <ChartDefect data={defectAccData} />
        </div>
        <div className="flex w-full flex-col gap-2">
          <ChartDefectByQty data={defectQtyAccData} />
        </div>
      </div>

      <DataTable 
        columns={defectReportColumns} 
        data={andonReportData} 
      />
    </div>
  );
};

export default AndonPage;
