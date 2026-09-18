import db from './db.js'

const getAllProjects = async () => {
  const query = `
    SELECT project_id, organization_id, title, description, location, project_date
    FROM service_projects;
  `;

  const result = await db.query(query);
  return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
    SELECT project_id, organization_id, title, description, location, project_date
    FROM service_projects
    WHERE organization_id = $1;
  `;

  const result = await db.query(query, [organizationId]);
  return result.rows;
};

/**
 * Retrieves service projects ordered by date, with the nearest projects first.
 * Includes the partner organization's name via a join.
 *
 * @param {number} number_of_projects - the maximum number of projects to return
 * @returns {Promise<Array>} an array of upcoming service project objects
 */
const getUpcomingProjects = async (number_of_projects) => {
  const query = `
    SELECT
      sp.project_id,
      sp.title,
      sp.description,
      sp.project_date AS date,
      sp.location,
      sp.organization_id,
      o.name AS organization_name
    FROM service_projects sp
    JOIN organizations o
      ON sp.organization_id = o.organization_id
    ORDER BY sp.project_date ASC
    LIMIT $1;
  `;

  const result = await db.query(query, [number_of_projects]);
  return result.rows;
};

/**
 * Retrieves a single service project by its ID, including the
 * partner organization's name via a join.
 *
 * @param {number|string} id - the ID of the service project to retrieve
 * @returns {Promise<Object|undefined>} the service project object, or
 *   undefined if no project with that ID exists
 */
const getProjectDetails = async (id) => {
  const query = `
    SELECT
      sp.project_id,
      sp.title,
      sp.description,
      sp.project_date AS date,
      sp.location,
      sp.organization_id,
      o.name AS organization_name
    FROM service_projects sp
    JOIN organizations o
      ON sp.organization_id = o.organization_id
    WHERE sp.project_id = $1;
  `;

  const result = await db.query(query, [id]);
  return result.rows[0];
};

export {
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails,
};

export default {
  getAllProjects,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails,
};
