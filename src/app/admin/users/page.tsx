import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { columns } from "./partials/columns";
import { UsersDataTable } from "./partials/users-data-table";

export default async function AdminUsersPage() {
  // Fetch users dari server menggunakan auth API
  const usersData = await auth.api.listUsers({
    query: {
      limit: 100,
      sortBy: "createdAt",
      sortDirection: "desc",
    },
    headers: await headers(),
  });

  const users =
    usersData?.users?.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role ?? null,
      banned: user.banned,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
    })) || [];

  const total = usersData?.total || 0;

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold">Users Management</h1>
        <p className="text-muted-foreground">
          Kelola users, set role, dan ban/unban users.
        </p>
      </div>
      <UsersDataTable columns={columns} data={users} total={total} />
    </div>
  );
}
