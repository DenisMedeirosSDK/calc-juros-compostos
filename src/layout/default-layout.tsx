import { Outlet } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export function DefaultLayout() {
  return (
    <div className="bg-zinc-900 min-h-screen">
      <Header />
      <div className="h-full">
        <Outlet />
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
