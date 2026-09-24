import { body, validationResult } from 'express-validator';
import {
    getAllOrganizations,
    getOrganizationById,
    createOrganization,
    updateOrganization,
} from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

// Logo automatically assigned to every new organization
const DEFAULT_LOGO_FILENAME = 'default-logo.svg';

// Server-side validation
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Organization name is required.').bail()
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters.'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required.').bail()
        .isLength({ max: 500 })
        .withMessage('Description must be 500 characters or fewer.'),
    body('contact_email')
        .trim()
        .notEmpty().withMessage('Contact email is required.').bail()
        .isEmail().withMessage('Please enter a valid email address.').bail()
        .isLength({ max: 255 })
        .withMessage('Email must be 255 characters or fewer.'),
];

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

const showNewOrganizationForm = (req, res) => {
    res.render('new-organization', { title: 'New Organization', errors: [], values: {} });
};

const processNewOrganizationForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('new-organization', {
                title: 'New Organization',
                errors: errors.array(),
                values: req.body,
            });
        }

        const { name, description, contact_email } = req.body;
        const newId = await createOrganization(name, description, contact_email, DEFAULT_LOGO_FILENAME);
        req.session.flash = { type: 'success', message: 'Organization created successfully.' };
        res.redirect(`/organization/${newId}`);
    } catch (err) {
        next(err);
    }
};

const showEditOrganizationForm = async (req, res, next) => {
    try {
        const organization = await getOrganizationById(req.params.id);

        if (!organization) {
            const err = new Error('Organization Not Found');
            err.status = 404;
            return next(err);
        }

        res.render('edit-organization', {
            title: 'Edit Organization',
            errors: [],
            organizationId: organization.organization_id,
            values: organization,
        });
    } catch (err) {
        next(err);
    }
};

const processEditOrganizationForm = async (req, res, next) => {
    try {
        const id = req.params.id;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render('edit-organization', {
                title: 'Edit Organization',
                errors: errors.array(),
                organizationId: id,
                values: req.body,
            });
        }

        const { name, description, contact_email } = req.body;
        const updatedId = await updateOrganization(id, name, description, contact_email);

        if (!updatedId) {
            const err = new Error('Organization Not Found');
            err.status = 404;
            return next(err);
        }

        req.session.flash = { type: 'success', message: 'Organization updated successfully.' };
        res.redirect(`/organization/${id}`);
    } catch (err) {
        next(err);
    }
};

export {
    showOrganizations,
    showOrganizationDetails,
    organizationValidation,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
};