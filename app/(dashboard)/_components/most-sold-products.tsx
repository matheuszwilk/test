import { getMostSoldProducts } from "@/app/_data-access/dashboard/get-most-sold-products";
import MostSoldProductItem, {
  MostSoldProductItemSkeleton,
} from "./most-sold-product-item";
import { Skeleton } from "@/app/_components/ui/skeleton";

const MostSoldProducts = async () => {
  const mostSoldProducts = await getMostSoldProducts();
  return (
    <div className="flex max-h-[350px] flex-col overflow-hidden rounded-xl border bg-card">
      <p className="p-6 text-lg font-semibold text-card-foreground">
        Produtos mais vendidos
      </p>

      <div className="space-y-4 overflow-y-auto px-6 pb-4">
        {mostSoldProducts.map((product) => (
          <MostSoldProductItem key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
};

export const MostSoldProductsSkeleton = () => {
  return (
    <Skeleton className="bg-white p-6">
      <div className="space-y-2">
        <div className="h-5 w-[86.26px] rounded-md bg-gray-200" />
        <div className="h-4 w-48 rounded-md bg-gray-200" />
        <MostSoldProductItemSkeleton />
        <MostSoldProductItemSkeleton />
        <MostSoldProductItemSkeleton />
      </div>
    </Skeleton>
  );
};

export default MostSoldProducts;
