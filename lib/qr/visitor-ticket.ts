// lib\qr\visitor-ticket.ts
import "server-only";

import QRCode from "qrcode";

export async function generateVisitorQrCode(
    ticketToken: string,
): Promise<Buffer> {
    if (!ticketToken || ticketToken.length < 32) {
        throw new Error("Invalid visitor ticket token.");
    }

    return QRCode.toBuffer(ticketToken, {
        type: "png",
        errorCorrectionLevel: "H",
        width: 400,
        margin: 2,
        color: {
            dark: "#000000",
            light: "#FFFFFF",
        },
    });
}
