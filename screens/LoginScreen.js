import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../api/api';
import { getTokenFromResponse, getUserFromResponse, useAuth } from '../src/contexts/auth-context';
import ScreenBackground from './ScreenBackground';
import { isValidEmail } from './form-validation';

export default function LoginScreen() {
    const router = useRouter();
    const { setSession } = useAuth();
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [passTouched, setPassTouched] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const emailError =
        (emailTouched || submitAttempted) && !email.trim()
            ? 'Email address is required.'
            : (emailTouched || submitAttempted) && !isValidEmail(email)
                ? 'Enter a valid email address.'
                : '';
    const passError =
        (passTouched || submitAttempted) && !pass.trim()
            ? 'Password is required.'
            : '';

    const handleLogin = async () => {
        if (loading) return;

        setSubmitAttempted(true);
        if (!email.trim() || !isValidEmail(email) || !pass.trim()) {
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/login', {
                email: email.trim(),
                pass,
            });

            const user = getUserFromResponse(response.data) || { email: email.trim() };
            const token = getTokenFromResponse(response.data);
            setSession(user, token);
            router.replace('/profile');
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            Alert.alert("Login failed", "Unable to log in. Check your email and password, then try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScreenBackground />

            <View style={styles.content}>
                <View style={styles.iconWrap}>
                    <Text style={styles.icon}>✦</Text>
                </View>
                <Text style={styles.eyebrow}>WELCOME BACK</Text>
                <Text style={styles.title}>Log in</Text>
                <Text style={styles.subtitle}>Enter your details to continue.</Text>

                <Text style={styles.label}>Email address</Text>
                <TextInput
                    style={[styles.input, emailError && styles.inputError]}
                    placeholder="you@example.com"
                    placeholderTextColor="#758093"
                    value={email}
                    onChangeText={setEmail}
                    onBlur={() => setEmailTouched(true)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={[styles.input, passError && styles.inputError]}
                    placeholder="Enter your password"
                    placeholderTextColor="#758093"
                    value={pass}
                    onChangeText={setPass}
                    onBlur={() => setPassTouched(true)}
                    secureTextEntry
                    autoComplete="current-password"
                />
                {passError ? <Text style={styles.errorText}>{passError}</Text> : null}

                <TouchableOpacity
                    accessibilityRole="button"
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#0A1220" />
                    ) : (
                        <Text style={styles.buttonText}>Log in</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        backgroundColor: '#090B10',
        justifyContent: 'center',
    },
    content: {
        alignSelf: 'center',
        width: '100%',
        maxWidth: 430,
    },
    iconWrap: {
        width: 54,
        height: 54,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#324361',
        backgroundColor: '#151F30',
        marginBottom: 24,
    },
    icon: {
        color: '#A8CBFF',
        fontSize: 28,
    },
    eyebrow: {
        color: '#8EB9FF',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: 10,
    },
    title: {
        fontSize: 34,
        fontWeight: '700',
        letterSpacing: -0.5,
        color: '#F5F7FB',
    },
    subtitle: {
        color: '#9AA4B4',
        fontSize: 15,
        marginTop: 8,
        marginBottom: 30,
    },
    label: {
        color: '#DDE4EF',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 9,
    },
    input: {
        height: 56,
        borderColor: '#252C39',
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 16,
        marginBottom: 20,
        backgroundColor: '#11151E',
        color: '#F5F7FB',
        fontSize: 15,
    },
    inputError: {
        borderColor: '#FF7777',
    },
    errorText: {
        color: '#FF9999',
        fontSize: 12,
        marginTop: -13,
        marginBottom: 14,
    },
    button: {
        height: 58,
        backgroundColor: '#8AB8FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginTop: 8,
    },
    buttonText: {
        color: '#0A1220',
        fontSize: 16,
        fontWeight: '700',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
});