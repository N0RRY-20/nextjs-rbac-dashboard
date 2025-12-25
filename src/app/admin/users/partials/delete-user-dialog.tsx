"use client";

import * as React from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface User {
  id: string;
  name: string;
  email: string;
}

interface DeleteUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: DeleteUserDialogProps) {
  const [isPending, setIsPending] = React.useState(false);

  async function handleDelete() {
    if (!user) return;

    setIsPending(true);
    try {
      const { error } = await authClient.admin.removeUser({
        userId: user.id,
      });

      if (error) {
        toast.error(error.message || "Gagal menghapus user");
        return;
      }

      toast.success("User berhasil dihapus");
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsPending(false);
    }
  }

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus User?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah kamu yakin ingin menghapus user <strong>{user.name}</strong>{" "}
            ({user.email})? Tindakan ini tidak dapat dibatalkan dan semua data
            user akan dihapus permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Menghapus..." : "Hapus User"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
