import { Platform } from 'react-native';

// Tool for providing report data to the AI assistant
const getReportData = async (reportId: string | null) => {
  if (!reportId) {
    return 'Error: No report ID provided.';
  }

  // In a real implementation, this would fetch the report data from your database
  // For now, we'll return mock data based on the report ID
  return {
    patientName: "John Doe",
    patientAge: 42,
    reportDate: new Date().toISOString().split('T')[0],
    findings: {
      kidneyCondition: "Normal with small stone formation in lower pole",
      stoneSize: "5mm",
      hydronephrosis: "Mild",
      otherFindings: "No evidence of obstruction"
    },
    recommendations: "Follow-up in 3 months, increase fluid intake, limit sodium"
  };
};

// Export tools object
const tools = {
  getReportData
};

export default tools;
