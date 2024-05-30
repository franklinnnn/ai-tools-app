import { auth } from '@clerk/nextjs' 
import supabase from "@/lib/supabaseClient";
import { MAX_FREE_COUNTS } from '@/constants';

export const increaseApiLimit = async () => {
    const {userId} = auth();
    if(!userId) {
        return
    }

    const { data: userApiLimit, error } = await supabase
      .from("user-api-limit")
      .select("*")
      .eq("user_id", userId)
      .single()

    // const userApiLimit = data?.find((user) => user.user_id === userId);
    console.log(userApiLimit);

    if(userApiLimit) {
        await supabase
            .from('user-api-limit')
            .update({count: userApiLimit.count + 1})
            .eq('user_id', userId)
    } else {
        await supabase
            .from('user-api-limit')
            .insert({
                user_id: userId,
                count: 1
            })
    }
}

export const checkApiLimit = async () => {
    const { userId } = auth()

    if(!userId) {
        return false;
    }

    const { data: userApiLimit, error } = await supabase
      .from("user-api-limit")
      .select("*")
      .eq("user_id", userId)
      .single()

    // const userApiLimit = data?.find((user) => user.user_id === userId);

    if(!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
      return true
    } else {
      return false
    }
    
}

export const getApiLimitCount = async () => {
  const { userId } = auth()

  if(!userId) {
    return 0;
  }

  const { data: userApiLimit, error} = await supabase
    .from('user-api-limit')
    .select("*")
    .eq("user_id", userId)
    .single()

    // const userApiLimit = data?.find((user) => user.user_id === userId);

  if(!userApiLimit) {
    await supabase
      .from('user-api-limit')
      .insert({
        user_id: userId,
        count: 1
    })
  } else {
    return userApiLimit.count
  }

  return userApiLimit.count;
}