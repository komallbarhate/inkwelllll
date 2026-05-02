import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PenLine } from "lucide-react";

type MyPost = { id: string; title: string; created_at: string; published: boolean };

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "My posts — Inkwell" }] }),
});

function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<MyPost[] | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("posts")
      .select("id, title, created_at, published")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setPosts(data ?? []));
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setPosts((p) => p?.filter((x) => x.id !== id) ?? null);
    toast.success("Deleted");
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-baseline justify-between mb-10">
        <h1 className="font-display text-4xl font-black">My posts</h1>
        <Button asChild>
          <Link to="/write"><PenLine className="h-4 w-4" />New post</Link>
        </Button>
      </div>

      {posts === null ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : posts.length === 0 ? (
        <div className="border border-dashed border-rule rounded-lg p-12 text-center">
          <p className="font-display text-xl">Nothing here yet.</p>
          <Link to="/write" className="mt-4 inline-block underline underline-offset-4 text-primary">
            Write your first post →
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-rule border-y border-rule">
          {posts.map((p) => (
            <li key={p.id} className="py-5 flex items-center justify-between gap-4">
              <Link to="/posts/$postId" params={{ postId: p.id }} className="flex-1 min-w-0">
                <p className="font-display text-xl font-bold truncate hover:text-primary transition">{p.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(new Date(p.created_at), "MMM d, yyyy")}
                </p>
              </Link>
              <Button variant="outline" size="sm" onClick={() => handleDelete(p.id)}>Delete</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
