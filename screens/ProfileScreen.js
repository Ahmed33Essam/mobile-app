import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import api from '../api/api';
import { getUserFromResponse, useAuth } from '../src/contexts/auth-context';
import ScreenBackground from './ScreenBackground';

function getTextValue(user, keys) {
    for (const key of keys) {
        const value = user?.[key];
        if (typeof value === 'string' && value.trim()) return value.trim();
        if (typeof value === 'number') return String(value);
    }
    return null;
}

export default function ProfileScreen() {
    const router = useRouter();
    const { user, token, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(Boolean(token && !user));
    const [loadError, setLoadError] = useState(null);

    useEffect(() => {
        let isActive = true;

        if (!token) {
            return () => {
                isActive = false;
            };
        }

        api.get('/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                const fetchedProfile = getUserFromResponse(response.data);
                if (!fetchedProfile) {
                    throw new Error('The server did not return profile details.');
                }
                if (isActive) {
                    setProfile(fetchedProfile);
                    setLoadError(null);
                }
            })
            .catch((error) => {
                console.error('Profile error:', error.response?.data || error.message);
                if (isActive) {
                    setLoadError(
                        error.response?.data?.message ||
                        error.message ||
                        'Could not refresh your profile.'
                    );
                }
            })
            .finally(() => {
                if (isActive) setLoading(false);
            });

        return () => {
            isActive = false;
        };
    }, [token]);

    const handleLogout = () => {
        logout();
        router.replace('/');
    };

    const displayedProfile = profile || user;
    const name = getTextValue(displayedProfile, ['name', 'fullName', 'username']);
    const email = getTextValue(displayedProfile, ['email']);
    const gender = getTextValue(displayedProfile, ['gender']);
    const phone = getTextValue(displayedProfile, ['phone', 'phoneNumber', 'phone_number']);
    const image = getTextValue(displayedProfile, ['profileImage', 'image', 'avatar', 'photo']);

    if (loading) {
        return (
            <View style={styles.screen}>
                <ScreenBackground />
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#8AB8FF" />
                    <Text style={styles.loadingText}>Loading your profile...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <ScreenBackground />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.avatarFrame}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>
                                {(name || email || 'U').charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <View style={styles.onlineDot} />
                </View>

                <Text style={styles.eyebrow}>ACCOUNT</Text>
                <Text style={styles.title}>Your profile</Text>
                {name ? <Text style={styles.name}>{name}</Text> : null}

                <View style={styles.infoBox}>
                    <Text style={styles.sectionTitle}>Personal details</Text>
                    {email ? <ProfileField label="Email" value={email} /> : null}
                    {gender ? <ProfileField label="Gender" value={gender} /> : null}
                    {phone ? <ProfileField label="Phone" value={phone} /> : null}
                    {!email && !gender && !phone ? (
                        <Text style={styles.emptyText}>No profile details are available.</Text>
                    ) : null}
                </View>

                {loadError ? (
                    <Text accessibilityRole="alert" style={styles.errorText}>
                        Your saved profile is shown, but it could not be refreshed: {loadError}
                    </Text>
                ) : null}

                <TouchableOpacity
                    accessibilityRole="button"
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutIcon}>↗</Text>
                    <Text style={styles.logoutButtonText}>Log out</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

function ProfileField({ label, value }) {
    return (
        <View style={styles.field}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <Text style={styles.fieldValue}>{value}</Text>
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
        alignItems: 'center',
        padding: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#A0A9B8',
        marginTop: 12,
    },
    avatarFrame: {
        position: 'relative',
        marginBottom: 22,
        borderRadius: 44,
        padding: 5,
        borderWidth: 1,
        borderColor: '#324361',
        backgroundColor: '#111722',
    },
    avatar: {
        width: 112,
        height: 112,
        borderRadius: 38,
    },
    avatarPlaceholder: {
        width: 112,
        height: 112,
        borderRadius: 38,
        backgroundColor: '#17243A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#A8CBFF',
        fontSize: 40,
        fontWeight: '700',
    },
    onlineDot: {
        position: 'absolute',
        right: 4,
        bottom: 4,
        width: 17,
        height: 17,
        borderRadius: 9,
        backgroundColor: '#8AB8FF',
        borderWidth: 3,
        borderColor: '#090B10',
    },
    eyebrow: {
        color: '#8EB9FF',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: 8,
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
        color: '#F5F7FB',
        letterSpacing: -0.5,
    },
    name: {
        fontSize: 16,
        color: '#A0A9B8',
        marginTop: 8,
        marginBottom: 28,
    },
    infoBox: {
        width: '100%',
        backgroundColor: '#11151E',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#252C39',
    },
    sectionTitle: {
        color: '#F5F7FB',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 20,
    },
    field: {
        marginBottom: 18,
    },
    fieldLabel: {
        color: '#8994A6',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.4,
        marginBottom: 6,
    },
    fieldValue: {
        color: '#E8EDF5',
        fontSize: 16,
    },
    emptyText: {
        color: '#9AA4B4',
        fontSize: 15,
    },
    errorText: {
        color: '#FF9A9A',
        fontSize: 14,
        marginTop: 16,
    },
    logoutButton: {
        width: '100%',
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#151923',
        borderWidth: 1,
        borderColor: '#303848',
        borderRadius: 16,
        marginTop: 22,
    },
    logoutIcon: {
        color: '#FF9A9A',
        fontSize: 18,
        marginRight: 9,
    },
    logoutButtonText: {
        color: '#FFB0B0',
        fontSize: 16,
        fontWeight: '700',
    },
});
