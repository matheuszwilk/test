import { DataTable } from "../_components/ui/data-table";
import { productTableColumns } from "./_components/table-columns";
import { getProducts } from "../_data-access/product/get-products";
import { AndonDataDto, getAndonData } from "../_data-access/andon/get-andon";
import AddProductButton from "./_components/create-product-button";
import Header, {
  HeaderLeft,
  HeaderRight,
  HeaderSubtitle,
  HeaderTitle,
} from "@/app/_components/header";
import SelectMonth from "./_components/select-month";
import { andonTableColumns } from "../(andon)/_components/table-andon-columns-by-week";

// Essa página será montada uma vez e reutilizada (SSG), podendo ser incrementada de forma regenerativa (ISR)
export const dynamic = "force-dynamic";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: { month?: string };
}) => {
  const currentDate = new Date();
  const defaultMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
  const targetMonth = searchParams.month || defaultMonth;

  const andonData: AndonDataDto[] = await getAndonData(targetMonth);
  const products = await getProducts();
  return (
    <div className="w-full space-y-8 overflow-auto rounded-lg bg-background p-8">
      <Header>
        <HeaderLeft>
          <HeaderSubtitle>Gestão de Produtos</HeaderSubtitle>
          <HeaderTitle>Produtos</HeaderTitle>
        </HeaderLeft>
        <HeaderRight>
          <SelectMonth initialMonth={targetMonth} />
          <AddProductButton />
        </HeaderRight>
      </Header>
      <DataTable columns={productTableColumns} data={products} />
      <div className="flex w-full flex-row justify-between gap-4">
        <div className="w-1/2">
          <DataTable columns={andonTableColumns} data={andonData} />
        </div>
        <div className="w-1/2">
          <DataTable columns={andonTableColumns} data={andonData} />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
