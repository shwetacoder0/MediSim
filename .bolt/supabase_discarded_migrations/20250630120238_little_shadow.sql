-- Populate education_sections table with videos and 3D models
-- Clear existing data first
DELETE FROM education_sections;

-- Insert Treatment Videos (2 total - removed heart and stent)
INSERT INTO education_sections (section_type, internal_section, title, description, content_type, content_url) VALUES
('treatments', 'medications', 'Angioplasty Procedure', 'Watch how angioplasty opens blocked arteries to restore blood flow to the heart muscle.', 'video', 'https://youtu.be/e13TGGccvT4?si=GZa3caJsvEA8JO0L'),
('treatments', 'surgery', 'Pacemaker Implantation', 'Learn about the pacemaker implantation process and how it helps regulate heart rhythm.', 'video', 'https://youtu.be/O1Es1DXk-aI?si=nBiTEJSmGfw15_ko');

-- Insert Disease Videos (1 total)
INSERT INTO education_sections (section_type, internal_section, title, description, content_type, content_url) VALUES
('diseases', 'cardiology', 'Diabetes and Heart Health', 'Understanding how diabetes affects cardiovascular health and blood sugar management.', 'video', 'https://youtu.be/X9ivR4y03DE?si=iKg_I0JI1IVsJX3l');

-- Insert 3D Models (2 total)
INSERT INTO education_sections (section_type, internal_section, title, description, content_type, glb_file_url) VALUES
('3d-models', 'nervous', 'Human Brain 3D Model', 'Interactive 3D model of the human brain showing detailed anatomical structures including cerebrum, cerebellum, and brain stem.', '3d', '3DBrain.glb'),
('3d-models', 'digestive', 'Male Intestine 3D Model', 'Detailed 3D visualization of the male digestive system focusing on intestinal anatomy and structure.', '3d', 'IntestineMale.glb');