// screens/DashboardScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import CameraCard from '../components/CameraCard';

const DashboardScreen = ({ navigation }) => {
  const [cameras, setCameras] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) setUser(user);
    });
  }, []);

  const fetchCameras = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
        .from('cameras')
        .select('*')
        .eq('user_id', user.id);
    if (error) Alert.alert("Error", "Could not fetch cameras.");
    else setCameras(data);
  }, [user]);

  useFocusEffect(fetchCameras);

  const deleteCamera = async (id) => {
    const { error } = await supabase.from('cameras').delete().eq('id', id);
    if (error) Alert.alert("Error", "Could not delete camera.");
    else fetchCameras(); // Refresh list
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="Scan QR to Add" onPress={() => navigation.navigate('Scanner')} />
      </View>

      <FlatList
        data={cameras}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CameraCard 
            camera={item}
            onDelete={() => deleteCamera(item.id)}
            onView={() => navigation.navigate('LiveFeed', { cameraUrl: item.url, cameraName: item.name })}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No cameras added. Tap "Scan QR" to start.</Text>}
        contentContainerStyle={{ flexGrow: 1 }}
      />
      <View style={{marginTop: 'auto'}}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} color="#ff453a" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#121212' },
    title: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 20, marginTop: 40, },
    buttonContainer: { marginBottom: 20 },
    emptyText: { color: '#888', textAlign: 'center', marginTop: 50, fontSize: 16 }
});

export default DashboardScreen;