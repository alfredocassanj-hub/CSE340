-- Remove tabelas existentes (ordem inversa às dependências)
DROP TABLE IF EXISTS project_category CASCADE;
DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS organization CASCADE;

-- Tabela organization
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(100) NOT NULL,
    logo_filename VARCHAR(100) NOT NULL
);

-- Tabela project
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    organization_id INTEGER NOT NULL REFERENCES organization(organization_id)
);

-- Tabela category
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Tabela de ligação project_category (muitos-para-muitos)
CREATE TABLE project_category (
    project_id INTEGER NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES category(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- Dados: organizations
INSERT INTO organization (name, description, contact_email, logo_filename) VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- Dados: projects (um por organização)
INSERT INTO project (name, description, organization_id) VALUES
('Community Center Renovation', 'Renovating a local community center to provide a safe gathering space for neighborhood families.', 1),
('Urban Garden Initiative', 'Building raised-bed gardens in vacant lots to provide fresh produce for underserved neighborhoods.', 2),
('Neighborhood Cleanup Drive', 'Organizing volunteers to clean up parks, streets, and public spaces across the city.', 3);

-- Dados: categories
INSERT INTO category (name) VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');

-- Associar projects a categories
INSERT INTO project_category (project_id, category_id) VALUES
(1, 3), -- Community Center Renovation -> Community Service
(1, 2), -- Community Center Renovation -> Educational
(2, 1), -- Urban Garden Initiative -> Environmental
(2, 4), -- Urban Garden Initiative -> Health and Wellness
(3, 3), -- Neighborhood Cleanup Drive -> Community Service
(3, 1); -- Neighborhood Cleanup Drive -> Environmental