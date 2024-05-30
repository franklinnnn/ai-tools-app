import { auth } from '@clerk/nextjs';
import { supabase } from './supabaseClient';

const DAY_IN_MS = 86_400_000;


export const checkSubscription = async () => {
    const { userId } = auth();


    if(!userId) {
        return false
    }
        
    const {data: userSubscription } = await supabase
        .from('user-subscription')
        .select()
        .eq('user_id', userId)
        .single()

    if(!userSubscription) {
        return false;
    }
 
    const isValid = 
        userSubscription.stripe_price_id && 
        Date.parse(userSubscription.stripe_current_period_end) + DAY_IN_MS > Date.now()

    return !!isValid;
}
