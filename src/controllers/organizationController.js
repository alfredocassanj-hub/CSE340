import { getAllOrganizations, getOrganizationById } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

const showOrganizations = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('organizations', { title: 'Our Partner Organizations', organizations });
    } catch (err) {
        next(err);
    }
};

const showOrganizationDetails = async (req, res, next) => {
    try {
        const organizationId = req.params.id;
        const organization = await getOrganizationById(organizationId);

        if (!organization) {
            const err = new Error('Organization Not Found');
            err.status = 404;
            return next(err);
        }

        const projects = await getProjectsByOrganizationId(organizationId);

        res.render('organization', { title: organization.name, organization, projects });
    } catch (err) {
        next(err);
    }
};

export { showOrganizations, showOrganizationDetails };