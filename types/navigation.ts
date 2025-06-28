/**
 * Navigation types for the MediSim app
 */

export type RootStackParamList = {
  Home: undefined;
  Auth: undefined;
  Features: undefined;
  'Report-Processing': {
    reportId: string;
    fileUri: string;
    mimeType: string;
    reportType: string;
    extractedText?: string;
  };
  'Report-Results': {
    reportId: string;
  };
  'Disease-Detail': {
    id: string;
    name: string;
  };
  'Treatment-Detail': {
    id: string;
    name: string;
  };
  'Model-Detail': {
    id: string;
    name: string;
  };
  Settings: undefined;
  Profile: undefined;
  Diseases: undefined;
  Treatments: undefined;
  '3d-Models': undefined;
  Paywall: undefined;
};
