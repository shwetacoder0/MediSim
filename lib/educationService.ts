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
    if (!fileName) return '';
    
    // Use the direct Supabase storage URL you provided
    const baseUrl = 'https://lietwvmpknkteaptxvqm.supabase.co/storage/v1/object/public/3d-stuff/';
    return `${baseUrl}${fileName}`;
  }

  /**
   * Get YouTube video ID from URL
   */
  static getYouTubeVideoId(url: string): string {
    if (!url) return '';
    
    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : '';
  }

  /**
   * Get YouTube embed URL
   */
  static getYouTubeEmbedUrl(url: string): string {
    const videoId = this.getYouTubeVideoId(url);
    if (!videoId) return '';
    
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&showinfo=0&rel=0`;
  }

  /**
   * Count items by section type and internal section
   */
  static async getItemCounts(): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from('education_sections')
        .select('section_type, internal_section');

      if (error) throw error;

      const counts: Record<string, number> = {};
      
      data?.forEach(item => {
        const key = item.internal_section || item.section_type;
        counts[key] = (counts[key] || 0) + 1;
      });

      return counts;
    } catch (error) {
      console.error('Error getting item counts:', error);
      return {};
    }
  }

  /**
   * Check if a category has content
   */
  static async hasContent(sectionType: string, internalSection?: string): Promise<boolean> {
    try {
      let query = supabase
        .from('education_sections')
        .select('id', { count: 'exact' })
        .eq('section_type', sectionType);

      if (internalSection) {
        query = query.eq('internal_section', internalSection);
      }

      const { count, error } = await query;

      if (error) throw error;
      return (count || 0) > 0;
    } catch (error) {
      console.error('Error checking content:', error);
      return false;
    }
  }
}