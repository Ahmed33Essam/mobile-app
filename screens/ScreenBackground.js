import { Image, StyleSheet, View } from 'react-native';

export default function ScreenBackground() {
    return (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <Image
                accessibilityIgnoresInvertColors
                source={require('../assets/images/logo-glow.png')}
                resizeMode="contain"
                style={styles.topGlow}
            />
            <Image
                accessibilityIgnoresInvertColors
                source={require('../assets/images/logo-glow.png')}
                resizeMode="contain"
                style={styles.bottomGlow}
            />
            <View style={styles.topRing} />
            <View style={styles.bottomRing} />
        </View>
    );
}

const styles = StyleSheet.create({
    topGlow: {
        position: 'absolute',
        width: 340,
        height: 340,
        top: -190,
        right: -180,
        opacity: 0.2,
    },
    bottomGlow: {
        position: 'absolute',
        width: 300,
        height: 300,
        bottom: -190,
        left: -175,
        opacity: 0.12,
    },
    topRing: {
        position: 'absolute',
        width: 240,
        height: 240,
        top: -132,
        right: -120,
        borderRadius: 120,
        borderWidth: 1,
        borderColor: 'rgba(86, 156, 255, 0.2)',
    },
    bottomRing: {
        position: 'absolute',
        width: 190,
        height: 190,
        bottom: -112,
        left: -92,
        borderRadius: 95,
        borderWidth: 1,
        borderColor: 'rgba(86, 156, 255, 0.16)',
    },
});
