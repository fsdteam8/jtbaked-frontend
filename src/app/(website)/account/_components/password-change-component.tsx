"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowBigLeft, Eye, EyeOff } from "lucide-react"
import BannerSection from "@/components/homeHeaders/BannerSection"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface ProfileInfoComponentProps {
    setChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PasswordChangeComponent({ setChange }: ProfileInfoComponentProps) {
    const session = useSession();
    const token = (session?.data?.user as { accessToken: string })?.accessToken;

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    })

    const handleInputChange = (field: string, value: string) => {
        const updatedData = { ...formData, [field]: value }
        setFormData(updatedData)
    }

    const togglePasswordVisibility = (field: string) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field as keyof typeof prev],
        }))
    }

    const changePasswordMutation = useMutation({
        mutationFn: async (data: { oldPassword: string; newPassword: string }) => {

            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    oldPassword: data.oldPassword,
                    newPassword: data.newPassword,
                }),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || "Password change failed")
            }

            return res.json()
        },
        onSuccess: (data) => {
            console.log("Password changed successfully", data)
            toast.success(data.message)
        },
        onError: (error) => {
            // console.error("Password change failed", error.)
            toast.error(error.message || "Password change failed")
        },
    })

    const handleSave = () => {
        if (formData.newPassword !== formData.confirmPassword) {
            alert("New password and confirm password do not match")
            return
        }

        changePasswordMutation.mutate({
            oldPassword: formData.currentPassword,
            newPassword: formData.newPassword,
        })
    }

    const handleLogout = () => {
        console.log("Logout clicked from password change")
        // logout logic here
    }

    return (
        <div>
            <BannerSection image={"/password.jpg"} />
            <div className="min-h-screen py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-lg shadow-sm p-6">
                        <h1 className="text-2xl font-semibold text-center mb-8">My Profile</h1>

                        <div className="mb-6">
                            <div className="flex justify-between">
                                <h2 className="text-lg font-medium mb-6">Change Password</h2>
                                <Button className="text-white" onClick={() => setChange(false)}>
                                    <ArrowBigLeft className="mr-2 h-4 w-4" /> Back
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {/* Current Password */}
                                <div>
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <div className="relative mt-1">
                                        <Input
                                            id="currentPassword"
                                            type={showPasswords.current ? "text" : "password"}
                                            value={formData.currentPassword}
                                            onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility("current")}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPasswords.current ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <div className="relative mt-1">
                                        <Input
                                            id="newPassword"
                                            type={showPasswords.new ? "text" : "password"}
                                            value={formData.newPassword}
                                            onChange={(e) => handleInputChange("newPassword", e.target.value)}
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility("new")}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPasswords.new ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <div className="relative mt-1">
                                        <Input
                                            id="confirmPassword"
                                            type={showPasswords.confirm ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility("confirm")}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPasswords.confirm ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center">
                            <Button
                                onClick={handleSave}
                                disabled={changePasswordMutation.isPending}
                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md"
                            >
                                {changePasswordMutation.isPending ? "Saving..." : "Save"}
                            </Button>
                            <button
                                onClick={handleLogout}
                                className="text-red-500 hover:text-red-600 text-sm font-medium"
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
