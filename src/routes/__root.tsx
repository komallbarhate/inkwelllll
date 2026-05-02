import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { Toaster } from "@/components/ui/sonner";
import { Link } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-black text-ink">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="mt-6 inline-block underline underline-offset-4">
          Back home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Inkwell — A home for your writing" },
      { name: "description", content: "A modern editorial blog platform. Write, publish, and read thoughtful posts." },
      { property: "og:title", content: "Inkwell — A home for your writing" },
      { property: "og:description", content: "A modern editorial blog platform. Write, publish, and read thoughtful posts." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Inkwell — A home for your writing" },
      { name: "twitter:description", content: "A modern editorial blog platform. Write, publish, and read thoughtful posts." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3c3f38bd-09c3-4de6-bc76-4e91c08636a2/id-preview-618f5f0f--7182700a-0872-486b-aa37-1f11ca9526a4.lovable.app-1777707958712.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3c3f38bd-09c3-4de6-bc76-4e91c08636a2/id-preview-618f5f0f--7182700a-0872-486b-aa37-1f11ca9526a4.lovable.app-1777707958712.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <footer className="border-t border-rule mt-20">
          <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-muted-foreground flex items-center justify-between">
            <span>© 2026 Inkwell</span>
            <span className="font-display italic">Words, well kept.</span>
          </div>
        </footer>
      </div>
      <Toaster />
    </AuthProvider>
  );
}
