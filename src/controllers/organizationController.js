import { body, validationResult } from 'express-validator';
import {
    getAllOrganizations,
    getOrganizationById,
    createOrganization,
    updateOrganization,
} from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

// Validação do servidor
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('O nome da organização é obrigatório.').bail()
        .isLength({ min: 3, max: 150 })
        .withMessage('O nome da organização deve ter entre 3 e 150 caracteres.'),
    body('description')
        .trim()
        .notEmpty().withMessage('A descrição é obrigatória.').bail()
        .isLength({ max: 500 })
        .withMessage('A descrição deve ter no máximo 500 caracteres.'),
    body('contact_email')
        .trim()
        .notEmpty().withMessage('O email de contacto é obrigatório.').bail()
        .isEmail().withMessage('Introduz um email válido.').bail()
        .isLength({ max: 255 })
        .withMessage('O email deve ter no máximo 255 caracteres.'),
    body('logo_filename')
        .trim()
        .notEmpty().withMessage('O nome do ficheiro do logótipo é obrigatório.').bail()
        .isLength({ max: 255 })
        .withMessage('O nome do ficheiro deve ter no máximo 255 caracteres.'),
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
    res.render('new-organization', { title: 'Nova Organização', errors: [], values: {} });
};

const processNewOrganizationForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('new-organization', {
                title: 'Nova Organização',
                errors: errors.array(),
                values: req.body,
            });
        }

        const { name, description, contact_email, logo_filename } = req.body;
        const newId = await createOrganization(name, description, contact_email, logo_filename);
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
            title: 'Editar Organização',
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
                title: 'Editar Organização',
                errors: errors.array(),
                organizationId: id,
                values: req.body,
            });
        }

        const { name, description, contact_email, logo_filename } = req.body;
        const updatedId = await updateOrganization(id, name, description, contact_email, logo_filename);

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