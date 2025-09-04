"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// import { setCookie } from "cookies-next";
import { setCookie } from "nookies";
import { useEffect, useState } from "react";
import "../app/globals.css";

interface Props {
  children: React.ReactNode;
}

const pin = process.env.NEXT_PUBLIC_PIN; // must be NEXT_PUBLIC_

export default function ProtectedFeature({ children }: Props) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authorized="))
      ?.split("=")[1];

    setIsAuthorized(cookieValue === "true");
  }, []);

  const handleVerify = () => {
    if (otp === pin) {
      setCookie(null, "authorized", "true", { maxAge: 60 * 60 * 24 * 7 });
      setIsAuthorized(true);
    } else {
      alert("Invalid OTP");
    }
  };

  if (isAuthorized === null) return null; // waiting for cookie check

  return (
    <>
      {children}

      {/* Blocking Modal when not authorized */}
      <Dialog open={!isAuthorized} modal>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle>Enter OTP</CardTitle>
              <CardDescription>
                Please Enter The OTP to Access This Feature.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="my-2"
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleVerify} className="text-white w-full">
                Verify
              </Button>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}
