import type { Locale } from "@/lib/i18n/config";
import type { HeroSlide } from "@/lib/data/homepage";

import HeroSlider from "./HeroSlider";

interface HeroProps {
    locale: Locale;
    slides: readonly HeroSlide[];
}

export default function Hero({ locale, slides }: HeroProps) {
    return <HeroSlider locale={locale} slides={slides} />;
}