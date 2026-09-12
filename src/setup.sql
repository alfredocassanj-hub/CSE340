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
    location VARCHAR(150) NOT NULL,
    organization_id INTEGER NOT NULL,
    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
);

-- Tabela category
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Tabela de ligação project_category (muitos-para-muitos)
CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_pc_project
        FOREIGN KEY (project_id)
        REFERENCES project(project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_pc_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON DELETE CASCADE
);

-- Dados: organizations (15 no total)
INSERT INTO organization (name, description, contact_email, logo_filename) VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png'),
('Helping Hands Alliance', 'A community organization coordinating volunteers for disaster relief and emergency support.', 'info@helpinghandsalliance.org', 'brightfuture-logo.png'),
('Youth Empowerment Network', 'A group dedicated to mentoring and providing educational resources to at-risk youth.', 'contact@youthempowerment.org', 'greenharvest-logo.png'),
('Clean Water Coalition', 'An organization working to provide clean water access to underserved communities.', 'hello@cleanwatercoalition.org', 'unityserve-logo.png'),
('Senior Support Circle', 'A nonprofit providing companionship, transportation, and errands support for elderly residents.', 'info@seniorsupportcircle.org', 'brightfuture-logo.png'),
('Animal Rescue Partners', 'A volunteer network rescuing, sheltering, and rehoming abandoned and injured animals.', 'contact@animalrescuepartners.org', 'greenharvest-logo.png'),
('Literacy for All', 'An organization promoting adult and childhood literacy through tutoring and book drives.', 'hello@literacyforall.org', 'unityserve-logo.png'),
('Homeless Outreach Project', 'A community group providing meals, clothing, and shelter referrals for people experiencing homelessness.', 'info@homelessoutreach.org', 'brightfuture-logo.png'),
('Veterans Support Network', 'A nonprofit assisting veterans with housing, job placement, and mental health resources.', 'contact@veteranssupport.org', 'greenharvest-logo.png'),
('Community Health Advocates', 'An organization offering free health screenings and wellness education in local neighborhoods.', 'hello@communityhealthadvocates.org', 'unityserve-logo.png'),
('Renewable Energy Volunteers', 'A group promoting solar energy adoption and energy efficiency in low-income households.', 'info@renewableenergyvolunteers.org', 'brightfuture-logo.png'),
('Foster Care Champions', 'A nonprofit supporting foster children and families through mentorship and resource drives.', 'contact@fostercarechampions.org', 'greenharvest-logo.png'),
('Disaster Relief Corps', 'A volunteer organization mobilizing rapid response teams for natural disaster recovery efforts.', 'hello@disasterreliefcorps.org', 'unityserve-logo.png');

-- Dados: projects (associados às 3 primeiras organizations)
INSERT INTO project (name, description, location, organization_id) VALUES
('Community Center Renovation', 'Renovating a local community center to provide a safe gathering space for neighborhood families.', 'Boise, Idaho', 1),
('Urban Garden Initiative', 'Building raised-bed gardens in vacant lots to provide fresh produce for underserved neighborhoods.', 'Rexburg, Idaho', 2),
('Neighborhood Cleanup Drive', 'Organizing volunteers to clean up parks, streets, and public spaces across the city.', 'Idaho Falls, Idaho', 3);

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