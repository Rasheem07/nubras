"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/app/dashboard/_components/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const userSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    contact: z.string().min(7, "Enter a valid contact number"),
    role: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
});

type UserFormData = z.infer<typeof userSchema>;

type EditUserFormProps = {
    user: {
        id: string;
        username: string;
        contact: string;
        role: "ADMIN" | "EDITOR" | "VIEWER";
    };
    onClose: () => void;
};

export default function EditUserForm({ user, onClose }: EditUserFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            username: user.username,
            contact: user.contact,
            role: user.role
        },
    });
    const queryClient = useQueryClient()


    const { mutate: editUser, isPending } = useMutation({
        mutationFn: async (data: UserFormData) => {
            const response = await fetch(`http://alnubrasstudio.ddns.net:8888/admin/users/${user.id}/edit`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await response.json();

            if (response.ok) {
                toast.success(json?.message);
                queryClient.invalidateQueries({ queryKey: ['users'] })
                onClose();
                return;
            }
            toast.error(json.message);
        },
    });

    const onSubmit = (data: UserFormData) => {
        editUser(data);

    };

    return (
        <Modal onClose={onClose}>
            <div className="p-6 bg-gray-800 border border-gray-700 text-white rounded-lg w-full max-w-lg min-w-[400px]">
                <h2 className="text-xl font-semibold mb-4">Edit User</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Username</label>
                        <input
                            {...register("username")}
                            className="w-full p-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-500 outline-none"
                        />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Contact</label>
                        <input
                            {...register("contact")}
                            className="w-full p-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-500 outline-none"
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
                        <button type="submit" className="px-4 w-full flex items-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
                            {isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Saving changes</> : 'Save changes'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
