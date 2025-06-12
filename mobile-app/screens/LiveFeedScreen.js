// screens/LiveFeedScreen.js
import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const LiveFeedScreen = ({ route }) => {
  const { cameraUrl, cameraName } = route.params;
  
  // Use a proxy for HTTP streams on mobile, if needed
  // For now, we assume the stream is accessible.
  // For MJPEG, WebView is a good choice.
  const source = { uri: cameraUrl };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{cameraName}</Text>
      <View style={styles.webviewContainer}>
        <WebView
          source={source}
          style={styles.webview}
          startInLoadingState={true}
          renderLoading={() => <ActivityIndicator color="#0a84ff" size="large" />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingTop: 60 },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  webviewContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: '#333'
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default LiveFeedScreen;