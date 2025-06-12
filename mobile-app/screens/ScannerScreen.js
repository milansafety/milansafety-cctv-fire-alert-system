// screens/ScannerScreen.js
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { supabase } from '../lib/supabase';

export default function ScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const user = (await supabase.auth.getUser()).data.user;

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
                        Alert.alert("Error", "Could not save the camera.");
                    } else {
                        Alert.alert("Success", "Camera added successfully!");
                        navigation.goBack();
                    }
                },
            },
        ],
        'plain-text', // Input type
        'My Camera' // Default value for input
    );
  };

  if (hasPermission === null) return <Text style={styles.infoText}>Requesting for camera permission...</Text>;
  if (hasPermission === false) return <Text style={styles.infoText}>No access to camera. Please enable it in settings.</Text>;

  return (
    <View style={styles.container}>
      <Camera
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.layerTop}>
        <Text style={styles.description}>Scan a QR Code</Text>
      </View>
      <View style={styles.layerCenter}>
        <View style={styles.focused} />
      </View>
      <View style={styles.layerBottom}>
        {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column', backgroundColor: 'black' },
    infoText: { flex: 1, color: 'white', textAlign: 'center', textAlignVertical: 'center'},
    layerTop: { flex: 0.2, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
    layerCenter: { flex: 0.6, flexDirection: 'row' },
    focused: { flex: 0.8, borderColor: 'white', borderWidth: 2, borderRadius: 10, alignSelf: 'center', aspectRatio: 1 },
    layerBottom: { flex: 0.2, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center' },
    description: { color: 'white', fontSize: 18 },
});