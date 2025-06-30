-- Populate education_sections table with videos and 3D models
-- Clear existing data first
DELETE FROM education_sections;

-- Insert Treatment Videos (3 videos)
INSERT INTO education_sections (
  section_type,
  internal_section,
  title,
  description,
  image_url,
  content_type,
  content_url,
  glb_file_url
) VALUES 
-- Treatment 1: Angioplasty
(
  'treatments',
  'surgery',
  'Angioplasty: Opening Blocked Arteries',
  'Watch how balloon angioplasty opens blocked coronary arteries to restore blood flow to the heart muscle.',
  'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg',
  'video',
  'https://youtu.be/e13TGGccvT4?si=GZa3caJsvEA8JO0L',
  NULL
),
-- Treatment 2: Pacemaker
(
  'treatments',
  'surgery',
  'Pacemaker Implantation Process',
  'See how a pacemaker is implanted to regulate heart rhythm and improve cardiac function.',
  'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg',
  'video',
  'https://youtu.be/O1Es1DXk-aI?si=nBiTEJSmGfw15_ko',
  NULL
),
-- Treatment 3: Stent Placement
(
  'treatments',
  'medications',
  'Stent Placement: Keeping Arteries Open',
  'Learn how coronary stents are placed to keep arteries open and maintain proper blood flow.',
  'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg',
  'video',
  'https://youtu.be/e13TGGccvT4?si=GZa3caJsvEA8JO0L',
  NULL
),

-- Disease Videos (2 videos)
-- Disease 1: Diabetes
(
  'diseases',
  'cardiology',
  'Diabetes: Understanding Blood Sugar',
  'Comprehensive animation explaining how diabetes affects blood sugar levels and impacts the cardiovascular system.',
  'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg',
  'video',
  'https://youtu.be/X9ivR4y03DE?si=iKg_I0JI1IVsJX3l',
  NULL
),
-- Disease 2: Heart Disease
(
  'diseases',
  'neurology',
  'Heart Disease: The Silent Threat',
  'Learn about the progression of heart disease and how it affects brain function and overall health.',
  'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg',
  'video',
  'https://youtu.be/X9ivR4y03DE?si=iKg_I0JI1IVsJX3l',
  NULL
),

-- 3D Models (2 GLB files)
-- 3D Model 1: Brain
(
  '3d-models',
  'nervous',
  'Human Brain - Interactive 3D Model',
  'Detailed 3D brain model showing cerebral cortex, cerebellum, and brain stem. Perfect for studying neuroanatomy.',
  'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg',
  '3d',
  NULL,
  '3DBrain.glb'
),
-- 3D Model 2: Intestine
(
  '3d-models',
  'digestive',
  'Human Intestine System - Interactive 3D Model',
  'Complete 3D model of the human digestive tract including small and large intestines with detailed anatomy.',
  'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg',
  '3d',
  NULL,
  'IntestineMale.glb'
);

-- Verify the data was inserted
SELECT 
  section_type,
  internal_section,
  title,
  content_type,
  CASE 
    WHEN content_type = 'video' THEN content_url
    WHEN content_type = '3d' THEN glb_file_url
    ELSE 'N/A'
  END as content_reference
FROM education_sections
ORDER BY section_type, internal_section, title;