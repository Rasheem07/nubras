"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import Modal from "@/app/dashboard/_components/Modal";
import { ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const userSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    contact: z.string().min(7, "Enter a valid contact number"),
    role: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
    profilePicture: z.instanceof(File).optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export default function AddUserForm({ onClose }: { onClose: () => void }) {
    const [preview, setPreview] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
    });


    const queryClient = useQueryClient()

    const { mutate: addUser, isPending } = useMutation({
        mutationFn: async (data: UserFormData) => {
            const formData = new FormData();
            formData.append("username", data.username);
            formData.append("contact", data.contact);
            formData.append("role", data.role);
            if (data.profilePicture) {
                formData.append("file", data.profilePicture);
            }

            const response = await fetch("http://alnubrasstudio.ddns.net/admin/users/add", {
                method: "POST",
                credentials: "include",
                body: formData, // No need for Content-Type, browser sets it automatically
            });
            const json = await response.json();

            if (response.ok) {
                toast.success(json?.message);
                queryClient.invalidateQueries({queryKey: ['users']})
                onClose();
                return;
            }

            toast.error(json.message)
        },
    });


    const onSubmit = async (data: UserFormData) => {
        console.log(data);
        await addUser(data)

    };
    // Handle File Upload Preview
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("profilePicture", file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <Modal onClose={onClose}>
            <div className="p-6 bg-gray-800 border border-gray-700 text-white rounded-lg w-full max-w-lg min-w-[400px]">
                <h2 className="text-xl font-semibold mb-4">Add New User</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex justify-center">
                        <input type="file" accept="image/*" className="hidden" id="fileInput" onChange={handleFileChange} />
                        <label htmlFor="fileInput" className="cursor-pointer">
                            {preview ? (
                                <Image height={96} width={96} src={preview} alt="Profile" className="h-24 w-24 rounded-full object-cover border border-gray-600" />
                            ) : (
                                <div className="h-24 w-24 rounded-full flex-col gap-0.5 bg-gray-700 border border-gray-600 flex items-center justify-center text-gray-200">
                                    <ImageIcon className="h-5 w-5" />
                                    Upload
                                </div>
                            )}
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Username</label>
                        <input
                            {...register("username")}
                            className="w-full p-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-500 outline-none"
                            placeholder="Enter username"
                        />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Contact</label>
                        <input
                            {...register("contact")}
                            className="w-full p-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-500 outline-none"
                            placeholder="Enter contact number"
                        />
                        {errors.contact && <p className="text-red-500 text-sm">{errors.contact.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Role</label>
                        <select
                            {...register("role")}
                            className="w-full p-2 mt-1 text-white bg-gray-700 rounded-lg border border-gray-600 focus:ring focus:ring-blue-500 outline-none"
                        >
                            <option value="ADMIN">Admin</option>
                            <option value="EDITOR">Editor</option>
                            <option value="VIEWER">Viewer</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                    </div>


                    <div className="flex justify-end space-x-2">
                        <button type="button" className="px-4 py-2 w-full bg-gray-700 rounded-lg" onClick={onClose}>
                            Cancel
                        </button>
                        <button disabled={isPending} type="submit" className="px-4 w-full py-2 bg-blue-600 flex items-center gap-2 hover:bg-blue-700 rounded-lg">
                            {isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Adding user</> : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
