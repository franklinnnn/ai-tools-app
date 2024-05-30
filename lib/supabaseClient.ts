// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// export const supabaseClient = async (supabaseToken) => {
    
//     const supabase = createClient(supabaseUrl, supabaseKey, {
//         global: { headers: { Authorization: `Bearer ${supabaseToken}`}}
//     });

//     return supabase
// }

import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase