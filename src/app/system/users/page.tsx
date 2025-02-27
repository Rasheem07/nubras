'use client'

import Modal from "@/app/dashboard/_components/Modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ban, CheckCircle, Loader, Loader2, Pencil, Signal, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import AddUserForm from "./_components/addUserForm";
import EditUserForm from "./_components/editUserForm";
import { toast } from "sonner";

export default function UsersPage() {
  const [addUserModal, setAddUserModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState(false);
  const [revokeUserModal, setRevokeUserModal] = useState(false);
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>({ id: '', username: '', contact: '', role: '' })

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch("http://34.18.73.81:3000/admin/users", { credentials: 'include' });
      return await response.json();
    },
    refetchInterval: 5 * 60 * 1000,
  });

  // Apply filters and search
  const filteredUsers = users?.filter((user: any) => {
    return (
      (roleFilter === "All" || user.role === roleFilter) &&
      (statusFilter === "All" || user.status === statusFilter) &&
      (searchQuery === "" || user.username.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }) || [];

  const queryClient = useQueryClient();

  const { mutate: revokeUser, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`http://34.18.73.81:3000/admin/revoke/${id}`, { credentials: 'include', method: 'POST' });
      const json = await response.json()

      if (!response.ok) {
        toast.error(json.message)
      }

      queryClient.invalidateQueries({ queryKey: ['users'] })
      setRevokeUserModal(false)
      toast.success(json.message)
    }
  })

  const { mutate: reactivateUser, isPending: isActivating } = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`http://34.18.73.81:3000/admin/reactivate/${id}`, { credentials: 'include', method: 'POST' });
      const json = await response.json()

      if (!response.ok) {
        toast.error(json.message)
      }

      queryClient.invalidateQueries({ queryKey: ['users'] })
      setRevokeUserModal(false)
      toast.success(json.message)
    }
  })
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Users Management</h1>
        <button onClick={() => setAddUserModal(true)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          Add New User
        </button>
      </div>

      {addUserModal && <AddUserForm onClose={() => setAddUserModal(false)} />}
      {editUserModal && <EditUserForm onClose={() => setEditUserModal(false)} user={selectedUser} />}
      {revokeUserModal && (
        <Modal onClose={() => setRevokeUserModal(false)}>
          <div className="p-8 bg-gray-800 max-w-md">
            <h1 className="text-xl font-bold text-white">Are you sure you want to revoke {selectedUser.username}?</h1>
            <p className="text-sm font-sans text-gray-200 mt-1">{selectedUser.username} will be immediately logged and restricted to any access.</p>
            <div className="pt-6 flex items-center gap-4">
              <button type="button" className="px-4 py-2 w-full bg-gray-700 rounded-lg" onClick={() => setRevokeUserModal(false)}>
                Cancel
              </button>
              <button disabled={isPending} onClick={() => revokeUser(selectedUser.id)} type="submit" className="px-4 w-full flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
                {isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Revoking user</> : 'Confirm'}
              </button>
            </div>
          </div>
        </Modal>
      )}
      <div className="bg-gray-800 rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Search users..."
              className="w-64 px-4 py-2 text-sm border-gray-600 border text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex space-x-2">
              <select
                className="px-4 py-2 text-sm text-gray-300 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">Role: All</option>
                <option value="ADMIN">ADMIN</option>
                <option value="VIEWER">VIEWER</option>
                <option value="EDITOR">EDITOR</option>
              </select>

              <select
                className="px-4 py-2 text-sm text-gray-300 bg-gray-700  border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">Status: All</option>
                <option value="Active">Active</option>
                <option value="Offline">Offline</option>
                <option value="Revoked">Revoked</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3">Id</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Last Active</th>
                  <th className="px-6 py-3">Created At</th>
                  <th className="px-6 py-3">Updated At</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={8} className="py-4 mt-2">
                        <div className="h-6 bg-gray-600 rounded w-3/4 mx-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-gray-400">No users found</td>
                  </tr>
                ) : (
                  filteredUsers.map((user: any, i: number) => (
                    <tr key={i} className="text-gray-300 transition-all duration-300 hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm">{user.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {user.profilePicture ? (
                            <Image src={user.profilePicture} quality={100} className="rounded-full h-12 w-12" alt={user.username} height={250} width={250} />
                          ) : (
                            <Avatar username={user.username} />
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium">{user.username}</div>
                            <div className="text-sm text-gray-400">{user.contact}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{user.role}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.status === "Active" ? "text-green-400 bg-green-400/10" :
                          user.status === "Offline" ? "text-gray-400 bg-gray-400/10" :
                            "text-red-400 bg-red-400/10"
                          }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{new Date(user.lastActive).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm">{new Date(user.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm">{new Date(user.updatedAt).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm flex items-center gap-2 justify-center mt-2">
                        {user.status == "Revoked" ?
                          <button onClick={() => reactivateUser(user.id)} className="py-2 px-4 rounded-md bg-green-600 hover:bg-green-700 shadow-md flex items-center gap-1.5">
                            <CheckCircle className="h-4 w-4" /> Reactivate
                          </button>
                          : (
                            <>
                              <button title="Edit" onClick={() => { setSelectedUser(user); setEditUserModal(true) }} className="text-white border border-blue-400/20 hover:text-white bg-blue-400/10 rounded-md p-2"><Pencil className="h-4 w-4" /></button>
                              <button title="Block" onClick={() => { setSelectedUser(user); setRevokeUserModal(true) }} className="text-white border border-orange-400/20 hover:text-white bg-orange-400/10 rounded-md p-2"><Ban className="h-4 w-4" /></button>
                              <button title="Delete" className="text-white border border-red-600 hover:text-white bg-red-500 rounded-md p-2"><Trash className="h-4 w-4" /></button>
                            </>
                          )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const getColorFromLetter = (letter: string) => {
  const colors = [
    "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500",
    "bg-teal-500", "bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500"
  ];
  return colors[letter.charCodeAt(0) % colors.length]; // Select color based on letter
};

const Avatar = ({ username }: { username: string }) => {
  const firstLetter = username[0].toUpperCase();
  const bgColor = getColorFromLetter(firstLetter);

  return (
    <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center uppercase font-bold text-zinc-50`}>
      {firstLetter}
    </div>
  );
};
