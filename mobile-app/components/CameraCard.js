// components/CameraCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';

const CameraCard = ({ camera, onDelete, onView }) => {
  return (
    <Pressable onPress={onView} style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{camera.name}</Text>
        <Text style={styles.cardUrl} numberOfLines={1}>{camera.url}</Text>
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </Pressable>
  );
};

const styles = StyleSheet.create({
    card: { backgroundColor: '#1e1e1e', padding: 20, borderRadius: 12, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardTitle: { color: 'white', fontSize: 18, fontWeight: '600' },
    cardUrl: { color: '#888', fontSize: 12, marginTop: 4 },
    deleteButton: { padding: 10 },
    deleteText: { color: '#ff453a', fontSize: 20 }
});

export default CameraCard;