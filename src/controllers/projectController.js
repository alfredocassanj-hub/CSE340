import { body, validationResult } from 'express-validator';
import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
} from '../models/projects.js';
import {
    getAllCategories,
    getCategoriesByProjectId,
    updateCategoryAssignments,
} from '../models/categories.js';
import { getAllOrganizations, getOrganizationById } from '../models/organizations.js';

// Server-side validation
const projectValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Project name is required.').bail()
        .isLength({ min: 3, max: 150 })
        .withMessage('Project name must be between 3 and 150 characters.'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required.').bail()
        .isLength({ max: 500 })
        .withMessage('Description must be 500 characters or fewer.'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required.').bail()
        .isLength({ max: 150 })
        .withMessage('Location must be 150 characters or fewer.'),
    body('organization_id')
        .notEmpty().withMessage('Please choose an organization.').bail()
        .isInt({ min: 1 }).withMessage('Invalid organization.').bail()
        .custom(async (value) => {
            const organization = await getOrganizationById(value);
            if (!organization) {
                throw new Error('The selected organization does not exist.');
            }
            return true;
        }),
];

const showProjects = async (req, res, next) => {
    try {
        const projects = await getAllProjects();
        res.render('projects', { title: 'Our Service Projects', projects });
    } catch (err) {
        next(err);
    }
};

const showProjectDetails = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectById(projectId);

        if (!project) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        const organization = await getOrganizationById(project.organization_id);
        const categories = await getCategoriesByProjectId(projectId);

        res.render('project', { title: project.name, project, organization, categories });
    } catch (err) {
        next(err);
    }
};

const showNewProjectForm = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('new-project', {
            title: 'New Project',
            errors: [],
            values: {},
            organizations,
        });
    } catch (err) {
        next(err);
    }
};

const processNewProjectForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const organizations = await getAllOrganizations();
            return res.status(400).render('new-project', {
                title: 'New Project',
                errors: errors.array(),
                values: req.body,
                organizations,
            });
        }

        const { name, description, location, organization_id } = req.body;
        const newId = await createProject(name, description, location, organization_id);
        req.session.flash = { type: 'success', message: 'Project created successfully.' };
        res.redirect(`/project/${newId}`);
    } catch (err) {
        next(err);
    }
};

const showEditProjectForm = async (req, res, next) => {
    try {
        const project = await getProjectById(req.params.id);

        if (!project) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        const organizations = await getAllOrganizations();

        res.render('edit-project', {
            title: 'Edit Project',
            errors: [],
            projectId: project.project_id,
            values: project,
            organizations,
        });
    } catch (err) {
        next(err);
    }
};

const processEditProjectForm = async (req, res, next) => {
    try {
        const id = req.params.id;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const organizations = await getAllOrganizations();
            return res.status(400).render('edit-project', {
                title: 'Edit Project',
                errors: errors.array(),
                projectId: id,
                values: req.body,
                organizations,
            });
        }

        const { name, description, location, organization_id } = req.body;
        const updatedId = await updateProject(id, name, description, location, organization_id);

        if (!updatedId) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        req.session.flash = { type: 'success', message: 'Project updated successfully.' };
        res.redirect(`/project/${id}`);
    } catch (err) {
        next(err);
    }
};

const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const project = await getProjectById(projectId);

        if (!project) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        const categories = await getAllCategories();
        const assigned = await getCategoriesByProjectId(projectId);
        const assignedIds = assigned.map((category) => category.category_id);

        res.render('assign-categories', {
            title: 'Assign Categories',
            project,
            categories,
            assignedIds,
        });
    } catch (err) {
        next(err);
    }
};

const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const project = await getProjectById(projectId);

        if (!project) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        // No box checked = undefined, one = string, several = array
        const raw = req.body.categoryIds;
        const selected = raw === undefined ? [] : Array.isArray(raw) ? raw : [raw];

        // Only accept ids of categories that exist
        const validIds = new Set((await getAllCategories()).map((c) => c.category_id));
        const categoryIds = selected.map(Number).filter((id) => validIds.has(id));

        await updateCategoryAssignments(projectId, categoryIds);

        req.session.flash = { type: 'success', message: 'Project categories updated successfully.' };
        res.redirect(`/project/${projectId}`);
    } catch (err) {
        next(err);
    }
};

export {
    showProjects,
    showProjectDetails,
    projectValidation,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
};