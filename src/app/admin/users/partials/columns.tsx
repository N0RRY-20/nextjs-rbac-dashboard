"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned: boolean | null;
  emailVerified: boolean;
  createdAt: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium min-w-[120px]">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate md:max-w-none">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string | null;
      return (
        <Badge variant={role === "admin" ? "default" : "secondary"}>
          {role || "user"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "banned",
    header: "Status",
    cell: ({ row }) => {
      const banned = row.getValue("banned") as boolean | null;
      return banned ? (
        <Badge variant="destructive">Banned</Badge>
      ) : (
        <Badge variant="outline">Active</Badge>
      );
    },
    // Hide on mobile, show on tablet+
    meta: {
      className: "hidden sm:table-cell",
    },
  },
  {
    accessorKey: "emailVerified",
    header: () => <span className="hidden lg:inline">Email Status</span>,
    cell: ({ row }) => {
      const verified = row.getValue("emailVerified") as boolean;
      return verified ? (
        <Badge variant="default">Verified</Badge>
      ) : (
        <Badge variant="secondary">Unverified</Badge>
      );
    },
    // Hide on mobile/tablet, show on laptop+
    meta: {
      className: "hidden lg:table-cell",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <IconDotsVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              data-action="detail"
              data-user-id={user.id}
              data-user-name={user.name}
              data-user-email={user.email}
              data-user-role={user.role}
            >
              Detail
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              data-action="edit"
              data-user-id={user.id}
              data-user-name={user.name}
              data-user-email={user.email}
              data-user-role={user.role}
            >
              Edit User
            </DropdownMenuItem>
            <DropdownMenuItem
              data-action={user.banned ? "unban" : "ban"}
              data-user-id={user.id}
            >
              {user.banned ? "Unban User" : "Ban User"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              data-action="delete"
              data-user-id={user.id}
              data-user-name={user.name}
              data-user-email={user.email}
              className="text-destructive"
            >
              Hapus User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
