import { PropertyGridSkeleton, Skeleton } from "@/components/shared/loading-skeleton";
import { getI18n } from "@/i18n/locale";

export default async function PropertiesLoading() {
  const { t } = await getI18n();

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="container-site space-y-4 py-8 lg:py-10">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
      </div>
      <div className="container-site grid gap-8 py-8 lg:grid-cols-[18.5rem_1fr] lg:py-10">
        <Skeleton className="hidden h-[36rem] rounded-card lg:block" />
        <div className="space-y-6">
          <Skeleton className="h-9 w-full max-w-md" />
          <PropertyGridSkeleton label={t.common.loading} />
        </div>
      </div>
    </>
  );
}
