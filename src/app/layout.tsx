import type { Metadata } from "next";
import "../styles/index.css";

export const metadata: Metadata = {
  title: "Membership Portal Website",
  description: "This platform enables users to manage memberships, book fitness classes, track health metrics, and receive alerts, while offering admins tools for member and financial management.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full m-0 bg-background text-foreground antialiased dark">
        <div id="root" className="h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
