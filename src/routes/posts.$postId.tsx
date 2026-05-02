import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_id: string;
  author: { username: string; display_name: string | null; bio: string | null } | null;
};

export const Route = createFileRoute("/posts/$postId")({
  component: PostPage,
});

function PostPage() {
  const { postId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabase
      .from("posts")
      .select("id, title, content, created_at, author_id, author:profiles!posts_author_id_fkey(username, display_name, bio)")
      .eq("id", postId)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) setNotFound(true);
        else setPost(data as unknown as Post);
      });
  }, [postId]);

  const handleDelete = async () => {
    if (!post || !confirm("Delete this post?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    navigate({ to: "/" });
  };

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="font-display text-3xl">Post not found</h1>
        <Link to="/" className="mt-4 inline-block underline">Back home</Link>
      </div>
    );
  }
  if (!post) return <div className="mx-auto max-w-2xl px-6 py-20 text-muted-foreground">Loading…</div>;

  const isAuthor = user?.id === post.author_id;

  return (
    <article className="mx-auto max-w-2xl px-6 py-12">
      <header className="mb-10 pb-8 border-b border-rule">
        <h1 className="font-display text-4xl md:text-5xl font-black leading-tight text-ink">{post.title}</h1>
        <div className="mt-6 flex items-center justify-between text-sm">
          <div>
            <p className="font-medium text-ink">
              {post.author?.display_name || post.author?.username || "Anonymous"}
            </p>
            <p className="text-muted-foreground">{format(new Date(post.created_at), "MMMM d, yyyy")}</p>
          </div>
          {isAuthor && (
            <Button variant="outline" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </div>
      </header>

      <div className="font-display text-lg leading-[1.75] text-ink whitespace-pre-wrap">
        {post.content}
      </div>

      {post.author?.bio && (
        <div className="mt-16 pt-8 border-t border-rule">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">About the author</p>
          <p className="font-display text-lg">{post.author.bio}</p>
        </div>
      )}
    </article>
  );
}
