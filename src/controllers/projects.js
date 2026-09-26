import { getUpcomingProjects, getProjectDetails, createProject, updateProject } from '../models/projects.js';
import { getCategoriesForProject } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];
// The number of service projects to show on the main projects page
const NUMBER_OF_PROJECTS_TO_SHOW = 5;

/**
 * Renders the main service projects page, listing the nearest
 * NUMBER_OF_PROJECTS_TO_SHOW service projects first.
 */
const showProjectsPage = async (req, res) => {
  const projects = await getUpcomingProjects(NUMBER_OF_PROJECTS_TO_SHOW);

  const title = 'Service Projects';
  res.render('projects', { title, projects });
};

/**
 * Renders the service project details page for a single service
 * project, as identified by the `id` route parameter.
 */
const showProjectDetailsPage = async (req, res, next) => {
  const { id } = req.params;
  const project = await getProjectDetails(id);

  if (!project) {
    const err = new Error('Service project not found');
    err.status = 404;
    return next(err);
  }

  const title = project.title;
  const categories = await getCategoriesForProject(id);
  res.render('project', { title, project, categories });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {
    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new-project');
    }

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
}

/**
 * Renders the edit form for an existing service project, pre-populated
 * with its current data and a dropdown of all organizations.
 */
const showEditProjectForm = async (req, res, next) => {
    const { id } = req.params;
    const projectDetails = await getProjectDetails(id);

    if (!projectDetails) {
        const err = new Error('Service project not found');
        err.status = 404;
        return next(err);
    }

    const organizations = await getAllOrganizations();
    const title = 'Edit Service Project';

    // Format the date as YYYY-MM-DD so it pre-fills an <input type="date">
    const formattedDate = new Date(projectDetails.date).toISOString().split('T')[0];

    res.render('edit-project', { title, projectDetails, organizations, formattedDate });
};

const processEditProjectForm = async (req, res) => {
    const { id } = req.params;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-project/${id}`);
    }

    const { title, description, location, date, organizationId } = req.body;

    try {
        await updateProject(id, title, description, location, date, organizationId);
        req.flash('success', 'Service project updated successfully!');
        res.redirect(`/project/${id}`);
    } catch (error) {
        console.error('Error updating service project:', error);
        req.flash('error', 'There was an error updating the service project.');
        res.redirect(`/edit-project/${id}`);
    }
};

export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, projectValidation, processNewProjectForm, showEditProjectForm, processEditProjectForm };