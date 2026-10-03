export const requestCategories = [
  "College project support", "School project support", "Startup prototyping",
  "Technical training", "Something else",
] as const;

export type RequestInput = { title: string; category: string; timeline: string; details: string };
