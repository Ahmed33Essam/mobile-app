import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../api/api';
import ScreenBackground from './ScreenBackground';
import { isValidEmail } from './form-validation';

function capitalizeFirstLetter(value) {
    const lowercase = value.toLowerCase();
    return lowercase ? lowercase[0].toUpperCase() + lowercase.slice(1) : '';
}

export default function SignupScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({});

    const emailError = touched.email && email.trim() && !isValidEmail(email)
        ? 'Enter a valid email address.'
        : touched.email && !email.trim()
            ? 'Email address is required.'
            : '';
    const nameError = touched.name && !name.trim() ? 'Name is required.' : '';
    const passError = touched.pass && !pass.trim() ? 'Password is required.' : '';
    const genderError = touched.gender && !gender.trim() ? 'Gender is required.' : '';
    const phoneError = touched.phone && !phone.trim() ? 'Phone number is required.' : '';
    const isFormValid =
        Boolean(name.trim()) &&
        isValidEmail(email) &&
        Boolean(pass.trim()) &&
        Boolean(gender.trim()) &&
        Boolean(phone.trim());

    const markTouched = (field) => {
        setTouched((current) => ({ ...current, [field]: true }));
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSignup = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('email', email.trim());
            formData.append('pass', pass);
            formData.append('gender', gender.trim().toLowerCase());
            formData.append('phone', phone.trim());

            if (image) {
                const localUri = image;
                const filename = localUri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image`;

                formData.append('image', {
                    uri: localUri,
                    name: filename,
                    type,
                });
            }

            await api.post('/auth/signup', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            router.replace('/login');
        } catch (error) {
            console.error("Signup error:", error.response?.data || error.message);
            Alert.alert("Error", error.response?.data?.message || "An error occurred during signup");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.screen}>
            <ScreenBackground />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.container}
            >
                <View style={styles.form}>
                    <Text style={styles.eyebrow}>GET STARTED</Text>
                    <Text style={styles.title}>Create your account</Text>
                    <Text style={styles.subtitle}>A few details and you’ll be ready to go.</Text>

                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel="Choose a profile photo"
                        style={styles.imagePicker}
                        onPress={pickImage}
                    >
                        {image ? (
                            <Image source={{ uri: image }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Text style={styles.imageIcon}>＋</Text>
                                <Text style={styles.imageText}>Add a photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.label}>Name *</Text>
                    <TextInput
                        style={[styles.input, nameError && styles.inputError]}
                        placeholder="Your name"
                        placeholderTextColor="#758093"
                        value={name}
                        onChangeText={setName}
                        onBlur={() => markTouched('name')}
                    />
                    {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                    <Text style={styles.label}>Email address *</Text>
                    <TextInput
                        style={[styles.input, emailError && styles.inputError]}
                        placeholder="you@example.com"
                        placeholderTextColor="#758093"
                        value={email}
                        onChangeText={setEmail}
                        onBlur={() => markTouched('email')}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        textContentType="emailAddress"
                    />
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                    <Text style={styles.label}>Password *</Text>
                    <TextInput
                        style={[styles.input, passError && styles.inputError]}
                        placeholder="Create a password"
                        placeholderTextColor="#758093"
                        value={pass}
                        onChangeText={setPass}
                        onBlur={() => markTouched('pass')}
                        secureTextEntry
                        autoComplete="new-password"
                    />
                    {passError ? <Text style={styles.errorText}>{passError}</Text> : null}
                    <Text style={styles.label}>Gender *</Text>
                    <TextInput
                        style={[styles.input, genderError && styles.inputError]}
                        placeholder="Male or Female"
                        placeholderTextColor="#758093"
                        value={gender}
                        onChangeText={(value) => setGender(capitalizeFirstLetter(value))}
                        onBlur={() => markTouched('gender')}
                        autoCapitalize="none"
                    />
                    {genderError ? <Text style={styles.errorText}>{genderError}</Text> : null}
                    <Text style={styles.label}>Phone number *</Text>
                    <TextInput
                        style={[styles.input, phoneError && styles.inputError]}
                        placeholder="+1 555 000 0000"
                        placeholderTextColor="#758093"
                        value={phone}
                        onChangeText={setPhone}
                        onBlur={() => markTouched('phone')}
                        keyboardType="phone-pad"
                    />
                    {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityState={{ disabled: loading || !isFormValid }}
                        style={[styles.button, (loading || !isFormValid) && styles.buttonDisabled]}
                        onPress={handleSignup}
                        disabled={loading || !isFormValid}
                    >
                        {loading ? (
                            <ActivityIndicator color="#0A1220" />
                        ) : (
                            <Text style={styles.buttonText}>Create account</Text>
                        )}
                    </TouchableOpacity>
                    {!isFormValid ? (
                        <Text style={styles.requiredHint}>
                            Complete all required fields and enter a valid email to continue.
                        </Text>
                    ) : null}

                    <TouchableOpacity
                        accessibilityRole="button"
                        style={styles.linkButton}
                        onPress={() => router.push('/login')}
                    >
                        <Text style={styles.linkText}>
                            <Text style={styles.linkMuted}>Already have an account? </Text>
                            Log in
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#090B10',
    },
    container: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 44,
        paddingBottom: 36,
        justifyContent: 'center',
    },
    form: {
        alignSelf: 'center',
        width: '100%',
        maxWidth: 430,
    },
    eyebrow: {
        color: '#8EB9FF',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: 10,
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
        letterSpacing: -0.5,
        color: '#F5F7FB',
    },
    subtitle: {
        color: '#9AA4B4',
        fontSize: 14,
        lineHeight: 21,
        marginTop: 8,
        marginBottom: 22,
    },
    imagePicker: {
        alignSelf: 'center',
        width: 104,
        height: 104,
        borderRadius: 34,
        backgroundColor: '#151F30',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#324361',
        overflow: 'hidden',
    },
    imagePlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 33,
    },
    imageIcon: {
        color: '#A8CBFF',
        fontSize: 30,
        lineHeight: 34,
    },
    imageText: {
        fontSize: 11,
        color: '#B8C6DA',
        textAlign: 'center',
    },
    label: {
        color: '#DDE4EF',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        height: 54,
        borderColor: '#252C39',
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 15,
        marginBottom: 17,
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
        opacity: 0.45,
    },
    requiredHint: {
        color: '#9AA4B4',
        fontSize: 12,
        lineHeight: 18,
        marginTop: 12,
        textAlign: 'center',
    },
    linkButton: {
        marginTop: 22,
        alignItems: 'center',
    },
    linkText: {
        color: '#A8CBFF',
        fontSize: 14,
        fontWeight: '600',
    },
    linkMuted: {
        color: '#9AA4B4',
        fontWeight: '400',
    },
});