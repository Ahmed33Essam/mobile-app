import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenBackground from './ScreenBackground';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <ScreenBackground />

            <View style={styles.content}>
                <View style={styles.artwork}>
                    <Image
                        source={require('../assets/images/logo-glow.png')}
                        resizeMode="contain"
                        style={styles.artworkGlow}
                    />
                    <View style={styles.artworkRing}>
                        <View style={styles.artworkCore}>
                            <Text style={styles.artworkMark}>M</Text>
                        </View>
                    </View>
                    <View style={styles.artworkDot} />
                </View>

                <Text style={styles.eyebrow}>YOUR NEXT CHAPTER STARTS HERE</Text>
                <Text style={styles.title}>Welcome{'\n'}to your space.</Text>
                <Text style={styles.subtitle}>
                    A simpler way to stay connected. Sign in or create your account to get started.
                </Text>

                <TouchableOpacity
                    accessibilityRole="button"
                    style={styles.primaryButton}
                    onPress={() => router.push('/login')}
                >
                    <Text style={styles.primaryButtonText}>Log in</Text>
                    <Text style={styles.buttonArrow}></Text>
                </TouchableOpacity>

                <TouchableOpacity
                    accessibilityRole="button"
                    style={styles.secondaryButton}
                    onPress={() => router.push('/signup')}
                >
                    <Text style={styles.secondaryButtonText}>Create an account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 26,
        backgroundColor: '#090B10',
    },
    content: {
        alignSelf: 'center',
        width: '100%',
        maxWidth: 430,
    },
    artwork: {
        height: 245,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    artworkGlow: {
        position: 'absolute',
        width: 270,
        height: 270,
        opacity: 0.62,
    },
    artworkRing: {
        width: 156,
        height: 156,
        borderRadius: 78,
        borderWidth: 1,
        borderColor: 'rgba(116, 169, 255, 0.45)',
        backgroundColor: 'rgba(16, 25, 42, 0.55)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    artworkCore: {
        width: 112,
        height: 112,
        borderRadius: 36,
        backgroundColor: '#17243A',
        borderWidth: 1,
        borderColor: 'rgba(148, 190, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ rotate: '-8deg' }],
    },
    artworkMark: {
        color: '#A8CBFF',
        fontSize: 54,
        fontWeight: '700',
        transform: [{ rotate: '8deg' }],
    },
    artworkDot: {
        position: 'absolute',
        right: '22%',
        bottom: 42,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#78ACFF',
        borderWidth: 3,
        borderColor: '#111722',
    },
    eyebrow: {
        color: '#8EB9FF',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: 14,
        textAlign: 'center',
    },
    title: {
        color: '#F5F7FB',
        fontSize: 38,
        fontWeight: '700',
        letterSpacing: -1,
        lineHeight: 44,
        textAlign: 'center',
    },
    subtitle: {
        color: '#9AA4B4',
        fontSize: 15,
        lineHeight: 23,
        marginBottom: 28,
        marginTop: 14,
        textAlign: 'center',
    },
    primaryButton: {
        alignItems: 'center',
        backgroundColor: '#8AB8FF',
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        minHeight: 58,
    },
    primaryButtonText: {
        color: '#0A1220',
        fontSize: 16,
        fontWeight: '700',
    },
    buttonArrow: {
        color: '#0A1220',
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 10,
    },
    secondaryButton: {
        alignItems: 'center',
        backgroundColor: '#11151E',
        borderColor: '#252C39',
        borderRadius: 16,
        borderWidth: 1,
        justifyContent: 'center',
        marginTop: 12,
        minHeight: 58,
    },
    secondaryButtonText: {
        color: '#E4EAF4',
        fontSize: 16,
        fontWeight: '600',
    },
});
