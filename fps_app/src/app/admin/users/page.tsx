"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Shield,
  ShieldOff,
  Trash2,
  Mail,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface UserAccount {
  provider: string;
}

interface UserCountry {
  code: string;
  name: string;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  blocked: boolean;
  createdAt: string;
  accounts: UserAccount[];
  country: UserCountry | null;
  hardware: { id: string } | null;
  _count: {
    searchHistory: number;
    aiConversations: number;
  };
}

// const PROVIDER_ICONS: Record<string, string> = {
//   google: "G",
//   github: "Gh",
// }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (roleFilter) params.set("role", roleFilter);
      if (statusFilter) params.set("status", statusFilter);
      params.set("page", String(page));
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter, page]);

  useEffect(() => {
    (async () => {
      await fetchUsers();
    })();
  }, [fetchUsers]);

  async function toggleBlock(user: User) {
    setError("");
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocked: !user.blocked }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to update user");
      return;
    }
    if (selectedUser?.id === user.id) {
      setSelectedUser({ ...selectedUser, blocked: !user.blocked });
    }
    fetchUsers();
  }

  async function deleteUser(id: string) {
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    if (selectedUser?.id === id) setSelectedUser(null);
    fetchUsers();
  }

  function getProvider(user: User): string {
    if (!user.accounts || user.accounts.length === 0) return "Email";
    return user.accounts[0].provider;
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-headline-md">Users</h1>
        <p className="text-sm text-on-surface-variant">
          {total} user{total !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setError("") }}
            placeholder="Search by name or email..."
            className="kinetic-input w-full pl-9"
          />
        </div>
        {error && (
          <div className="w-full rounded-lg bg-error-container/10 border border-error/20 px-4 py-2 text-sm text-error">
            {error}
          </div>
        )}
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setError("") }}
          className="kinetic-input"
        >
          <option value="" className="bg-surface">All Roles</option>
          <option value="USER" className="bg-surface">User</option>
          <option value="ADMIN" className="bg-surface">Admin</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setError("") }}
          className="kinetic-input"
        >
          <option value="" className="bg-surface">All Status</option>
          <option value="active" className="bg-surface">Active</option>
          <option value="blocked" className="bg-surface">Blocked</option>
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        <div className="xl:col-span-2 kinetic-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-outline-variant bg-surface-container-low">
                <tr>
                  <th className="px-4 py-3 text-left text-label-caps text-on-surface-variant">User</th>
                  <th className="px-4 py-3 text-left text-label-caps text-on-surface-variant">Role</th>
                  <th className="px-4 py-3 text-left text-label-caps text-on-surface-variant">Status</th>
                  <th className="px-4 py-3 text-left text-label-caps text-on-surface-variant">Provider</th>
                  <th className="px-4 py-3 text-left text-label-caps text-on-surface-variant">Region</th>
                  <th className="px-4 py-3 text-left text-label-caps text-on-surface-variant">Joined</th>
                  <th className="px-4 py-3 text-right text-label-caps text-on-surface-variant">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 w-full max-w-24 animate-pulse rounded bg-muted-background" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-muted"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className={`border-b border-outline-variant transition-colors cursor-pointer ${
                        selectedUser?.id === user.id
                          ? "bg-primary-container/5"
                          : "hover:bg-surface-container-low"
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="size-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt=""
                                className="size-full object-cover"
                              />
                            ) : (
                              (user.name || "U")[0].toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {user.name || "Unnamed"}
                            </p>
                            <p className="text-xs text-muted truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            user.role === "ADMIN"
                              ? "bg-purple-500/10 text-purple-400"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            user.blocked
                              ? "bg-red-500/10 text-red-400"
                              : "bg-green-500/10 text-green-400"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              user.blocked ? "bg-red-400" : "bg-green-400"
                            }`}
                          />
                          {user.blocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted">
                        {getProvider(user)}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted">
                        {user.country?.code || "--"}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {user.role !== "ADMIN" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBlock(user);
                              }}
                              className="rounded-lg p-2 text-muted hover:text-foreground hover:bg-muted-background transition-colors"
                              title={user.blocked ? "Unblock" : "Block"}
                            >
                              {user.blocked ? (
                                <ShieldOff className="size-4" />
                              ) : (
                                <Shield className="size-4" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm(user.id);
                            }}
                            className="rounded-lg p-2 text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-outline-variant px-4 py-3 flex-wrap gap-2">
              <p className="text-xs text-on-surface-variant">
                Page {page} of {totalPages} ({total} users)
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  <ChevronLeft className="size-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => (
                    <span key={p} className="flex items-center">
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="px-1 text-on-surface-variant text-xs">...</span>
                      )}
                      <button
                        onClick={() => setPage(p)}
                        className={`size-8 rounded-lg text-sm font-medium transition-colors ${
                          p === page
                            ? "bg-primary-container text-on-primary-container"
                            : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                        }`}
                      >
                        {p}
                      </button>
                    </span>
                  ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-lg p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="kinetic-card p-4 md:p-6">
          {selectedUser ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="size-14 shrink-0 rounded-full bg-primary-container/10 flex items-center justify-center text-xl font-bold text-primary-container overflow-hidden">
                  {selectedUser.image ? (
                    <img
                      src={selectedUser.image}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    (selectedUser.name || "U")[0].toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-headline-sm truncate">
                    {selectedUser.name || "Unnamed"}
                  </h3>
                  <p className="text-sm text-on-surface-variant truncate">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Role</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      selectedUser.role === "ADMIN"
                        ? "bg-purple-500/10 text-purple-400"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {selectedUser.role}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Status</span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      selectedUser.blocked
                        ? "bg-red-500/10 text-red-400"
                        : "bg-green-500/10 text-green-400"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        selectedUser.blocked ? "bg-red-400" : "bg-green-400"
                      }`}
                    />
                    {selectedUser.blocked ? "Blocked" : "Active"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Provider</span>
                  <span className="flex items-center gap-1 text-foreground">
                    <Mail className="size-3.5 text-muted" />
                    {getProvider(selectedUser)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Region</span>
                  <span className="flex items-center gap-1 text-foreground">
                    <Globe className="size-3.5 text-muted" />
                    {selectedUser.country
                      ? `${selectedUser.country.name} (${selectedUser.country.code})`
                      : "Not set"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">PC Profile</span>
                  <span>{selectedUser.hardware ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Searches</span>
                  <span>{selectedUser._count.searchHistory}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">AI Chats</span>
                  <span>{selectedUser._count.aiConversations}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Joined</span>
                  <span className="text-xs">
                    {formatDate(selectedUser.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-outline-variant">
                {selectedUser.role !== "ADMIN" && (
                  <button
                    onClick={() => toggleBlock(selectedUser)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors flex-1 justify-center ${
                      selectedUser.blocked
                        ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                        : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    }`}
                  >
                    {selectedUser.blocked ? (
                      <Shield className="size-4" />
                    ) : (
                      <ShieldOff className="size-4" />
                    )}
                    {selectedUser.blocked ? "Unblock" : "Block"}
                  </button>
                )}
                <button
                  onClick={() => setDeleteConfirm(selectedUser.id)}
                  className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors flex-1 justify-center"
                >
                  <Trash2 className="size-4" />
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UsersIcon className="size-10 text-on-surface-variant mb-3" />
              <p className="text-sm text-on-surface-variant">
                Select a user to view details
              </p>
            </div>
          )}
        </div>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-xl border border-border bg-card p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Delete User</h3>
            <p className="text-sm text-muted mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted-background transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteUser(deleteConfirm)}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  );
}
