import { DashboardLayout } from "@/components/dashboard-layout";

export default function GuruLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
