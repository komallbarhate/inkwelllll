import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/write")({
  component: WritePage,
  head: () => ({ meta: [{ title: "Write — Inkwell" }] }),
});

const schema = z.object({
  title: z.string().trim().min(1, "Title required").max(200),
  content: z.string().trim().min(1, "Content required").max(20000),
  excerpt: z.string().trim().max(280).optional(),
});

function WritePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const data = schema.parse({ title, content, excerpt: excerpt || undefined });
      setBusy(true);
      const { data: post, error } = await supabase
        .from("posts")
        .insert({
          author_id: user.id,
          title: data.title,
          content: data.content,
          excerpt: data.excerpt ?? null,
          published: true,
        })
        .select("id")
        .single();
      if (error) throw error;
      toast.success("Published!");
      navigate({ to: "/posts/$postId", params: { postId: post.id } });
    } catch (err) {
      const msg = err instanceof z.ZodError ? err.issues[0].message : err instanceof Error ? err.message : "Failed to publish";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-4xl font-black mb-8">New post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            placeholder="A title worth clicking on"
            className="text-2xl font-display font-bold h-auto py-3"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Input id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} maxLength={280} placeholder="A one-line teaser" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={20000}
            rows={18}
            placeholder="Write something worth reading…"
            required
            className="font-display text-lg leading-relaxed"
          />
          <p className="text-xs text-muted-foreground text-right">{content.length} / 20000</p>
        </div>
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="ghost" onClick={() => navigate({ to: "/" })}>Cancel</Button>
          <Button type="submit" disabled={busy}>{busy ? "Publishing…" : "Publish"}</Button>
        </div>
      </form>
    </div>
  );
}
