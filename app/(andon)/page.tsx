import { DataTable } from "../_components/ui/data-table";
import { AndonDataDto, getAndonData } from "../_data-access/andon/get-andon";
import Header, {
  HeaderLeft,
  HeaderRight,
  HeaderSubtitle,
  HeaderTitle,
} from "@/app/_components/header";
import SelectMonthAndLine from "./_components/filter-month-and-line";
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
import { andonTableColumns } from "./_components/table-andon-columns-by-week";
import { DottedSeparator } from "../_components/dotted-separator";

export const dynamic = "force-dynamic";

interface SearchParams {
  month?: string;
  line?: string;
}

const getCurrentMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

interface AndonDataResponse {
  andonData: AndonDataDto[];
  andonByMonthData: AndonByMonthDataDto[];
  andonByYearData: AndonByYearDataDto[];
}

const fetchAndonData = async (month: string, line: string): Promise<AndonDataResponse> => {
  const [andonData, andonByMonthData, andonByYearData] = await Promise.all([
    getAndonData(month, line),
    getAndonByMonthData(month, line),
    getAndonByYearData(month, line),
  ]);

  return {
    andonData,
    andonByMonthData,
    andonByYearData,
  };
};

interface ChartSectionProps<T> {
  title?: string;
  chart: React.ReactNode;
  data: T[];
  columns: any[];
}

const ChartSection = <T,>({
  title,
  chart,
  data,
  columns,
}: ChartSectionProps<T>) => (
  <div className="flex w-full flex-col gap-2">
    {title && <h3 className="text-lg font-semibold">{title}</h3>}
    {chart}
    <DataTable columns={columns} data={data} />
  </div>
);

const AndonPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const targetLine = searchParams.line || "All";
  const targetMonth = searchParams.month || getCurrentMonth();

  const { andonData, andonByMonthData, andonByYearData } = await fetchAndonData(
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

      <DottedSeparator className="my-4" />

      <div className="flex w-full flex-row gap-4">
        <ChartSection<AndonByYearDataDto>
          chart={<ChartYear data={andonByYearData} />}
          data={andonByYearData}
          columns={andonTableColumnsByYear}
        />
        <ChartSection<AndonByMonthDataDto>
          chart={<ChartMonth data={andonByMonthData} />}
          data={andonByMonthData}
          columns={andonTableColumnsByMonth}
        />
        <ChartSection<AndonDataDto>
          chart={<ChartWeek data={andonData} />}
          data={andonData}
          columns={andonTableColumns}
        />
      </div>
    </div>
  );
};

export default AndonPage;
