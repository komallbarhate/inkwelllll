import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";

export function SiteHeader() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-rule bg-paper/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-black tracking-tight text-ink">Inkwell</span>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground hidden sm:inline">
            est. 2026
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          {loading ? null : user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/write">
                  <PenLine className="h-4 w-4" />
                  Write
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard">My posts</Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/" });
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth">Get started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
