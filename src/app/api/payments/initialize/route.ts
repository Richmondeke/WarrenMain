import { NextResponse } from 'next/server';

const KORAPAY_SECRET_KEY = process.env.KORAPAY_SECRET_KEY;

export async function POST(req: Request) {
    try {
        if (!KORAPAY_SECRET_KEY) {
            console.error("Missing KORAPAY_SECRET_KEY");
            return NextResponse.json(
                { status: false, message: "Server configuration error" },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { amount, customer_email, reference, description } = body;

        // Basic validation
        if (!amount || !customer_email || !reference) {
            return NextResponse.json(
                { status: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const payload = {
            amount: amount, // Korapay v1 might actually expect Naira as a number, but let's be careful. 
            currency: 'NGN',
            reference,
            notification_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhook/korapay`,
            redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/search?subscription=success`,
            customer: {
                email: customer_email,
                name: 'Valued Investor'
            },
            merchant_bears_cost: false
        };

        console.log("Initializing Korapay Transaction with payload:", JSON.stringify(payload, null, 2));

        const response = await fetch('https://api.korapay.com/merchant/api/v1/charges/initialize', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${KORAPAY_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("Korapay Response Status:", response.status);
        console.log("Korapay Response Body:", data);

        if (data.status === true || data.status === 'success') {
            return NextResponse.json(data);
        } else {
            return NextResponse.json(
                { status: false, message: data.message || "Failed to initialize transaction", raw: data },
                { status: 400 }
            );
        }
    } catch (error: any) {
        console.error("Korapay API Route Error:", error);
        return NextResponse.json(
            { status: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
