import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ReportScreen from '../screens/ReportScreen';

export default function ReportScreenRoute() {
  const params = useLocalSearchParams();
  const { fileUri, fileName, fileType, reportType } = params;

  return (
    <View style={styles.container}>
      <ReportScreen
        initialFileData={
          fileUri ? {
            uri: fileUri as string,
            name: fileName as string,
            type: fileType as string,
            mimeType: fileType as string,
          } : undefined
        }
        initialReportType={reportType as string}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
