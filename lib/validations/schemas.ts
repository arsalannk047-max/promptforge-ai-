import { z } from "zod";

export const aiTools = [
  "chatgpt",
  "claude",
  "gemini",
  "cursor",
  "github_copilot",
  "meta_ai",
  "canva_ai",
  "midjourney",
] as const;

export const generatePromptSchema = z.object({
  aiTool: z.enum(aiTools),
  categoryId: z.string().uuid().optional(),
  promptType: z.string().min(1, "Choose a prompt type"),
  projectType: z.string().optional(),
  framework: z.string().optional(),
  programmingLanguage: z.string().optional(),
  tone: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  outputLength: z.enum(["short", "medium", "long"]),
  extraRequirements: z.string().max(2000).optional(),
  topic: z.string().min(3, "Tell us what the prompt is for").max(300),
});
export type GeneratePromptInput = z.infer<typeof generatePromptSchema>;

export const improvePromptSchema = z.object({
  originalPrompt: z.string().min(10, "Paste the prompt you want improved"),
  mode: z.enum(["beginner", "professional", "expert", "detailed", "short"]),
});
export type ImprovePromptInput = z.infer<typeof improvePromptSchema>;

export const convertPromptSchema = z.object({
  originalPrompt: z.string().min(10),
  sourceTool: z.enum(aiTools),
  targetTool: z.enum(aiTools),
});
export type ConvertPromptInput = z.infer<typeof convertPromptSchema>;

export const savePromptSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().max(500).optional(),
  content: z.string().min(10),
  categoryId: z.string().uuid().optional(),
  tags: z.array(z.string()).max(10).optional(),
  isPublic: z.boolean().default(false),
});
export type SavePromptInput = z.infer<typeof savePromptSchema>;

export const authSchema = {
  signUp: z
    .object({
      email: z.string().email(),
      password: z.string().min(8, "At least 8 characters"),
      confirmPassword: z.string(),
      username: z
        .string()
        .min(3)
        .max(24)
        .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, underscores only"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }),
  login: z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
  }),
  forgotPassword: z.object({
    email: z.string().email(),
  }),
};

export const commentSchema = z.object({
  promptId: z.string().uuid(),
  body: z.string().min(1).max(2000),
  parentId: z.string().uuid().optional(),
});
