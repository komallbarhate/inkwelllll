import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
};

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Your profile — Inkwell" },
      { name: "description", content: "View and edit your Inkwell profile." },
    ],
  }),
});

function ProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    supabase
      .from("profiles")
      .select("id, username, display_name, bio")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        if (data) {
          setProfile(data);
          setUsername(data.username);
          setDisplayName(data.display_name ?? "");
          setBio(data.bio ?? "");
        }
        setFetching(false);
      });
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        username: username.trim(),
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-4xl font-black mb-2">Your profile</h1>
      <p className="text-muted-foreground mb-10">
        Signed in as <span className="font-medium text-ink">{user.email}</span>
      </p>

      {fetching ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              pattern="[a-z0-9_]+"
              title="Lowercase letters, numbers, and underscores only"
            />
            <p className="text-xs text-muted-foreground">
              Lowercase letters, numbers, and underscores. Must be unique.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_name">Display name</Label>
            <Input
              id="display_name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How your name appears on posts"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
              placeholder="A few words about yourself…"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save profile"}
            </Button>
            {profile && (
              <span className="text-sm text-muted-foreground">
                Member since profile created
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
