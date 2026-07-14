// Hand-authored to match migrations 001-004. Regenerate with `npm run db:types`
// once the Supabase CLI is linked locally for a fully generated version.

export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";
export type PromptStatus = "draft" | "published" | "archived" | "flagged";
export type UserRole = "user" | "admin" | "moderator";
export type Plan = "free" | "pro" | "team";
export type GenerationMode = "generate" | "improve" | "convert";
export type NotificationType = "like" | "comment" | "follow" | "system" | "mention";

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website_url: string | null;
  twitter_url: string | null;
  github_url: string | null;
  role: UserRole;
  plan: Plan;
  prompts_generated_count: number;
  monthly_generation_quota: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  usage_count: number;
  created_at: string;
}

export interface Prompt {
  id: string;
  owner_id: string;
  title: string;
  slug: string;
  description: string | null;
  ai_tool: string;
  category_id: string | null;
  prompt_type: string | null;
  project_type: string | null;
  framework: string | null;
  programming_language: string | null;
  tone: string | null;
  difficulty: Difficulty | null;
  output_length: string | null;
  extra_requirements: string | null;
  content: string;
  objective: string | null;
  context: string | null;
  requirements: string | null;
  constraints: string | null;
  output_format: string | null;
  best_practices: string | null;
  examples: string | null;
  edge_cases: string | null;
  is_public: boolean;
  is_featured: boolean;
  status: PromptStatus;
  view_count: number;
  like_count: number;
  bookmark_count: number;
  comment_count: number;
  fork_count: number;
  forked_from: string | null;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_color: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  prompt_id: string;
  author_id: string;
  parent_id: string | null;
  body: string;
  is_edited: boolean;
  status: "visible" | "hidden" | "flagged";
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  actor_id: string | null;
  prompt_id: string | null;
  comment_id: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface GenerationHistoryRow {
  id: string;
  user_id: string;
  mode: GenerationMode;
  input_params: Record<string, unknown>;
  output_prompt_id: string | null;
  raw_output: string | null;
  tokens_used: number | null;
  model: string | null;
  created_at: string;
}

// Minimal Supabase Database interface — extend per-table as query needs grow.
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string; username: string }; Update: Partial<Profile> };
      categories: { Row: Category; Insert: Partial<Category>; Update: Partial<Category> };
      tags: { Row: Tag; Insert: Partial<Tag>; Update: Partial<Tag> };
      prompts: { Row: Prompt; Insert: Partial<Prompt> & { owner_id: string; title: string; slug: string; content: string }; Update: Partial<Prompt> };
      collections: { Row: Collection; Insert: Partial<Collection> & { owner_id: string; name: string; slug: string }; Update: Partial<Collection> };
      comments: { Row: Comment; Insert: Partial<Comment> & { prompt_id: string; author_id: string; body: string }; Update: Partial<Comment> };
      notifications: { Row: Notification; Insert: Partial<Notification>; Update: Partial<Notification> };
      generation_history: { Row: GenerationHistoryRow; Insert: Partial<GenerationHistoryRow> & { user_id: string; mode: GenerationMode }; Update: Partial<GenerationHistoryRow> };
    };
  };
}
