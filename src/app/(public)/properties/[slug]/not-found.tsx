import Link from "next/link";
import { HousePlus } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { getI18n } from "@/i18n/locale";

export default async function PropertyNotFound() {
  const { t } = await getI18n();

  return (
    <div className="container-site py-20">
      <EmptyState
        icon={HousePlus}
        title={t.property.notFoundTitle}
        body={t.property.notFoundBody}
        action={
          <Button asChild>
            <Link href="/properties">{t.notFound.browse}</Link>
          </Button>
        }
      />
    </div>
  );
}
