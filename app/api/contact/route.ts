// app\api\contact\route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { contactFormSchema } from "@/lib/validations/contact";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const result = contactFormSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid form data.",
                    errors: result.error.flatten()
                        .fieldErrors,
                },
                { status: 400 }
            );
        }

        const {
            name,
            email,
            phone,
            brandName,
            message,
            locale,
        } = result.data;

        const docRef = await adminDb
            .collection("contact_submissions")
            .add({
                name,
                email,
                phone,
                brandName: brandName || "",
                message,
                locale,
                status: "new",
                createdAt:
                    new Date(),
            });

        return NextResponse.json(
            {
                success: true,
                id: docRef.id,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            "Contact form submission error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Something went wrong while submitting the form.",
            },
            { status: 500 }
        );
    }
}