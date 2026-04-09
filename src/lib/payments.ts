/**
 * Korapay Payment Service
 * Handles transaction initialization and subscription management.
 */

const KORAPAY_SECRET_KEY = process.env.KORAPAY_SECRET_KEY;
const KORAPAY_PUBLIC_KEY = process.env.NEXT_PUBLIC_KORAPAY_PUBLIC_KEY;

export interface TransactionOptions {
    amount: number;
    customer_email: string;
    customer_name?: string;
    reference: string;
    description?: string;
    notification_url?: string;
    redirect_url?: string;
}

/**
 * Initializes a transaction with Korapay.
 * Returns the checkout URL if successful.
 */
export async function initializeTransaction(options: TransactionOptions) {
    try {
        const response = await fetch('/api/payments/initialize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(options)
        });

        const data = await response.json();

        if (data.status && data.data && data.data.checkout_url) {
            return data.data.checkout_url;
        } else {
            console.error("Korapay Initialization Failed:", data);
            throw new Error(data.message || "Failed to initialize transaction");
        }
    } catch (error) {
        console.error("Korapay Service Error:", error);
        throw error;
    }
}

/**
 * Plans Configuration
 */
export const PLANS = {
    MONTHLY: {
        id: 'pro_monthly',
        name: 'Pro Monthly',
        amount: 5000,
        currency: 'NGN',
        features: [
            'Unlimited Investor Search',
            'Full Contact Metadata',
            'Direct Warm Intros',
            'CSV Export Data',
            'Watchlist Sync'
        ]
    },
    YEARLY: {
        id: 'pro_yearly',
        name: 'Pro Yearly',
        amount: 50000,
        currency: 'NGN',
        features: [
            'Everything in Monthly',
            '2 Months Free',
            'Priority Support',
            'Early Access Features'
        ]
    }
};
