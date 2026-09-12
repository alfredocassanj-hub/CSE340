import db from './db.js';

const getAllProjects = async () => {
    const query = `
        SELECT project_id, name, description, location, organization_id
        FROM public.project;
    `;

    const result = await db.query(query);

    return result.rows;
};

export { getAllProjects };