DROP DATABASE IF EXISTS freelance_marketplace;
CREATE DATABASE freelance_marketplace;
USE freelance_marketplace;
CREATE TABLE users ( user_id INT AUTO_INCREMENT PRIMARY KEY, full_name  VARCHAR(100) NOT NULL, email VARCHAR(120) NOT NULL UNIQUE,
password VARCHAR(255) NULL,
role   ENUM('client','freelancer') NOT NULL, country  VARCHAR(60) NOT NULL, joined_date   DATE NOT NULL,
is_active     BOOLEAN NOT NULL DEFAULT TRUE );

INSERT INTO users (full_name, email, role, country, joined_date, is_active) VALUES
('Aarav Sharma', 'aarav.sharma1@mail.com', 'client', 'Germany', '2024-07-21',0),
('Vivian Patel', 'vivian.patel2@mail.com', 'client', 'Italy', '2023-06-19', 0),
('Liam Kumar', 'liam.kumar3@mail.com', 'client', 'France', '2024-01-03', 1),
('Priya Singh', 'priya.singh4@mail.com', 'client', 'United States', '2024-02-18', 1),
('Noah Reddy', 'noah.reddy5@mail.com', 'client', 'Italy', '2023-04-21', 1),
('Ananya Gupta', 'ananya.gupta6@mail.com', 'client', 'India', '2026-01-08', 0),
('Ethan Mehta', 'ethan.mehta7@mail.com', 'client', 'Italy', '2024-05-14', 1),
('Diya Nair', 'diya.nair8@mail.com', 'client', 'United States', '2025-09-27', 1),
('Mason Iyer', 'mason.iyer9@mail.com', 'client', 'United States', '2024-06-04', 1),
('Ishaan Das', 'ishaan.das10@mail.com', 'client', 'United States', '2023-10-07', 1),
('Olivia Verma', 'olivia.verma11@mail.com', 'client', 'France', '2026-06-15', 1),
('Arjun Joshi', 'arjun.joshi12@mail.com', 'client', 'Singapore', '2025-05-08', 1),
('Emma Pillai', 'emma.pillai13@mail.com', 'client', 'Nigeria', '2024-02-19', 1),
('Kavya Rao', 'kavya.rao14@mail.com', 'client', 'Singapore', '2025-12-15', 1),
('Lucas Chopra', 'lucas.chopra15@mail.com', 'client', 'United States', '2023-09-14', 1),
('Riya Bose', 'riya.bose16@mail.com', 'freelancer', 'Germany', '2024-08-14', 0),
('Henry Kapoor', 'henry.kapoor17@mail.com', 'freelancer', 'Philippines', '2023-09-19', 1),
('Sara Malhotra', 'sara.malhotra18@mail.com', 'freelancer', 'Italy', '2025-06-23', 1),
('Aditya Bhatt', 'aditya.bhatt19@mail.com', 'freelancer', 'Singapore', '2026-02-27', 1),
('Zoey Saxena', 'zoey.saxena20@mail.com', 'freelancer', 'Australia', '2026-12-22', 0),
('Rohan Agarwal', 'rohan.agarwal21@mail.com', 'freelancer', 'Nigeria', '2025-11-19', 1),
('Maya Menon', 'maya.menon22@mail.com', 'freelancer', 'Italy', '2026-05-23', 1),
('Caleb Thakur', 'caleb.thakur23@mail.com', 'freelancer', 'Philippines', '2025-01-15', 1),
('Tanya Chauhan', 'tanya.chauhan24@mail.com', 'freelancer', 'Brazil', '2023-08-02', 1),
('Nikhil Desai', 'nikhil.desai25@mail.com', 'freelancer', 'Australia', '2024-12-08', 1),
('Grace Trivedi', 'grace.trivedi26@mail.com', 'freelancer', 'Spain', '2026-02-06', 1),
('Yusuf Shetty', 'yusuf.shetty27@mail.com', 'freelancer', 'France', '2025-03-27', 1),
('Leah Pandey', 'leah.pandey28@mail.com', 'freelancer', 'France', '2025-12-14', 1),
('Dev Sinha', 'dev.sinha29@mail.com', 'freelancer', 'Philippines', '2026-04-05', 1),
('Chloe Khanna', 'chloe.khanna30@mail.com', 'freelancer', 'United Kingdom', '2024-11-08', 0);

CREATE TABLE categories ( category_id INT AUTO_INCREMENT PRIMARY KEY, category_name VARCHAR(80) NOT NULL UNIQUE,
    description   VARCHAR(255) );

INSERT INTO categories (category_name, description) VALUES
('Web Development', 'Frontend and backend website projects'), ('Mobile App Development', 'iOS and Android app projects'),
('Graphic Design', 'Logos, branding, and visual design'), ('Content Writing', 'Articles, blogs, and copywriting'),
('Digital Marketing', 'SEO, ads, and social media campaigns'), ('Data Science & Analytics', 'Data analysis, dashboards, and reporting'),
('Video Editing & Animation', 'Video production and motion graphics'), ('Virtual Assistance', 'Admin support and scheduling tasks'),
('Translation Services', 'Document and content translation'), ('Accounting & Finance', 'Bookkeeping and financial reporting'),
('Legal Services', 'Contract review and legal consulting'), ('Game Development', '2D/3D game design and development'),
('IT & Networking', 'System administration and network setup'), ('Photography', 'Product and event photography'),
('Voice Over & Audio', 'Narration, dubbing, and audio editing');

CREATE TABLE skills ( skill_id INT AUTO_INCREMENT PRIMARY KEY, skill_name  VARCHAR(100) NOT NULL,
    category_id   INT NOT NULL, FOREIGN KEY (category_id) REFERENCES categories(category_id) );

INSERT INTO skills (skill_name, category_id) VALUES
('React.js Development', 1), ('Flutter App Development', 2), ('Adobe Illustrator', 3), ('SEO Content Writing', 4),
('Social Media Marketing', 5), ('SQL & Power BI', 6), ('After Effects Animation', 7), ('Calendar & Email Management', 8),
('Spanish-English Translation', 9), ('QuickBooks Bookkeeping', 10), ('Contract Drafting', 11), ('Unity Game Development', 12),
('Network Administration', 13), ('Product Photography', 14), ('Voice Over Narration', 15);

CREATE TABLE client_profiles ( client_id  INT PRIMARY KEY, company_name  VARCHAR(100) NOT NULL, industry VARCHAR(60) NOT NULL,
total_spent   DECIMAL(12,2) NOT NULL DEFAULT 0, member_since  DATE NOT NULL, FOREIGN KEY (client_id) REFERENCES users(user_id) );

INSERT INTO client_profiles (client_id, company_name, industry, total_spent, member_since) VALUES
(1, 'BrightPath Retail', 'Retail', 20861.79, '2024-07-21'), (2, 'NovaTech Solutions', 'Technology', 4967.4, '2023-06-19'),
(3, 'UrbanLeaf Foods', 'Food & Beverage', 7407.3, '2024-01-03'), (4, 'Skyline Realty', 'Real Estate', 4069.07, '2024-02-18'),
(5, 'FinEdge Capital', 'Finance', 13597.48, '2023-04-21'), (6, 'GreenWave Energy', 'Energy', 15440.4, '2026-01-08'),
(7, 'PixelCraft Studios', 'Media', 8305.99, '2024-05-14'), (8, 'MedCare Plus', 'Healthcare', 3574.54, '2025-09-27'),
(9, 'EduSphere Learning', 'Education', 21550.45, '2024-06-04'), (10, 'Voyage Travel Co.', 'Travel', 23780.49, '2023-10-07'),
(11, 'ZenithFit Wellness', 'Health & Wellness', 16546.68, '2026-06-15'), (12, 'Cascade Logistics', 'Logistics', 18624.73, '2025-05-08'),
(13, 'Bloom Cosmetics', 'Beauty', 11687.77, '2024-02-19'), (14, 'TrueNorth Consulting', 'Consulting', 21839.0, '2025-12-15'),
(15, 'Apex Builders', 'Construction', 23821.21, '2023-09-14');

CREATE TABLE freelancer_profiles ( freelancer_id INT PRIMARY KEY, professional_title VARCHAR(100) NOT NULL,
hourly_rate DECIMAL(8,2) NOT NULL, availability_status ENUM('available','busy','unavailable') NOT NULL DEFAULT 'available',
rating_avg  DECIMAL(3,2) NOT NULL DEFAULT 0, total_earned  DECIMAL(12,2) NOT NULL DEFAULT 0,
years_experience    INT NOT NULL DEFAULT 0, FOREIGN KEY (freelancer_id) REFERENCES users(user_id) );

INSERT INTO freelancer_profiles (freelancer_id, professional_title, hourly_rate, availability_status, rating_avg, total_earned, years_experience) VALUES
(16, 'Full-Stack Web Developer', 53.6, 'available', 4.1, 16370.68, 8), (17, 'Mobile App Developer', 50.5, 'available', 3.6, 9141.76, 3),
(18, 'Brand & Logo Designer', 15.37, 'busy', 3.65, 23104.56, 9), (19, 'SEO Content Writer', 14.8, 'available', 3.54, 35098.96, 10),
(20, 'Social Media Strategist', 33.21, 'busy', 4.93, 24488.89, 8), (21, 'Data Analyst', 16.23, 'busy', 4.99, 19173.59, 8),
(22, 'Motion Graphics Artist', 28.89, 'available', 4.62, 29873.7, 8), (23, 'Virtual Assistant', 63.53, 'available', 3.53, 38088.44, 9),
(24, 'Professional Translator', 32.24, 'busy', 4.87, 30567.58, 5), (25, 'Bookkeeper & Accountant', 73.56, 'busy', 4.54, 11183.49, 6),
(26, 'Contract Attorney', 68.85, 'available', 3.83, 22121.12, 9), (27, 'Unity Game Developer', 30.09, 'available', 4.72, 39412.12, 4),
(28, 'Network Engineer', 62.01, 'busy', 4.61, 9842.84, 9), (29, 'Product Photographer', 41.02, 'busy', 4.98, 31814.45, 8),
(30, 'Voice Over Artist', 25.36, 'busy', 4.93, 18441.88, 12);

CREATE TABLE freelancer_skills ( id INT AUTO_INCREMENT PRIMARY KEY, freelancer_id INT NOT NULL, skill_id INT NOT NULL,
proficiency_level ENUM('Beginner','Intermediate','Expert') NOT NULL, FOREIGN KEY (freelancer_id) REFERENCES freelancer_profiles(freelancer_id),
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) );

INSERT INTO freelancer_skills (freelancer_id, skill_id, proficiency_level) VALUES (16, 1, 'Expert'), (17, 2, 'Expert'),
(18, 3, 'Intermediate'), (19, 4, 'Intermediate'), (20, 5, 'Intermediate'), (21, 6, 'Intermediate'), (22, 7, 'Intermediate'),
(23, 8, 'Expert'), (24, 9, 'Expert'), (25, 10, 'Expert'), (26, 11, 'Intermediate'), (27, 12, 'Expert'),
(28, 13, 'Expert'), (29, 14, 'Beginner'), (30, 15, 'Expert');

CREATE TABLE projects ( project_id  INT AUTO_INCREMENT PRIMARY KEY, client_id  INT NOT NULL, title VARCHAR(150) NOT NULL,
description   VARCHAR(500), category_id  INT NOT NULL, budget_min  DECIMAL(10,2) NOT NULL, budget_max  DECIMAL(10,2) NOT NULL,
status   ENUM('open','in_progress','completed','cancelled') NOT NULL DEFAULT 'open', posted_date   DATE NOT NULL, deadline DATE NOT NULL,
FOREIGN KEY (client_id) REFERENCES client_profiles(client_id), FOREIGN KEY (category_id) REFERENCES categories(category_id) );

INSERT INTO projects (client_id, title, description, category_id, budget_min, budget_max, status, posted_date, deadline) VALUES
(15, 'Build a responsive e-commerce website', 'Looking for a skilled professional to build a responsive e-commerce website. Clear requirements and timely communication expected.', 1, 1287.9, 4220.42, 'open', '2024-07-26', '2024-12-11'),
(2, 'Develop a cross-platform fitness app', 'Looking for a skilled professional to develop a cross-platform fitness app. Clear requirements and timely communication expected.', 2, 2442.31, 6337.44, 'in_progress', '2025-12-03', '2025-12-06'),
(3, 'Design a new brand identity & logo', 'Looking for a skilled professional to design a new brand identity & logo. Clear requirements and timely communication expected.', 3, 2980.71, 3382.64, 'in_progress', '2025-11-05', '2025-11-27'),
(10, 'Write 20 SEO-optimized blog articles', 'Looking for a skilled professional to write 20 seo-optimized blog articles. Clear requirements and timely communication expected.', 4, 2944.86, 5676.75, 'in_progress', '2026-09-05', '2026-02-01'),
(13, 'Run a 3-month Instagram ad campaign', 'Looking for a skilled professional to run a 3-month instagram ad campaign. Clear requirements and timely communication expected.', 5, 2918.49, 5622.29, 'in_progress', '2024-07-28', '2024-05-27'),
(14, 'Build a sales analytics dashboard', 'Looking for a skilled professional to build a sales analytics dashboard. Clear requirements and timely communication expected.', 6, 790.92, 2022.71, 'open', '2024-10-11', '2024-06-18'),
(7, 'Edit a 10-episode YouTube series', 'Looking for a skilled professional to edit a 10-episode youtube series. Clear requirements and timely communication expected.', 7, 2535.75, 3061.1, 'completed', '2025-11-19', '2025-10-14'),
(14, 'Manage inbox and calendar for executive', 'Looking for a skilled professional to manage inbox and calendar for executive. Clear requirements and timely communication expected.', 8, 2769.62, 4925.72, 'in_progress', '2026-09-01', '2026-09-25'),
(3, 'Translate a 50-page manual to Spanish', 'Looking for a skilled professional to translate a 50-page manual to spanish. Clear requirements and timely communication expected.', 9, 1903.95, 5075.29, 'open', '2024-08-20', '2024-12-04'),
(9, 'Reconcile a year of business accounts', 'Looking for a skilled professional to reconcile a year of business accounts. Clear requirements and timely communication expected.', 10, 372.91, 3197.54, 'in_progress', '2025-02-18', '2025-02-08'),
(4, 'Draft a freelance services contract template', 'Looking for a skilled professional to draft a freelance services contract template. Clear requirements and timely communication expected.', 11, 975.37, 4132.74, 'in_progress', '2026-01-25', '2026-03-15'),
(6, 'Create a 2D platformer game prototype', 'Looking for a skilled professional to create a 2d platformer game prototype. Clear requirements and timely communication expected.', 12, 1915.08, 4085.63, 'in_progress', '2026-05-15', '2026-10-18'),
(13, 'Set up office network and firewall', 'Looking for a skilled professional to set up office network and firewall. Clear requirements and timely communication expected.', 13, 1538.5, 5322.05, 'completed', '2025-09-07', '2025-09-05'),
(7, 'Shoot product photos for online store', 'Looking for a skilled professional to shoot product photos for online store. Clear requirements and timely communication expected.', 14, 540.54, 2476.38, 'open', '2024-07-03', '2024-05-22'),
(5, 'Record narration for an e-learning course', 'Looking for a skilled professional to record narration for an e-learning course. Clear requirements and timely communication expected.', 15, 2395.02, 6014.02, 'open', '2026-11-22', '2026-07-05'),
(5, 'Redesign a restaurant''s online ordering site', 'Looking for a skilled professional to redesign a restaurant''s online ordering site. Clear requirements and timely communication expected.', 1, 2671.93, 6551.85, 'open', '2024-07-16', '2024-04-22'),
(14, 'Build an inventory tracking mobile app', 'Looking for a skilled professional to build an inventory tracking mobile app. Clear requirements and timely communication expected.', 2, 826.39, 3739.79, 'cancelled', '2025-06-14', '2025-05-12'),
(6, 'Design packaging for a skincare line', 'Looking for a skilled professional to design packaging for a skincare line. Clear requirements and timely communication expected.', 3, 458.14, 2112.16, 'in_progress', '2025-08-23', '2025-02-13'),
(6, 'Write product descriptions for 100 SKUs', 'Looking for a skilled professional to write product descriptions for 100 skus. Clear requirements and timely communication expected.', 4, 1648.81, 3041.99, 'cancelled', '2024-04-04', '2024-03-09'),
(5, 'Launch a Google Ads campaign for a startup', 'Looking for a skilled professional to launch a google ads campaign for a startup. Clear requirements and timely communication expected.', 5, 310.85, 3493.14, 'open', '2024-07-28', '2024-12-27'),
(5, 'Build a churn-prediction dashboard', 'Looking for a skilled professional to build a churn-prediction dashboard. Clear requirements and timely communication expected.', 6, 1336.65, 3622.07, 'in_progress', '2025-12-11', '2025-03-09'),
(1, 'Animate a 60-second explainer video', 'Looking for a skilled professional to animate a 60-second explainer video. Clear requirements and timely communication expected.', 7, 2438.85, 3417.22, 'completed', '2025-01-21', '2025-03-26'),
(5, 'Provide virtual assistant support for a CEO', 'Looking for a skilled professional to provide virtual assistant support for a ceo. Clear requirements and timely communication expected.', 8, 434.48, 3902.53, 'open', '2024-08-01', '2024-07-18'),
(7, 'Localize a mobile app into French', 'Looking for a skilled professional to localize a mobile app into french. Clear requirements and timely communication expected.', 9, 2794.67, 4085.75, 'open', '2026-12-08', '2026-03-06'),
(5, 'Prepare quarterly financial statements', 'Looking for a skilled professional to prepare quarterly financial statements. Clear requirements and timely communication expected.', 10, 341.06, 1387.6, 'in_progress', '2025-09-25', '2025-05-10'),
(8, 'Review and negotiate a vendor contract', 'Looking for a skilled professional to review and negotiate a vendor contract. Clear requirements and timely communication expected.', 11, 1600.25, 2558.48, 'in_progress', '2024-05-02', '2024-02-01'),
(12, 'Build a multiplayer card game', 'Looking for a skilled professional to build a multiplayer card game. Clear requirements and timely communication expected.', 12, 1615.83, 5534.62, 'in_progress', '2024-08-04', '2024-12-27'),
(11, 'Migrate company servers to the cloud', 'Looking for a skilled professional to migrate company servers to the cloud. Clear requirements and timely communication expected.', 13, 1410.1, 3541.61, 'completed', '2025-09-10', '2025-12-07'),
(4, 'Photograph a corporate headshot session', 'Looking for a skilled professional to photograph a corporate headshot session. Clear requirements and timely communication expected.', 14, 1159.57, 4539.03, 'completed', '2026-03-13', '2026-07-02'),
(14, 'Voice a series of podcast ads', 'Looking for a skilled professional to voice a series of podcast ads. Clear requirements and timely communication expected.', 15, 563.49, 1125.16, 'completed', '2025-07-06', '2025-02-03');


CREATE TABLE proposals ( proposal_id INT AUTO_INCREMENT PRIMARY KEY, project_id  INT NOT NULL, freelancer_id  INT NOT NULL,
bid_amount  DECIMAL(10,2) NOT NULL, delivery_days  INT NOT NULL, cover_letter  VARCHAR(500), status  ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
submitted_date DATE NOT NULL,  FOREIGN KEY (project_id) REFERENCES projects(project_id),
    FOREIGN KEY (freelancer_id) REFERENCES freelancer_profiles(freelancer_id) );

INSERT INTO proposals (project_id, freelancer_id, bid_amount, delivery_days, cover_letter, status, submitted_date) VALUES
(22, 29, 2811.49, 35, 'I specialize in this exact type of work and would love to discuss your project further.', 'accepted', '2026-05-02'),
(15, 18, 2965.13, 31, 'I have extensive experience with similar projects and can deliver high quality work on time.', 'pending', '2025-09-11'),
(8, 16, 4851.69, 22, 'I reviewed your requirements and I''m confident I can exceed your expectations within budget.', 'pending', '2024-06-13'),
(3, 23, 3092.82, 44, 'I reviewed your requirements and I''m confident I can exceed your expectations within budget.', 'pending', '2024-02-09'),
(27, 17, 2179.61, 40, 'I have extensive experience with similar projects and can deliver high quality work on time.', 'pending', '2025-05-21'),
(8, 17, 4032.2, 36, 'I reviewed your requirements and I''m confident I can exceed your expectations within budget.', 'accepted', '2026-10-13'),
(25, 21, 1095.28, 34, 'I reviewed your requirements and I''m confident I can exceed your expectations within budget.', 'pending', '2026-11-05'),
(2, 29, 5695.87, 35, 'I can start immediately and have a strong portfolio of comparable projects to share.', 'accepted', '2026-03-17'),
(25, 24, 936.0, 4, 'My background aligns perfectly with this project and I offer flexible revisions.', 'accepted', '2026-11-23'),
(21, 19, 1531.12, 5, 'I reviewed your requirements and I''m confident I can exceed your expectations within budget.', 'accepted', '2024-07-27'),
(15, 24, 2578.79, 4, 'My background aligns perfectly with this project and I offer flexible revisions.', 'accepted', '2025-05-01'),
(15, 28, 2648.75, 35, 'My background aligns perfectly with this project and I offer flexible revisions.', 'pending', '2026-02-24'),
(24, 23, 3120.27, 7, 'I specialize in this exact type of work and would love to discuss your project further.', 'pending', '2024-04-24'),
(21, 23, 2465.53, 27, 'I have extensive experience with similar projects and can deliver high quality work on time.', 'pending', '2026-05-25'),
(2, 25, 4907.12, 15, 'I have extensive experience with similar projects and can deliver high quality work on time.', 'accepted', '2025-05-21'),
(24, 27, 3187.7, 39, 'I reviewed your requirements and I''m confident I can exceed your expectations within budget.', 'pending', '2024-08-09'),
(22, 17, 3116.06, 34, 'I specialize in this exact type of work and would love to discuss your project further.', 'accepted', '2025-08-15'),
(15, 28, 2823.88, 38, 'I reviewed your requirements and I''m confident I can exceed your expectations within budget.', 'pending', '2024-08-01'),
(10, 23, 588.89, 35, 'I can start immediately and have a strong portfolio of comparable projects to share.', 'rejected', '2025-04-07'),
(3, 25, 3017.01, 36, 'I specialize in this exact type of work and would love to discuss your project further.', 'rejected', '2024-10-27'),
(21, 24, 1975.58, 10, 'I specialize in this exact type of work and would love to discuss your project further.', 'pending', '2025-07-01'),
(6, 16, 1961.07, 31, 'I can start immediately and have a strong portfolio of comparable projects to share.', 'pending', '2024-07-12'),
(13, 21, 1995.97, 24, 'I have extensive experience with similar projects and can deliver high quality work on time.', 'pending', '2025-07-04'),
(30, 19, 963.97, 21, 'I specialize in this exact type of work and would love to discuss your project further.', 'pending', '2025-07-28'),
(19, 17, 2151.34, 30, 'I specialize in this exact type of work and would love to discuss your project further.', 'rejected', '2025-02-02'),
(27, 26, 2735.13, 12, 'I reviewed your requirements and I''m confident I can exceed your expectations within budget.', 'rejected', '2025-09-11'),
(7, 28, 2731.89, 30, 'I have extensive experience with similar projects and can deliver high quality work on time.', 'rejected', '2026-07-18'),
(18, 19, 1648.33, 6, 'I can start immediately and have a strong portfolio of comparable projects to share.', 'pending', '2024-11-28'),
(10, 23, 511.25, 38, 'I reviewed your requirements and I''m confident I can exceed your expectations within budget.', 'pending', '2025-06-10'),
(10, 20, 2460.4, 44, 'I specialize in this exact type of work and would love to discuss your project further.', 'pending', '2024-05-16');

-- NOTE: contracts, milestones, payments, reviews, messages, disputes, and portfolio tables
-- from the original schema are omitted here for brevity but can be added the same way:
-- create the table, then map it as a JPA @Entity + Repository + Controller following the
-- same pattern used for projects/proposals above.
