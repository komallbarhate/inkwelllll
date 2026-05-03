# Inkwell

A modern, full-stack blog platform where writers can share their thoughts and readers can discover stories worth reading. Built with a focus on clean typography, an editorial reading experience, and a frictionless writing flow.

🌐 **Live website:** [https://inkwelllll.lovable.app](https://inkwelllll.lovable.app)

## About

Inkwell is a fully functional blogging platform that lets anyone sign up, write, and publish posts. Each user gets a personal profile, a private dashboard to manage their work, and a public feed where their published stories appear alongside everyone else's.

### Features

- ✍️ **Write & Publish** — Distraction-free editor for creating posts with title, excerpt, and content
- 📰 **Public Feed** — Browse the latest published posts from every author
- 👤 **User Profiles** — Customizable username, display name, and bio
- 🔐 **Real Authentication** — Email/password and Google sign-in
- 📊 **Personal Dashboard** — Manage and delete your own posts
- 🛡️ **Row-Level Security** — Users can only edit their own data; published posts are public

## Tech Stack

- **Frontend:** React 19 + TanStack Start (SSR), Vite 7, Tailwind CSS v4
- **Backend & Database:** Lovable Cloud (managed Postgres + Auth)
- **Authentication:** Email/Password + Google OAuth
- **UI:** shadcn/ui components, Fraunces + Inter typography
- **Deployment:** Lovable Cloud hosting

## Getting Started (Local Dev)

```bash
bun install
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## License

MIT
