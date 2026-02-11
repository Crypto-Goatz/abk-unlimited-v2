import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME
    ? `${process.env.NEXT_PUBLIC_SITE_NAME} | ${process.env.NEXT_PUBLIC_SITE_TAGLINE || "Professional Services"}`
    : "ABK Unlimited | Pittsburgh's Trusted General Contractor",
  description:
    process.env.NEXT_PUBLIC_SITE_NAME
      ? `Professional services by ${process.env.NEXT_PUBLIC_SITE_NAME}. Quality work, fair prices, satisfaction guaranteed.`
      : "Award-winning Pittsburgh general contractor specializing in kitchen remodeling, bathroom renovations, basement finishing & deck building. Licensed & insured. Free estimates. Call (412) 944-1683.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cro9Key = process.env.NEXT_PUBLIC_CRO9_KEY;
  const crmTrackingId = process.env.NEXT_PUBLIC_CRM_TRACKING_ID;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        {/* CRO9 Analytics Tracker */}
        {cro9Key && (
          <Script
            src="https://cdn.cro9.app/tracker.min.js"
            data-api-key={cro9Key}
            data-consent-mode="gdpr"
            strategy="afterInteractive"
          />
        )}

        {/* CRM Tracking Script */}
        {crmTrackingId && (
          <Script
            src="https://links.rocketclients.com/js/external-tracking.js"
            data-tracking-id={crmTrackingId}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
