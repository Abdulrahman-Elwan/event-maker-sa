
import "server-only";
import { cacheLife } from "next/cache";

export async function getTodayDate(): Promise<string> {
    "use cache";

    cacheLife("hours");

    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Riyadh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());
}
