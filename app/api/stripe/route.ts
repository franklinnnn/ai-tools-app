import { auth, currentUser } from '@clerk/nextjs'
import { NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';
import { stripe } from '@/lib/stripe'
import { absoluteUrl } from '@/lib/utils';

const settingsUrl = absoluteUrl("/settings")

export async function GET() {
    try {
        const { userId } = auth();

        const user = await currentUser();

        if(!userId || !user) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        const {data, error } = await supabase
            .from('user-subscription')
            .select("*")
            .eq("user_id", userId)
            .single()
     
        if(data && data.stripe_customer_id) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: data.stripe_customer_id,
                return_url: settingsUrl
            })

            return new NextResponse(JSON.stringify({ url: stripeSession.url }))
        }

        // const userSubscription = data?.find((user) => user.user_id === userId)

        // if(userSubscription && userSubscription.stripe_customer_id) {
        //     const stripeSession = await stripe.billingPortal.sessions.create({
        //         customer: userSubscription.stripe_customer_id,
        //         return_url: settingsUrl
        //     })

        //     return new NextResponse(JSON.stringify({ url: stripeSession.url }))
        // }


        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ['card'],
            mode:"subscription",
            billing_address_collection: "auto",
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data: {
                        currency: "USD",
                        product_data: {
                            name: "Egghead Pro",
                            description: "Unlimited AI generations"
                        },
                        unit_amount: 2000,
                        recurring: {
                            interval: "month"
                        }
                    },
                    quantity: 1,
                }
            ],
            metadata: {
                userId,
            }
        })

        // console.log("STRIPE SESSION", stripeSession);

        return new NextResponse(JSON.stringify({ url: stripeSession.url }))

    } catch (error) {
        console.log("STRIPE_ERROR",error);
        return new NextResponse("Internal error", {status:500})
    }
}