import { getLast14DaysRevenue } from "@/app/_data-access/dashboard/get-last-14-days-revenue";
import RevenueChart from "./revenue-chart";

const Last14DaysRevenueCard = async () => {
  const totalLast14DaysRevenue = await getLast14DaysRevenue();
  return (
    <div className="flex max-h-[350px] flex-col overflow-hidden rounded-xl bg-card p-6">
      <p className="text-lg font-semibold text-slate-300">Receita</p>
      <p className="text-sm text-slate-400">Últimos 14 dias</p>
      <RevenueChart data={totalLast14DaysRevenue} />
    </div>
  );
};

export default Last14DaysRevenueCard;
