-- Create the organizations table
CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- Insert sample data
INSERT INTO organizations (name, description, contact_email, logo_filename)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);



-- Create the service_projects table

CREATE TABLE service_projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations (organization_id)
);

-- BrightFuture Builders Projects (organization_id = 1)

INSERT INTO service_projects
(organization_id, title, description, location, project_date)
VALUES
(1, 'Community Center Renovation',
 'Renovation of an aging community center to improve accessibility and safety.',
 'Port Harcourt', '2026-01-15'),

(1, 'School Roof Replacement',
 'Replacing damaged roofing materials at a local primary school.',
 'Obio-Akpor', '2026-02-20'),

(1, 'Clean Water Access Initiative',
 'Construction of water collection and storage systems for underserved communities.',
 'Ahoada', '2026-03-10'),

(1, 'Bridge Repair Project',
 'Repair and reinforcement of a pedestrian bridge used by local residents.',
 'Bonny', '2026-04-05'),

(1, 'Youth Skills Workshop Facility',
 'Building a training facility for vocational education programs.',
 'Eleme', '2026-05-18');

-- GreenHarvest Growers Projects (organization_id = 2)

INSERT INTO service_projects
(organization_id, title, description, location, project_date)
VALUES
(2, 'Urban Garden Launch',
 'Establishing a community vegetable garden in an urban neighborhood.',
 'Port Harcourt', '2026-01-22'),

(2, 'School Farming Program',
 'Teaching students sustainable farming techniques through hands-on activities.',
 'Oyigbo', '2026-02-12'),

(2, 'Community Compost Initiative',
 'Creating compost collection and education programs.',
 'Ikwerre', '2026-03-08'),

(2, 'Food Sustainability Workshop',
 'Hosting workshops on growing food in limited spaces.',
 'Rumuokoro', '2026-04-16'),

(2, 'Neighborhood Greenhouse Project',
 'Building a greenhouse for year-round food production.',
 'Choba', '2026-05-25');

-- UnityServe Volunteers Projects (organization_id = 3)

INSERT INTO service_projects
(organization_id, title, description, location, project_date)
VALUES
(3, 'Charity Food Drive',
 'Coordinating volunteers to distribute food packages to families in need.',
 'Port Harcourt', '2026-01-10'),

(3, 'Community Cleanup Day',
 'Organizing volunteers to clean public spaces and parks.',
 'Obio-Akpor', '2026-02-18'),

(3, 'Senior Care Outreach',
 'Providing companionship and assistance to senior citizens.',
 'Bonny', '2026-03-14'),

(3, 'Back-to-School Support',
 'Distributing educational materials to students.',
 'Ahoada', '2026-04-11'),

(3, 'Holiday Volunteer Program',
 'Managing volunteers for seasonal community service projects.',
 'Eleme', '2026-05-30');

-- Verify data

SELECT * FROM service_projects
ORDER BY organization_id, project_id;


-- Create the categories table
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- Create the junction table
CREATE TABLE project_categories (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES service_projects(project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

-- Insert categories
INSERT INTO categories (category_name)
VALUES
('Construction'),
('Education'),
('Community Service'),
('Agriculture'),
('Environment');

-- Associate projects with categories

INSERT INTO project_categories (project_id, category_id) VALUES
-- BrightFuture Builders (Projects 1-5)
(1,1),   -- Construction
(2,2),   -- Education
(3,1),   -- Construction
(3,5),   -- Environment
(4,1),   -- Construction
(5,2),   -- Education

-- GreenHarvest Growers (Projects 6-10)
(6,4),   -- Agriculture
(6,5),   -- Environment
(7,2),   -- Education
(7,4),   -- Agriculture
(8,5),   -- Environment
(9,2),   -- Education
(10,4),  -- Agriculture
(10,5),  -- Environment

-- UnityServe Volunteers (Projects 11-15)
(11,3),  -- Community Service
(12,3),  -- Community Service
(12,5),  -- Environment
(13,3),  -- Community Service
(14,2),  -- Education
(14,3),  -- Community Service
(15,3);  -- Community Service

-- Verify the data
SELECT
    sp.project_id,
    sp.title,
    c.category_name
FROM service_projects sp
JOIN project_categories pc
    ON sp.project_id = pc.project_id
JOIN categories c
    ON pc.category_id = c.category_id
ORDER BY sp.project_id, c.category_name;

