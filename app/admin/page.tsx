import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import AdminApp from "./app";

const AdminPage = async () => {
  if (!await isAdmin()) {
    redirect("/");
  }

  return <AdminApp />;
};

export default AdminPage;