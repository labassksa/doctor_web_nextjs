import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/sidebar/sidebar";
import { PushNotificationProvider } from "@/components/PushNotificationProvider";
import { IncomingCallNotification } from "@/components/IncomingCallNotification";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Labass Doctor - Medical Consultation Platform",
  description: "Medical consultation and video call platform for doctors",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}  `}>
        <PushNotificationProvider>
          <IncomingCallNotification />
          <div>{children}</div>
        </PushNotificationProvider>
      </body>
    </html>
  );
}
