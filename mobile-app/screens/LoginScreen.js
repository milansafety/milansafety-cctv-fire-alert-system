// screens/LoginScreen.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Keyboard } from 'react-native';
import { supabase } from '../lib/supabase';
import CustomAlert from '../components/CustomAlert';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ visible: false, title: '', message: '' });

    const showAlert = (title, message) => setAlert({ visible: true, title, message });

    async function handleAuthAction(action) {
        setLoading(true);
        Keyboard.dismiss();
        const { error } = await action();
        if (error) showAlert("Authentication Error", error.message);
        setLoading(false);
    }

    async function forgotPassword() {
        if (!email) {
            showAlert("Input Needed", "Please enter your email address to reset your password.");
            return;
        }
        Keyboard.dismiss();
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'io.supabase.user-management://login',
        });
        if (error) showAlert("Error", error.message);
        else showAlert("Success", "Password reset link sent! Please check your email.");
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <CustomAlert 
                visible={alert.visible} 
                title={alert.title} 
                message={alert.message} 
                onClose={() => setAlert({ visible: false, title: '', message: '' })}
            />
            <Text style={styles.header}>AI Safety Monitor</Text>
            <Text style={styles.description}>Sign in or create an account</Text>
            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder="email@address.com"
                placeholderTextColor="#888"
                autoCapitalize={'none'}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                secureTextEntry
                placeholder="Password"
                placeholderTextColor="#888"
                autoCapitalize={'none'}
            />
            <Pressable style={styles.button} disabled={loading} onPress={() => handleAuthAction(() => supabase.auth.signInWithPassword({ email, password }))}>
                <Text style={styles.buttonText}>Sign in</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.buttonOutline]} disabled={loading} onPress={() => handleAuthAction(() => supabase.auth.signUp({ email, password }))}>
                <Text style={styles.buttonOutlineText}>Sign up</Text>
            </Pressable>
            <Pressable onPress={forgotPassword} disabled={loading}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </Pressable>
        </View>
    );
}

// ... (Styles remain the same, adding a few new ones)
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#121212' },
    header: { fontSize: 32, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 10 },
    description: { fontSize: 16, color: '#888', textAlign: 'center', marginBottom: 30 },
    input: { backgroundColor: '#1e1e1e', color: 'white', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#333', marginBottom: 15 },
    button: { backgroundColor: '#0a84ff', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
    buttonText: { color: 'white', fontWeight: 'bold' },
    buttonOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#0a84ff' },
    buttonOutlineText: { color: '#0a84ff', fontWeight: 'bold' },
    forgotPasswordText: { color: '#0a84ff', textAlign: 'center', marginTop: 15 },
});