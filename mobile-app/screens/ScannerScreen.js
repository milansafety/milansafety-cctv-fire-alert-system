// screens/ScannerScreen.js
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { Camera } from 'expo-camera'; // ✅ FIX: This is the correct way to import
import { supabase } from '../lib/supabase';

export default function ScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        Alert.alert("Error", "You must be logged in to add a camera.");
        navigation.goBack();
        return;
    }

    Alert.prompt(
        "Add New Camera",
        `Scanned URL: ${data}`,
        [
            { text: "Cancel", onPress: () => setScanned(false), style: "cancel" },
            {
                text: "Save",
                onPress: async (cameraName) => {
                    if (!cameraName) cameraName = "New Scanned Camera";
                    const { error } = await supabase
                        .from('cameras')
                        .insert([{ name: cameraName, url: data, user_id: user.id }]);
                    
                    if (error) {
                        Alert.alert("Error", `Could not save the camera: ${error.message}`);
                        setScanned(false);
                    } else {
                        Alert.alert("Success", "Camera added successfully!");
                        navigation.goBack();
                    }
                },
            },
        ],
        'plain-text',
        'My Camera'
    );
  };

  if (hasPermission === null) {
      return (
        <View style={styles.infoContainer}><Text style={styles.infoText}>Requesting camera permission...</Text></View>
      );
  }
  if (hasPermission === false) {
      return (
          <View style={styles.infoContainer}><Text style={styles.infoText}>No access to camera. Please enable it in your phone's settings.</Text></View>
      );
  }

  return (
    <View style={styles.container}>
      <Camera
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barCodeScannerSettings={{
            barCodeTypes: ['qr'],
        }}
      />
      <View style={styles.overlay}>
        <Text style={styles.description}>Scan QR Code</Text>
        <View style={styles.scannerBox} />
      </View>
      {scanned && <View style={styles.scanAgainButton}><Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} /></View>}
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black' },
    infoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
    infoText: { color: 'white', fontSize: 16 },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    description: {
        fontSize: 18,
        color: 'white',
        position: 'absolute',
        top: '20%',
    },
    scannerBox: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10,
    },
    scanAgainButton: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        right: 20,
    }
});