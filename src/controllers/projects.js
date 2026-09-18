import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

// The number of service projects to show on the main projects page
const NUMBER_OF_PROJECTS_TO_SHOW = 5;

/**
 * Renders the main service projects page, listing the nearest
 * NUMBER_OF_PROJECTS_TO_SHOW service projects first.
 */
export const showProjectsPage = async (req, res) => {
  const projects = await getUpcomingProjects(NUMBER_OF_PROJECTS_TO_SHOW);

  const title = 'Service Projects';
  res.render('projects', { title, projects });
};

/**
 * Renders the service project details page for a single service
 * project, as identified by the `id` route parameter.
 */
export const showProjectDetailsPage = async (req, res, next) => {
  const { id } = req.params;
  const project = await getProjectDetails(id);

  if (!project) {
    const err = new Error('Service project not found');
    err.status = 404;
    return next(err);
  }

  const title = project.title;
  res.render('project', { title, project });
};

export default { showProjectsPage, showProjectDetailsPage };
