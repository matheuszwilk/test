import { DataTable } from "../_components/ui/data-table";
import { DataTable2 } from "../_components/ui/data-table2";
// import { andonTableColumns } from "./_components/table-andon-columns";
import { AndonDataDto, getAndonData } from "../_data-access/andon/get-andon";
import Header, {
  HeaderLeft,
  HeaderRight,
  HeaderSubtitle,
  HeaderTitle,
} from "@/app/_components/header";
import SelectMonthAndLine from "./_components/select-month-and-line";
// import {
//   AndonAllDataDto,
//   getAllLineAndonData,
// } from "../_data-access/andon/get-all-andon-by-line";
// import { andonAllTableColumns } from "./_components/table-all-andon-columns";
import {
  AndonByMonthDataDto,
  getAndonByMonthData,
} from "../_data-access/andon/get-andon-by-month";
import { andonTableColumnsByMonth } from "./_components/table-andon-columns-by-month";
import {
  AndonByYearDataDto,
  getAndonByYearData,
} from "../_data-access/andon/get-andon-by-year";
import { andonTableColumnsByYear } from "./_components/table-andon-columns-by-year";
import ChartMonth from "./_components/chart-month";
import ChartWeek from "./_components/chart-week";
import ChartYear from "./_components/chart-year";
import { getDefectAccData } from "../_data-access/andon/get-defect-acc-by-time";
import { DefectAccDataDto } from "../_data-access/andon/get-defect-acc-by-time";
import ChartDefect from "./_components/chart-defect-time";
import ChartDefectByQty from "./_components/chart-defect-qty";
import { getDefectQtyAccData } from "../_data-access/andon/get-defect-acc-by-qty";
import { DefectQtyAccDataDto } from "../_data-access/andon/get-defect-acc-by-qty";
import { andonTableColumns } from "../products/_components/table-andon-columns";
import { AndonReportDataDto } from "../_data-access/andon/get-report-data";
import { getAndonReportData } from "../_data-access/andon/get-report-data";
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
  const andonData: AndonDataDto[] = await getAndonData(targetMonth, targetLine);
  // const allAndonData: AndonAllDataDto[] = await getAllLineAndonData(targetMonth.split('-')[0], targetLine);
  const andonByMonthData: AndonByMonthDataDto[] = await getAndonByMonthData(
    targetMonth,
    targetLine,
  );
  const andonByYearData: AndonByYearDataDto[] = await getAndonByYearData(
    targetMonth,
    targetLine,
  );

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

  console.log(andonReportData);

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
      {/* <ChartDefect data={defectAccData} />
      <ChartDefectByQty data={defectQtyAccData} /> */}
      <DataTable columns={defectReportColumns} data={andonReportData} />
      <div className="flex w-full flex-row gap-4 overflow-auto">
        <div className="flex w-full flex-col gap-2">
          <div>
            <ChartYear data={andonByYearData} />
          </div>
          <DataTable columns={andonTableColumnsByYear} data={andonByYearData} />
        </div>
        <div className="flex w-full flex-col gap-2">
          <ChartMonth data={andonByMonthData} />
          <DataTable2
            columns={andonTableColumnsByMonth}
            data={andonByMonthData}
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <ChartWeek data={andonData} />
          <DataTable columns={andonTableColumns} data={andonData} />
        </div>
      </div>
      {/* <div>
        <DataTable columns={andonAllTableColumns} data={allAndonData} />
      </div> */}
    </div>
  );
};

export default AndonPage;
