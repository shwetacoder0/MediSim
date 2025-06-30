import { supabase } from './supabase';
import { STORAGE_BUCKETS } from '../config/constants';

export interface EducationSection {
  id: string;
  section_type: string;
  internal_section?: string;
  title: string;
  description?: string;
  image_url?: string;
  content_type: 'video' | '3d' | 'image';
  content_url?: string;
  glb_file_url?: string;
}

export class EducationService {
  /**
   * Get education sections by type
   */
  static async getEducationSections(sectionType: string): Promise<EducationSection[]> {
    try {
      const { data, error } = await supabase
        .from('education_sections')
        .select('*')
        .eq('section_type', sectionType)
        .order('title');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching education sections:', error);
      return [];
    }
  }

  /**
   * Get education sections by type and internal section
   */
  static async getEducationSectionsByCategory(
    sectionType: string, 
    internalSection?: string
  ): Promise<EducationSection[]> {
    try {
      let query = supabase
        .from('education_sections')
        .select('*')
        .eq('section_type', sectionType);

      if (internalSection) {
        query = query.eq('internal_section', internalSection);
      }

      const { data, error } = await query.order('title');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching education sections by category:', error);
      return [];
    }
  }

  /**
   * Get a specific education item
   */
  static async getEducationItem(itemId: string): Promise<EducationSection | null> {
    try {
      const { data, error } = await supabase
        .from('education_sections')
        .select('*')
        .eq('id', itemId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching education item:', error);
      return null;
    }
  }

  /**
   * Get 3D model URL from storage
   */
  static get3DModelUrl(fileName: string): string {
    const { data } = supabase.storage
      .from(STORAGE_BUCKETS.MODELS_3D)
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  /**
   * Create sample education data (for development)
   */
  static async createSampleData(): Promise<void> {
    try {
      const sampleData: Omit<EducationSection, 'id'>[] = [
        // 3D Models
        {
          section_type: '3d-models',
          internal_section: 'cardiovascular',
          title: 'Human Heart - Male',
          description: 'Interactive 3D model of the male human heart showing chambers, valves, and major vessels',
          content_type: '3d',
          glb_file_url: 'heart_male.glb',
          image_url: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg'
        },
        {
          section_type: '3d-models',
          internal_section: 'nervous',
          title: 'Human Brain - Male',
          description: 'Detailed 3D brain model showing cerebral cortex, cerebellum, and brain stem',
          content_type: '3d',
          glb_file_url: 'brain_male.glb',
          image_url: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg'
        },
        {
          section_type: '3d-models',
          internal_section: 'nervous',
          title: 'Human Brain - Female',
          description: 'Detailed 3D brain model showing cerebral cortex, cerebellum, and brain stem',
          content_type: '3d',
          glb_file_url: 'brain_female.glb',
          image_url: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg'
        },
        {
          section_type: '3d-models',
          internal_section: 'full-body',
          title: 'Full Human Body - Male',
          description: 'Complete anatomical 3D model showing all major organ systems',
          content_type: '3d',
          glb_file_url: 'full_body_male.glb',
          image_url: 'https://images.pexels.com/photos/4506109/pexels-photo-4506109.jpeg'
        },
        // Diseases (YouTube videos)
        {
          section_type: 'diseases',
          internal_section: 'cardiology',
          title: 'Heart Attack: What Happens Inside',
          description: 'Detailed animation showing how coronary arteries become blocked',
          content_type: 'video',
          content_url: 'dQw4w9WgXcQ',
          image_url: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg'
        },
        {
          section_type: 'diseases',
          internal_section: 'neurology',
          title: 'Stroke: Brain Under Attack',
          description: 'See what happens when blood flow to the brain is interrupted',
          content_type: 'video',
          content_url: 'dQw4w9WgXcQ',
          image_url: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg'
        },
        // Treatments (YouTube videos)
        {
          section_type: 'treatments',
          internal_section: 'medications',
          title: 'How Blood Pressure Medications Work',
          description: 'Understanding ACE inhibitors and how they help reduce blood pressure',
          content_type: 'video',
          content_url: 'dQw4w9WgXcQ',
          image_url: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg'
        },
        {
          section_type: 'treatments',
          internal_section: 'surgery',
          title: 'Laparoscopic Surgery Technique',
          description: 'Step-by-step animation of minimally invasive laparoscopic procedures',
          content_type: 'video',
          content_url: 'dQw4w9WgXcQ',
          image_url: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg'
        }
      ];

      const { error } = await supabase
        .from('education_sections')
        .insert(sampleData);

      if (error) throw error;
      console.log('Sample education data created successfully');
    } catch (error) {
      console.error('Error creating sample data:', error);
    }
  }
}