"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutTemplate,
  PanelTop,
  Rows3,
  Tag,
  KeyRound,
  Server,
  Database,
  Store,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

interface Template {
  title: string;
  description: string;
  topic: string;
  framework?: string;
  projectType?: string;
}

interface Category {
  id: string;
  label: string;
  icon: typeof LayoutTemplate;
  templates: Template[];
}

const CATEGORIES: Category[] = [
  {
    id: "hero",
    label: "Hero Sections",
    icon: LayoutTemplate,
    templates: [
      {
        title: "SaaS landing hero",
        description: "Headline, subheadline, CTA button, and dashboard preview image",
        topic: "A SaaS landing page hero section with a bold headline, supporting subheadline, a primary CTA button, and a dashboard preview image on the right",
        framework: "Next.js + Tailwind CSS",
        projectType: "Web app",
      },
      {
        title: "Local business hero",
        description: "Booking CTA with trust badges, ideal for salons and clinics",
        topic: "A hero section for a local business website (salon or clinic) with a warm headline, a prominent booking CTA button, and trust badges like ratings and years in service",
        framework: "HTML + Tailwind CSS",
        projectType: "Business website",
      },
      {
        title: "E-commerce banner",
        description: "Seasonal sale countdown with product highlight",
        topic: "An e-commerce hero banner with a seasonal sale countdown timer, a featured product image, and a shop-now button",
        framework: "React",
        projectType: "E-commerce",
      },
    ],
  },
  {
    id: "navbar",
    label: "Navbars",
    icon: PanelTop,
    templates: [
      {
        title: "Responsive navbar",
        description: "Logo, links, mobile hamburger menu, CTA button",
        topic: "A fully responsive navbar with logo on the left, nav links in the center, a CTA button on the right, and a mobile hamburger menu that slides in",
        framework: "Next.js + Tailwind CSS",
        projectType: "Web app",
      },
      {
        title: "Sticky scroll navbar",
        description: "Transparent-to-solid effect on scroll",
        topic: "A sticky navbar that starts transparent over a hero image and turns solid with a shadow once the user scrolls down",
        framework: "React",
        projectType: "Web app",
      },
      {
        title: "E-commerce navbar",
        description: "Search bar, cart icon, account dropdown",
        topic: "An e-commerce navbar with a search bar, a cart icon showing item count, and an account dropdown menu",
        framework: "Next.js",
        projectType: "E-commerce",
      },
    ],
  },
  {
    id: "footer",
    label: "Footers",
    icon: Rows3,
    templates: [
      {
        title: "Multi-column footer",
        description: "Company info, quick links, socials, newsletter",
        topic: "A multi-column footer with company info and logo, quick links, social media icons, and a newsletter signup form",
        framework: "Tailwind CSS",
        projectType: "Web app",
      },
      {
        title: "Minimal footer",
        description: "Copyright, links, back-to-top button",
        topic: "A minimal, clean footer with copyright text, a few essential links, and a back-to-top button",
        framework: "HTML + CSS",
        projectType: "Business website",
      },
    ],
  },
  {
    id: "pricing",
    label: "Pricing Sections",
    icon: Tag,
    templates: [
      {
        title: "3-tier SaaS pricing",
        description: "Monthly/yearly toggle, highlighted popular plan",
        topic: "A 3-tier pricing table with a monthly/yearly billing toggle, feature comparison checklist, and the middle plan highlighted as most popular",
        framework: "React + Tailwind CSS",
        projectType: "SaaS",
      },
      {
        title: "Local business packages",
        description: "Basic, Standard, Premium service packages",
        topic: "A simple pricing section for a local business offering Basic, Standard, and Premium service packages with clear feature lists",
        framework: "HTML + Tailwind CSS",
        projectType: "Business website",
      },
    ],
  },
  {
    id: "forms",
    label: "Forms",
    icon: KeyRound,
    templates: [
      {
        title: "Login / signup form",
        description: "Email, password, social login buttons",
        topic: "A clean login and signup form with email and password fields, validation messages, and social login buttons for Google and GitHub",
        framework: "React + Tailwind CSS",
        projectType: "Web app",
      },
      {
        title: "Contact form",
        description: "Name, email, message, with validation",
        topic: "A contact form with name, email, and message fields, inline validation, and a success confirmation state after submission",
        framework: "Next.js",
        projectType: "Business website",
      },
    ],
  },
  {
    id: "backend",
    label: "Backend & APIs",
    icon: Server,
    templates: [
      {
        title: "Auth system (JWT)",
        description: "Signup, login, refresh tokens, password reset",
        topic: "A JWT-based authentication system with signup, login, refresh token rotation, and a secure password reset flow",
        framework: "Node.js + Express",
        projectType: "API",
      },
      {
        title: "Supabase auth setup",
        description: "Google + email/password login for Next.js",
        topic: "Supabase Auth integration for a Next.js app supporting Google OAuth and email/password login with protected routes",
        framework: "Next.js + Supabase",
        projectType: "Web app",
      },
      {
        title: "REST API for a blog",
        description: "Posts, comments, users with pagination",
        topic: "A RESTful API for a blog platform with endpoints for posts, comments, and users, including pagination and filtering",
        framework: "Node.js + Express",
        projectType: "API",
      },
    ],
  },
  {
    id: "database",
    label: "Database Schemas",
    icon: Database,
    templates: [
      {
        title: "Multi-tenant SaaS schema",
        description: "Users, organizations, and roles",
        topic: "A PostgreSQL database schema for a multi-tenant SaaS app with users, organizations, roles, and permissions",
        framework: "PostgreSQL",
        projectType: "Database",
      },
      {
        title: "Booking system schema",
        description: "Appointments, services, staff, customers",
        topic: "A database schema for an appointment booking system with tables for services, staff, customers, and appointments",
        framework: "PostgreSQL",
        projectType: "Database",
      },
    ],
  },
  {
    id: "business",
    label: "Local Business Websites",
    icon: Store,
    templates: [
      {
        title: "Salon website",
        description: "Home, services, gallery, booking, contact",
        topic: "Complete website copy and page structure for a hair and beauty salon: home, services with pricing, photo gallery, online booking, and contact page",
        framework: "HTML + Tailwind CSS",
        projectType: "Business website",
      },
      {
        title: "Clinic website",
        description: "Home, doctors, services, appointment booking",
        topic: "Complete website copy and page structure for a medical clinic: home, meet the doctors, services offered, and an appointment booking page",
        framework: "HTML + Tailwind CSS",
        projectType: "Business website",
      },
      {
        title: "Tuition center website",
        description: "Home, courses, faculty, admissions, contact",
        topic: "Complete website copy and page structure for a tuition center: home, courses offered, faculty introductions, admissions process, and contact page",
        framework: "HTML + Tailwind CSS",
        projectType: "Business website",
      },
    ],
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]!.id);

  const category = CATEGORIES.find((c) => c.id === activeCategory) ?? CATEGORIES[0]!;

  function useTemplate(t: Template) {
    const params = new URLSearchParams();
    params.set("topic", t.topic);
    if (t.framework) params.set("framework", t.framework);
    if (t.projectType) params.set("projectType", t.projectType);
    router.push(`/dashboard/generate?${params.toString()}`);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-forge-50">Templates</h1>
        <p className="mt-1 text-sm text-forge-400">
          Pick a category, choose a ready-made option, and we&apos;ll pre-fill the forge for you.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
              c.id === activeCategory
                ? "border-ember-500/40 bg-ember-500/10 text-ember-500"
                : "border-forge-800 text-forge-400 hover:border-forge-700 hover:text-forge-200"
            }`}
          >
            <c.icon className="h-4 w-4" />
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {category.templates.map((t) => (
          <Card key={t.title}>
            <CardContent className="flex h-full flex-col justify-between pt-6">
              <div>
                <h3 className="font-display text-base font-semibold text-forge-50">{t.title}</h3>
                <p className="mt-1.5 text-sm text-forge-400">{t.description}</p>
              </div>
              <Button variant="secondary" onClick={() => useTemplate(t)} className="mt-4 w-full">
                Use this template <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}