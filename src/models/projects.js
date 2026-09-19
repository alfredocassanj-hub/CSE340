import db from './db.js';

const getAllProjects = async () => {
    const query = `
        SELECT project_id, name, description, location, organization_id
        FROM public.project;
    `;

    const result = await db.query(query);

    return result.rows;
};

const getProjectById = async (projectId) => {
    const query = `
        SELECT project_id, name, description, location, organization_id
        FROM public.project
        WHERE project_id = $1;
    `;

    const result = await db.query(query, [projectId]);

    return result.rows[0];
};

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT project_id, name, description, location, organization_id
        FROM public.project
        WHERE organization_id = $1;
    `;

    const result = await db.query(query, [organizationId]);

    return result.rows;
};

export { getAllProjects, getProjectById, getProjectsByOrganizationId };