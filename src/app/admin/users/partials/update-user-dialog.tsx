"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const updateUserSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  role: z.enum(["admin", "guru", "user"]),
});

type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

interface User {
  id: string;
  name: string;
  email: string;
  role: string | null;
}

interface UpdateUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UpdateUserDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: UpdateUserDialogProps) {
  const [isPending, setIsPending] = React.useState(false);

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || "",
      role: (user?.role as "admin" | "guru" | "user") || "user",
    },
  });

  // Update form when user changes
  React.useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        role: (user.role as "admin" | "guru" | "user") || "user",
      });
    }
  }, [user, form]);

  async function onSubmit(values: UpdateUserFormValues) {
    if (!user) return;

    setIsPending(true);
    try {
      // Update user data
      const { error: updateError } = await authClient.admin.updateUser({
        userId: user.id,
        data: {
          name: values.name,
        },
      });

      if (updateError) {
        toast.error(updateError.message || "Gagal mengupdate user");
        return;
      }

      // Update role if changed
      if (values.role !== user.role) {
        const { error: roleError } = await authClient.admin.setRole({
          userId: user.id,
          role: values.role as "admin" | "user",
        });

        if (roleError) {
          toast.error(roleError.message || "Gagal mengubah role");
          return;
        }
      }

      toast.success("User berhasil diupdate");
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update informasi user {user.email}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <FormLabel>Email</FormLabel>
              <Input value={user.email} disabled />
              <p className="text-xs text-muted-foreground">
                Email tidak dapat diubah
              </p>
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="guru">Guru</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
