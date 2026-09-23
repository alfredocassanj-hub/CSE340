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

const createProject = async (name, description, location, organizationId) => {
    const query = `
        INSERT INTO public.project (name, description, location, organization_id)
        VALUES ($1, $2, $3, $4)
        RETURNING project_id;
    `;

    const result = await db.query(query, [name, description, location, organizationId]);

    return result.rows[0].project_id;
};

const updateProject = async (projectId, name, description, location, organizationId) => {
    const query = `
        UPDATE public.project
        SET name = $1, description = $2, location = $3, organization_id = $4
        WHERE project_id = $5
        RETURNING project_id;
    `;

    const result = await db.query(query, [name, description, location, organizationId, projectId]);

    return result.rows[0]?.project_id || null;
};

export {
    getAllProjects,
    getProjectById,
    getProjectsByOrganizationId,
    createProject,
    updateProject,
};