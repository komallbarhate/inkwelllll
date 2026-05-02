import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

type FeedPost = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  created_at: string;
  author: { username: string; display_name: string | null } | null;
};

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [posts, setPosts] = useState<FeedPost[] | null>(null);

  useEffect(() => {
    supabase
      .from("posts")
      .select("id, title, excerpt, content, created_at, author:profiles!posts_author_id_fkey(username, display_name)")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(30)
      .then(({ data }) => setPosts((data as unknown as FeedPost[]) ?? []));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6">
      {/* Hero */}
      <section className="py-20 md:py-28 border-b border-rule">
        <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-6">
          A quiet corner of the internet
        </p>
        <h1 className="font-display text-5xl md:text-7xl font-black leading-[0.95] text-ink max-w-3xl">
          Writing that <em className="text-primary not-italic">lingers</em>,<br />
          shared with people who read.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl">
          Inkwell is a place to publish essays, notes, and stories — without algorithms,
          without noise. Just words and the people who care about them.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            to="/auth"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
          >
            Start writing
          </Link>
          <a
            href="#feed"
            className="inline-flex items-center justify-center rounded-md border border-input px-6 py-3 text-sm font-semibold hover:bg-accent transition"
          >
            Read the feed
          </a>
        </div>
      </section>

      {/* Feed */}
      <section id="feed" className="py-16">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-display text-3xl font-bold">Latest dispatches</h2>
          <span className="text-sm text-muted-foreground">{posts?.length ?? 0} posts</span>
        </div>

        {posts === null ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : posts.length === 0 ? (
          <div className="border border-dashed border-rule rounded-lg p-12 text-center">
            <p className="font-display text-xl">No posts yet.</p>
            <p className="text-muted-foreground mt-2">Be the first to publish something.</p>
            <Link to="/auth" className="mt-4 inline-block underline underline-offset-4 text-primary">
              Sign up to write →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-rule">
            {posts.map((p) => (
              <article key={p.id} className="py-8 group">
                <Link to="/posts/$postId" params={{ postId: p.id }} className="block">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-ink group-hover:text-primary transition leading-tight">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground line-clamp-2">
                    {p.excerpt || p.content.slice(0, 200)}
                  </p>
                  <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
                    <span className="font-medium text-ink">
                      {p.author?.display_name || p.author?.username || "Anonymous"}
                    </span>
                    <span>·</span>
                    <span>{formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
