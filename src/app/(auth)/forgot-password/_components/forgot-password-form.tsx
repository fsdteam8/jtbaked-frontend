"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const ForgotPasswordForm = () => {
  const route = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPassMutation = useMutation({
    mutationFn: async (bodyData: { email: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/forget-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(bodyData),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      return res.json(); // returns response data
    },

    onSuccess: (data, variables) => {
      toast.success(data?.message);
      route.push(`/otp?email=${encodeURIComponent(variables.email)}`);
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });



  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    forgotPassMutation.mutate(values)
  }

  return (
    <div>
      <div className="w-[547px] p-6 md:p-7 lg:p-8 rounded-[16px] bg-white shadow-[0px_0px_4px_rgba(0,0,0,0.10)]">
        <h3 className="text-2xl md:text-[28px] lg:text-[32px] font-extrabold text-[#1F2937] text-center leading-[120%] pb-4 md:pb-5 lg:pb-6">
          Forgot Password
        </h3>
        <p className="base font-normal text-[#787878] text-center leading-[150%] ">
          Please enter the email address linked to your <br /> account.
          We&apos;ll send a one-time password (OTP) to <br /> your email for
          verification.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pt-5 md:pt-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1 text-base font-medium leading-[120%]  pb-2">
                    Email{" "}
                    <sup>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="8"
                        height="8"
                        viewBox="0 0 8 8"
                        fill="none"
                      >
                        <path
                          d="M8 2.94136L5.09314 2.75025L3.99841 0L2.90367 2.75025L0 2.94136L2.22709 4.83239L1.49628 7.70097L3.99841 6.11939L6.50055 7.70097L5.76973 4.83239L8 2.94136Z"
                          fill="#04AF1E"
                        />
                      </svg>
                    </sup>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-[52px] text-base font-medium leading-[120%]  rounded-[32px] p-4 border border-[#484848] opacity-80 placeholder:text-[#787878]"
                      placeholder="Enter your email ...."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button
              className="text-lg font-bold text-[#F8FAF9] leading-[120%] rounded-full w-full h-[52px] bg-primary shadow-[0px_4px_4px_0px_rgba(0, 0, 0, 0.15)]"
              type="submit"
            >
              {forgotPassMutation.isPending ? "Sending..." : "Send"}
            </Button>
            <p className="flex items-center justify-center gap-1 text-sm font-medium leading-[120%] ">
              <Link className="hover:underline text-[#293440]" href="/login">Back to Login</Link>
              <Link href="/sign-up" className="text-secondary pl-1 hover:underline">
                Register Here Now
              </Link>{" "}
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
