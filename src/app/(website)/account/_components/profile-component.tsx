"use client"

import {
    useForm,
} from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { useState, useRef, useEffect } from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import FooterBannar from "@/components/footerBannar"
import BannerSection from "@/components/homeHeaders/BannerSection"
import { toast } from "sonner"
import { useMutation, useQuery } from "@tanstack/react-query"
import { UserResponse } from "../../../../../types/UserDataType"
import { useSession } from "next-auth/react"
import AccountSkeleton from "./skeleton"
import LogoutModal from "@/components/LogoutModal"

const profileSchema = z.object({
    fullname: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(6, "Invalid phone number"),
    country: z.string().min(1, "Country is required"),
    cityState: z.string().min(1, "City/State is required"),
    // business: z.string().optional(),
    postalCode: z.string().min(4, "Postal Code is required"),
    taxId: z.string().min(4, "Tax ID is required"),
    image: z.any().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

type ProfilePayload = {
    name: string;
    email: string;
    phone: string;
    // bio: string;
    address: {
        country: string;
        cityState: string;
        postalCode: string;
        taxId: string;
    };
};


interface ProfileInfoComponentProps {
    setChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProfileInfoComponent({ setChange }: ProfileInfoComponentProps) {
    const session = useSession();
    const token = (session?.data?.user as { accessToken: string })?.accessToken;
    const id = (session?.data?.user as { id: string })?.id;

    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch user data
    const { data, isLoading } = useQuery<UserResponse>({
        queryKey: ["me"],
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/user/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!res.ok) throw new Error("Failed to fetch user");
            return res.json();
        },
    });

    // Initialize form with fetched data once it's loaded
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullname: "",
            email: "",
            phone: "",
            country: "",
            cityState: "",
            // business: "",
            postalCode: "",
            taxId: "",
        },
    })

    // When data arrives, reset form values and set preview image
    useEffect(() => {
        if (data && data.data) {
            const user = data.data;
            reset({
                fullname: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                country: user.address?.country || "",
                cityState: user.address?.cityState || "",
                // business: user.bio || "", // assuming bio maps to business here
                postalCode: user.address?.postalCode || "",
                taxId: user.address?.taxId || "",
            })
            setPreviewImage(user.profileImage || null);
        }
    }, [data, reset])

    const profileMutation = useMutation<UserResponse, Error, ProfilePayload>({
        mutationFn: async (data) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.message || "Failed to update profile");
            }
            return resData;
        },
        onSuccess: () => {
            toast.success("Profile updated successfully");
            setIsEditing(false);
        },
        onError: (error) => {
            toast.error(error.message || "Something went wrong");
        },
    });

    const imageUploadMutation = useMutation({
        mutationFn: async (imageFile: File) => {
            const formData = new FormData();
            formData.append("profileImage", imageFile);

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/upload-avatar/${id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to upload image");
            }

            return data;
        },
        onSuccess: () => {
            toast.success("Profile image updated successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Image upload failed");
        },
    });

    const onSubmit = (data: ProfileFormData) => {
        const payload = {
            name: data.fullname,
            email: data.email,
            phone: data.phone,
            // bio: data.business || "",
            address: {
                country: data.country,
                cityState: data.cityState,
                postalCode: data.postalCode,
                taxId: data.taxId,
            },
        };

        profileMutation.mutate(payload);
    };

    const handleImageUpload = () => {
        const file = watch("image")?.[0];
        if (file) {
            imageUploadMutation.mutate(file);
        } else {
            toast.error("Please select an image first.");
        }
    };

    const imageFile = watch("image")?.[0];
    useEffect(() => {
        if (imageFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(imageFile);
        }
    }, [imageFile]);

    const handleAvatarClick = () => {
        if (isEditing) {
            fileInputRef.current?.click();
        }
    };

    if (isLoading) {
        <AccountSkeleton />
    }

    return (
        <div>
            <BannerSection image={'/pexels2.jpg'} />
            <div className="min-h-screen bg-[#F8FEFF] py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="rounded-lg shadow-sm p-6 mb-6">
                            <h1 className="text-2xl font-semibold text-center mb-6">My Profile</h1>

                            <div className="flex flex-col items-start gap-[24px] mb-[42px] ">
                                <h2 className="text-lg font-medium mb-4">Personal Information</h2>
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-center mb-4">
                                        <div
                                            className={`mb-2 cursor-pointer border rounded-full ${isEditing ? "" : "pointer-events-none opacity-70"}`}
                                            onClick={handleAvatarClick}
                                        >
                                            <Avatar className="w-40 h-40">
                                                <AvatarImage
                                                    src={previewImage || "/placeholder.svg?height=80&width=80"}
                                                    alt="Profile"
                                                />
                                                <AvatarFallback>{data?.data.name.slice(0, 2)}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            {...register("image")}
                                            ref={(e) => {
                                                register("image").ref(e);
                                                fileInputRef.current = e;
                                            }}
                                            className="hidden"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#131313]">{watch("fullname") || "No Name"}</h3>
                                        <p className="text-sm text-[#424242] mb-2">{watch("email") || "No Email"}</p>
                                        <p className="text-sm text-[#424242]">
                                            {watch("phone") || "No Phone"}<br />
                                            {watch("country") && watch("cityState")
                                                ? `${watch("country")}, ${watch("cityState")}`
                                                : "No Address"}
                                        </p>
                                        {isEditing && (
                                            <Button
                                                type="button"
                                                className="mt-4 rounded-full text-white"
                                                onClick={handleImageUpload}
                                                disabled={imageUploadMutation.isPending}
                                            >
                                                {imageUploadMutation.isPending ? "Uploading..." : "Upload Image"}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-between w-full">
                                    <Button
                                        type="submit"
                                        className="bg-primary flex hover:bg-primary/90 text-white px-6 py-2 rounded-full"
                                        disabled={!isEditing || profileMutation.isPending}
                                    >
                                        {profileMutation.isPending ? "Saving..." : "Save"}
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(true)}
                                        className="text-red-500 hover:text-red-600 text-sm font-medium"
                                    >
                                        Log out
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                    <div>
                                        <Label htmlFor="fullname">Full Name</Label>
                                        <Input id="fullname" {...register("fullname")} disabled={!isEditing} />
                                        {errors.fullname && <p className="text-sm text-red-500">{errors.fullname.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" {...register("email")} disabled={!isEditing} />
                                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" {...register("phone")} disabled={!isEditing} />
                                        {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="country">Country</Label>
                                        <Input id="country" {...register("country")} disabled={!isEditing} />
                                        {errors.country && <p className="text-sm text-red-500">{errors.country.message}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="cityState">City/State</Label>
                                        <Input id="cityState" {...register("cityState")} disabled={!isEditing} />
                                        {errors.cityState && <p className="text-sm text-red-500">{errors.cityState.message}</p>}
                                    </div>
                                </div>

                                {/* <div>
                                    <Label htmlFor="business">Business</Label>
                                    <Textarea
                                        id="business"
                                        {...register("business")}
                                        placeholder="Describe your business..."
                                        className="min-h-[80px]"
                                        disabled={!isEditing}
                                    />
                                </div> */}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="postalCode">Postal Code</Label>
                                        <Input id="postalCode" {...register("postalCode")} disabled={!isEditing} />
                                        {errors.postalCode && <p className="text-sm text-red-500">{errors.postalCode.message}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="taxId">Tax ID</Label>
                                        <Input id="taxId" {...register("taxId")} disabled={!isEditing} />
                                        {errors.taxId && <p className="text-sm text-red-500">{errors.taxId.message}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-6">
                                <div className="flex justify-between w-full items-center">
                                    <Button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full"
                                        disabled={isEditing}
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        type="button"
                                        onClick={() => setChange(true)}
                                        className="border-gray-300 bg-transparent text-black ring-1 ring-gray-200 hover:bg-transparent hover:shadow-lg shadow-md px-6 py-2 rounded-full"
                                    >
                                        Change Password
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <FooterBannar />
                </div>
                <LogoutModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />

            </div>
        </div>
    )
}
