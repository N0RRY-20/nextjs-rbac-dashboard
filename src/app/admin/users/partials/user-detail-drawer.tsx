"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import {
  IconMail,
  IconUser,
  IconShield,
  IconCalendar,
  IconCheck,
  IconX,
} from "@tabler/icons-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned?: boolean | null;
  emailVerified?: boolean;
  createdAt?: string;
}

interface UserDetailDrawerProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailDrawer({
  user,
  open,
  onOpenChange,
}: UserDetailDrawerProps) {
  const isMobile = useIsMobile();

  if (!user) return null;

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={open}
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div>{user.name}</div>
              <div className="text-sm font-normal text-muted-foreground">
                {user.email}
              </div>
            </div>
          </DrawerTitle>
          <DrawerDescription>Detail informasi user</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-4">
          {/* Role & Status */}
          <div className="flex flex-wrap gap-2">
            <Badge variant={user.role === "admin" ? "default" : "secondary"}>
              {user.role || "user"}
            </Badge>
            {user.banned ? (
              <Badge variant="destructive">Banned</Badge>
            ) : (
              <Badge variant="outline">Active</Badge>
            )}
            {user.emailVerified ? (
              <Badge variant="default">Email Verified</Badge>
            ) : (
              <Badge variant="secondary">Email Unverified</Badge>
            )}
          </div>

          <Separator />

          {/* User Info */}
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <IconUser className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Nama</div>
                <div className="font-medium">{user.name}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <IconMail className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{user.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <IconShield className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Role</div>
                <div className="font-medium capitalize">
                  {user.role || "user"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                {user.emailVerified ? (
                  <IconCheck className="h-4 w-4 text-green-500" />
                ) : (
                  <IconX className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Email Verification
                </div>
                <div className="font-medium">
                  {user.emailVerified ? "Verified" : "Not Verified"}
                </div>
              </div>
            </div>

            {user.createdAt && (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <IconCalendar className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Bergabung</div>
                  <div className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* User ID */}
          <div className="rounded-lg bg-muted p-3">
            <div className="text-xs text-muted-foreground">User ID</div>
            <div className="font-mono text-xs break-all">{user.id}</div>
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Tutup</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
