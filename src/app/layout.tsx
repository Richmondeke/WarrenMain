"use client";

import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/lib/firebase/AuthContext";
import { Toaster } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/firebase/AuthContext";

const MaterialSymbols = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
    rel="stylesheet"
  />
);

const ManropeFont = () => (
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
);

function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { role, loading, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading || !user) return;

    // Define route groups
    const founderPaths = ['/dashboard', '/search', '/deal-room', '/crm', '/resources', '/fundability', '/watchlist'];
    const capitalPaths = ['/portfolio', '/lp-portal', '/deal-sourcing', '/pipeline', '/ecosystem-map', '/thesis-builder'];
    const adminPaths = ['/admin'];

    const isFounderPath = founderPaths.some(path => pathname?.startsWith(path));
    const isCapitalPath = capitalPaths.some(path => pathname?.startsWith(path));
    const isAdminPath = adminPaths.some(path => pathname?.startsWith(path));

    if (role === 'fund_manager') {
      if (isFounderPath || isAdminPath || pathname === '/onboarding') {
        router.push('/portfolio');
      }
    } else if (role === 'founder') {
      if (isCapitalPath || isAdminPath || pathname === '/onboarding') {
        router.push('/dashboard');
      }
    } else if (role === 'admin') {
      if (pathname === '/onboarding') {
        router.push('/admin/users');
      }
    } else if (!role && user) {
      if (pathname !== '/onboarding') {
        router.push('/onboarding');
      }
    }
  }, [role, loading, pathname, router, user]);

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/signup") || pathname?.startsWith("/forgot-password");
  const isAdminPage = pathname?.startsWith("/admin");
  const isInsightsPage = pathname?.startsWith("/insights");
  const isLandingPage = pathname?.startsWith("/fund-managers") || pathname?.startsWith("/pricing");
  const isOnboardingPage = pathname === "/onboarding";

  // These pages use full-page high-fidelity designs without a sidebar
  const isFullPage = isHomePage || isAuthPage || isInsightsPage || isLandingPage || isOnboardingPage;

  return (
    <html lang="en" suppressHydrationWarning className="light">
      <head>
        <MaterialSymbols />
        <ManropeFont />
      </head>
      <body
        suppressHydrationWarning
        className="antialiased min-h-screen bg-background text-foreground transition-colors duration-500"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <NavigationGuard>
              {isFullPage ? (
                <main className="min-h-screen">
                  {children}
                </main>
              ) : (
                <div className="flex">
                  <Sidebar />
                  <main className="flex-1 ml-64 min-h-screen">
                    {children}
                  </main>
                </div>
              )}
            </NavigationGuard>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
