import { Skeleton } from "@/components/shared/loading-skeleton";
import { getI18n } from "@/i18n/locale";

export default async function PropertyLoading() {
  const { t } = await getI18n();

  return (
    <div
      role="status"
      aria-label={t.common.loading}
      className="container-site space-y-6 pt-8 pb-16"
    >
      <Skeleton className="h-4 w-72" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-[20rem] rounded-panel sm:h-[26rem] lg:h-[34rem]" />
      <div className="grid gap-12 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-48 rounded-card" />
        </div>
        <Skeleton className="h-96 rounded-panel" />
      </div>
    </div>
  );
}
