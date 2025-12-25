"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconRefresh,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { CreateUserDialog } from "./create-user-dialog";
import { UpdateUserDialog } from "./update-user-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";
import { UserDetailDrawer } from "./user-detail-drawer";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  total: number;
}

interface SelectedUser {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned?: boolean | null;
  emailVerified?: boolean;
  createdAt?: string;
}

export function UsersDataTable<TData, TValue>({
  columns,
  data: initialData,
  total,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = React.useState<TData[]>(initialData);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // State for dialogs
  const [editUser, setEditUser] = React.useState<SelectedUser | null>(null);
  const [deleteUser, setDeleteUser] = React.useState<SelectedUser | null>(null);
  const [detailUser, setDetailUser] = React.useState<SelectedUser | null>(null);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = React.useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      const { data: usersData, error } = await authClient.admin.listUsers({
        query: {
          limit: 100,
          sortBy: "createdAt",
          sortDirection: "desc",
        },
      });

      if (error) {
        toast.error("Gagal memuat data users");
        return;
      }

      setData((usersData?.users || []) as TData[]);
      toast.success("Data berhasil diperbarui");
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsRefreshing(false);
    }
  }

  // Handle action clicks from dropdown
  React.useEffect(() => {
    const handleClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const menuItem = target.closest("[data-action]") as HTMLElement;

      if (!menuItem) return;

      const action = menuItem.dataset.action;
      const userId = menuItem.dataset.userId;
      const role = menuItem.dataset.role;
      const userName = menuItem.dataset.userName;
      const userEmail = menuItem.dataset.userEmail;
      const userRole = menuItem.dataset.userRole;

      if (!userId) return;

      if (action === "detail" && userName && userEmail) {
        // Find full user data from table data
        const fullUser = data.find(
          (u: unknown) => (u as SelectedUser).id === userId
        ) as SelectedUser | undefined;
        setDetailUser({
          id: userId,
          name: userName,
          email: userEmail,
          role: userRole || null,
          banned: fullUser?.banned,
          emailVerified: fullUser?.emailVerified,
          createdAt: fullUser?.createdAt,
        });
        setShowDetailDrawer(true);
      } else if (action === "edit" && userName && userEmail) {
        setEditUser({
          id: userId,
          name: userName,
          email: userEmail,
          role: userRole || null,
        });
        setShowEditDialog(true);
      } else if (action === "delete" && userName && userEmail) {
        setDeleteUser({
          id: userId,
          name: userName,
          email: userEmail,
          role: null,
        });
        setShowDeleteDialog(true);
      } else if (action === "set-role" && role) {
        const { error } = await authClient.admin.setRole({
          userId,
          role: role as "admin" | "user",
        });
        if (error) {
          toast.error("Gagal mengubah role");
        } else {
          toast.success(`Role berhasil diubah ke ${role}`);
          handleRefresh();
        }
      } else if (action === "ban") {
        const { error } = await authClient.admin.banUser({
          userId,
          banReason: "Banned by admin",
        });
        if (error) {
          toast.error("Gagal memban user");
        } else {
          toast.success("User berhasil dibanned");
          handleRefresh();
        }
      } else if (action === "unban") {
        const { error } = await authClient.admin.unbanUser({ userId });
        if (error) {
          toast.error("Gagal mengunban user");
        } else {
          toast.success("User berhasil diunban");
          handleRefresh();
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="space-y-4">
      {/* Header - Stack on mobile, side by side on tablet+ */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Cari users..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="w-full sm:max-w-sm"
          />
        </div>
        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <span className="text-sm text-muted-foreground">Total: {total}</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <IconRefresh
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <CreateUserDialog onSuccess={handleRefresh} />
          </div>
        </div>
      </div>

      {/* Table - Scrollable on mobile */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination - Responsive layout */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Selected rows count - hide on mobile */}
        <div className="hidden text-sm text-muted-foreground sm:block">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s)
        </div>

        {/* Pagination controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          {/* Rows per page - hide on mobile */}
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]" id="rows-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page info and navigation */}
          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
            <div className="text-sm">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 hidden sm:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <IconChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <IconChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <IconChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 hidden sm:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <IconChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Dialog */}
      <UpdateUserDialog
        user={editUser}
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) setEditUser(null);
        }}
        onSuccess={handleRefresh}
      />

      {/* Delete User Dialog */}
      <DeleteUserDialog
        user={deleteUser}
        open={showDeleteDialog}
        onOpenChange={(open) => {
          setShowDeleteDialog(open);
          if (!open) setDeleteUser(null);
        }}
        onSuccess={handleRefresh}
      />

      {/* User Detail Drawer */}
      <UserDetailDrawer
        user={detailUser}
        open={showDetailDrawer}
        onOpenChange={(open) => {
          setShowDetailDrawer(open);
          if (!open) {
            // Delay reset agar animasi close selesai dulu
            setTimeout(() => setDetailUser(null), 300);
          }
        }}
      />
    </div>
  );
}
