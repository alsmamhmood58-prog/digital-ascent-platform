import { Outlet } from "react-router-dom";
import { SiteFooter, SiteHeader } from "./SiteLayout";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
