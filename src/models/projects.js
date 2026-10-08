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

const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO public.project_volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING;
    `;

    await db.query(query, [userId, projectId]);
};

const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM public.project_volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;

    await db.query(query, [userId, projectId]);
};

const isVolunteer = async (userId, projectId) => {
    const query = `
        SELECT 1
        FROM public.project_volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;

    const result = await db.query(query, [userId, projectId]);

    return result.rows.length > 0;
};

const getVolunteerProjects = async (userId) => {
    const query = `
        SELECT
            p.project_id,
            p.name,
            p.description,
            p.location,
            p.organization_id
        FROM public.project p
        INNER JOIN public.project_volunteer pv
            ON p.project_id = pv.project_id
        WHERE pv.user_id = $1
        ORDER BY p.name;
    `;

    const result = await db.query(query, [userId]);

    return result.rows;
};

export {
    getAllProjects,
    getProjectById,
    getProjectsByOrganizationId,
    createProject,
    updateProject,
    addVolunteer,
    removeVolunteer,
    isVolunteer,
    getVolunteerProjects,
};
