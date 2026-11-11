import type { Locale } from "@/lib/i18n/config";
import type { ServiceItem } from "@/types/services/services";

import ServicesExplorerInteractive from "./ServicesExplorerInteractive";

interface ServicesExplorerSectionProps {
    locale: Locale;
    services: ServiceItem[];
}

export default function ServicesExplorerSection({
    locale,
    services,
}: ServicesExplorerSectionProps) {
    const sortedServices = [...services]
        .sort((a, b) => a.order - b.order)
        .filter((service) => service.coverImage?.url);

    if (!sortedServices.length) {
        return null;
    }

    return (
        <ServicesExplorerInteractive
            locale={locale}
            services={sortedServices}
        />
    );
}