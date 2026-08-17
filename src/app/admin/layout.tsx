import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — EdgeBrain Studios",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`header, footer { display: none !important; } main { padding: 0 !important; }`}</style>
      {children}
    </>
  );
}
