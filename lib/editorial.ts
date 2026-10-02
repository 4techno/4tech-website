import { featuredProjects } from './projects';
/** Homepage and project pages share one record. */
export const projects = featuredProjects.map((project,index) => ({ ...project, number: String(index+1).padStart(2,'0'), title: project.name, domain: project.category, summary: project.short, technologies: project.tech }));
