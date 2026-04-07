export interface Skill {
  id: string;
  title: string;
  level: number;
  icon: string;
  description: string;
  tags: string[];
}

export interface Post {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  image: string;
}

export const skills: Skill[] = [
  { 
    id: '1', 
    title: 'Angular Expert', 
    level: 98, 
    icon: '🚀', 
    description: 'Advanced architecture, Signals, and RxJS orchestration for enterprise apps.', 
    tags: ['Performance', 'Scalability'] 
  },
  { 
    id: '2', 
    title: 'Astro.js', 
    level: 92, 
    icon: '👩‍🚀', 
    description: 'Island architecture and high-performance SSG/SSR for modern web.', 
    tags: ['Lighthouse 100', 'DX'] 
  },
  { 
    id: '3', 
    title: 'TypeScript', 
    level: 95, 
    icon: '📘', 
    description: 'Strict typing for enterprise-grade reliability and better maintainability.', 
    tags: ['Safety', 'Productivity'] 
  },
  { 
    id: '4', 
    title: 'UX/UI Design', 
    level: 88, 
    icon: '🎨', 
    description: 'Creating sophisticated, accessible digital products that users love.', 
    tags: ['Figma', 'A11y'] 
  },
];

export const blogPosts: Post[] = [
  {
    title: "The Future of Web Performance in 2026",
    excerpt: "Why the 'Less is More' philosophy is dominating the modern web stack, focusing on zero-JS runtimes and server-side excellence.",
    date: "2026-02-15",
    slug: "future-web-performance",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Accessibility as a Design Requirement",
    excerpt: "Moving beyond checklists to create truly inclusive digital experiences for everyone, regardless of their hardware or abilities.",
    date: "2026-01-10",
    slug: "a11y-design-requirement",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&w=800&q=80"
  }
];
