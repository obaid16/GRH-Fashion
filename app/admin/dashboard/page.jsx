import { getDashboardStats } from "@/actions/dashboard";
import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard | GRH Fashion Admin Panel",
};

export default async function DashboardPage() {
  const data = await getDashboardStats();

  return <DashboardClient initialData={data} />;
}
