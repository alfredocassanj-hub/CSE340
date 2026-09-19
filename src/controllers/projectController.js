import { getAllProjects, getProjectById } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getOrganizationById } from '../models/organizations.js';

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

export { showProjects, showProjectDetails };