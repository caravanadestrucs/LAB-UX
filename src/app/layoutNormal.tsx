import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

export default function LayoutNormal({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
