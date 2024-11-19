import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Home() {
  return (
    <div class="min-h-screen bg-gray-100">
      <Header />

      <main className=" mb-5 mt-3">
        |<Outlet />
      </main>
      <Footer />
    </div>
  );
}
