import db from './db.js';

const getAllOrganizations = async () => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM public.organization;
    `;

    const result = await db.query(query);

    return result.rows;
};

const getOrganizationById = async (organizationId) => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM public.organization
        WHERE organization_id = $1;
    `;

    const result = await db.query(query, [organizationId]);

    return result.rows[0];
};

const createOrganization = async (name, description, contactEmail, logoFilename) => {
    const query = `
        INSERT INTO public.organization (name, description, contact_email, logo_filename)
        VALUES ($1, $2, $3, $4)
        RETURNING organization_id;
    `;

    const result = await db.query(query, [name, description, contactEmail, logoFilename]);

    return result.rows[0].organization_id;
};

// The logo is not editable, so it is left untouched on update
const updateOrganization = async (organizationId, name, description, contactEmail) => {
    const query = `
        UPDATE public.organization
        SET name = $1, description = $2, contact_email = $3
        WHERE organization_id = $4
        RETURNING organization_id;
    `;

    const result = await db.query(query, [name, description, contactEmail, organizationId]);

    return result.rows[0]?.organization_id || null;
};

export {
    getAllOrganizations,
    getOrganizationById,
    createOrganization,
    updateOrganization,
};