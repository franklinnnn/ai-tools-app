"use client";
import * as z from "zod";

import supabase from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { formSchema } from "../code/constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Empty from "@/components/Empty";
import { auth } from "@clerk/nextjs";
import { increaseApiLimit, checkApiLimit } from "@/lib/apiLimit";

interface TestUserProps {
  id: string;
  user_id: string;
  count: number;
  updated_at: Date;
}

const TestSupabasePage = () => {
  const [fetchError, setFetchError] = useState();
  const [testUser, setTestUser] = useState<TestUserProps | null>(null);

  const [smoothies, setSmoothies] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    method: "",
    rating: "",
  });

  //   const formSchema = z.object({
  //     title: z.string().min(1, {
  //       message: "Title is required",
  //     }),
  //     method: z.string().min(1, {
  //       message: "Method is required",
  //     }),
  //     rating: z.number().min(1, {
  //       message: "Rating is required",
  //     }),
  //   });

  //   const form = useForm<z.infer<typeof formSchema>>({
  //     resolver: zodResolver(formSchema),
  //     defaultValues: {
  //       title: "",
  //     },
  //   });

  const fetchSmoothies = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("Test table").select();
    setSmoothies(data);
    setLoading(false);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(formData);
    // Add your form submission logic here

    if (!formData.title || !formData.method || !formData.rating) {
      alert("Fill out all the fields");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("Test table")
      .insert([formData])
      .select();

    if (error) {
      console.log(error);
      alert(error);
    }
    if (data) {
      console.log(data);
    }

    setFormData({
      title: "",
      method: "",
      rating: "",
    });

    fetchSmoothies();
    setLoading(false);
  };

  // const userId = "test user 3";

  // const increaseApiLimit = async () => {
  //   const { data, error } = await supabase
  //     .from("user-api-limit")
  //     .select("*")
  //     .eq("user_id", userId);
  //   console.log(data);

  //   const userApiLimit = data?.find((user) => user.user_id === userId);
  //   console.log(userApiLimit);

  //   setTestUser(userApiLimit);
  //   if (userApiLimit) {
  //     await supabase
  //       .from("user-api-limit")
  //       .update({ count: userApiLimit.count + 1 })
  //       .eq("user_id", userId);

  //     alert(
  //       `Good shit, ${userApiLimit.user_id}, you have added one more usage. You now have ${userApiLimit.count} credits`
  //     );
  //   } else {
  //     const { data, error } = await supabase
  //       .from("user-api-limit")
  //       .insert({
  //         user_id: userId,
  //         count: 5,
  //       })
  //       .select();
  //     console.log(data);
  //     alert(`New user ${userId} created with ${5} credits. Have fun`);
  //   }
  // };

  useEffect(() => {
    // fetchSmoothies();

    increaseApiLimit();
  }, []);

  //   const onSubmit = async (values: z.infer<typeof formSchema>) => {
  //     console.log(values);
  //   };

  return (
    <div>
      <div className="flex flex-col gap-4 mx-4">
        <h1 className="text-xl">{testUser?.user_id}</h1>
        <h4 className="text-sm text-muted-foreground">{testUser?.id}</h4>
        <div className="flex items-center justify-between">
          <p>Usage credits: {testUser?.count}</p>{" "}
          {/* <p>Updated: {testUser?.updated_at}</p> */}
        </div>

        <button
          onClick={increaseApiLimit}
          className="bg-slate-600/20 hover:bg-slate-600 transition p-4"
        >
          Test button
        </button>
      </div>
      {/* {loading && <p>Loading...</p>} */}
      {smoothies.length === 0 && !loading && (
        <div>
          <Empty label="no smoothies :(" />
        </div>
      )}
      <ul className="flex flex-col gap-y-4 m-4">
        {smoothies.map((data: any) => (
          <li
            key={data.id}
            className="bg-slate-600/10 hover:bg-slate-600/50 px-2 rounded-lg"
          >
            <h1 className="text-lg">{data.title}</h1>
            <p>{data.method}</p>
            <p className="text-xs">{data.created_at}</p>
          </li>
        ))}
      </ul>

      {/* <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
        >
          <FormField
            name="prompt"
            render={({ field }) => (
              <FormItem className="col-span-12 lg:col-span-10">
                <FormControl className="m-0 p-0">
                  <Input
                    className="border-0 outline-none focus-visible ring-0 focus-visible:ring-transparent"
                    // disabled={isLoading}
                    placeholder="How much wood could a woodchuck chuck if a woodchuck could chuck wood?"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            className="col-span-12 lg:col-span-2 w-full"
            // disabled={isLoading}
          >
            Generate
          </Button>
        </form>
      </Form> */}

      <hr />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-2 m-4 p-2 bg-slate-600/20 rounded-lg"
      >
        <h1 className="text-lg mb-4">Add new smoothie</h1>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="pl-2"
        />
        <input
          type="text"
          name="method"
          placeholder="Method"
          value={formData.method}
          onChange={handleChange}
          className="pl-2"
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating"
          value={formData.rating}
          onChange={handleChange}
          className="pl-2"
        />
        <button
          type="submit"
          disabled={!formData.title || !formData.method || !formData.rating}
          className="py-2 text-white bg-slate-600/40 hover:bg-slate-600 rounded-lg transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default TestSupabasePage;
