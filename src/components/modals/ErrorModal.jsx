import { useEffect } from "react"
import { BackHandler, Keyboard, StyleSheet, Text, TouchableNativeFeedback, TouchableWithoutFeedback, View } from "react-native"
import { Portal } from "react-native-portalize"
import Animated, { withSpring, withTiming } from "react-native-reanimated"
import { COLORS } from "../../styles/COLORS"

export default function ErrorModal({ onClose, title = "Erreur", body = "Identifiants incorrects", handleTitle = "Réessayer", handleClose, type = 'error' }) {
    const entering = () => {
        'worklet';
        const animations = {
            transform: [{ scale: withSpring(1) }],
            opacity: withTiming(1, { duration: 150 }),
        };
        const initialValues = {
            transform: [{ scale: 1.1 }],
            opacity: 0
        };
        return {
            initialValues,
            animations,
        };
    };
    const exiting = () => {
        'worklet';
        const animations = {
            transform: [{ scale: withTiming(1.2, { duration: 100 }) }],
            opacity: withTiming(0, { duration: 150 }),
        };
        const initialValues = {
            transform: [{ scale: 1 }],
            opacity: 1
        };
        return {
            initialValues,
            animations,
        }
    }
    const enteringContainer = () => {
        'worklet';
        const animations = {
            opacity: withTiming(1, { duration: 150 }),
        };
        const initialValues = {
            opacity: 0
        };
        return {
            initialValues,
            animations,
        };
    };
    const exitingContainer = () => {
        'worklet';
        const animations = {
            opacity: withTiming(0, { duration: 150 }),
        };
        const initialValues = {
            opacity: 1
        };
        return {
            initialValues,
            animations,
        }
    }
    useEffect(() => {
        Keyboard.dismiss()
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            onClose()
            if (handleClose) handleClose()
            return true
        })
        return () => {
            backHandler.remove()
            onClose()
            if (handleClose) handleClose()
        }
    }, [])
    return (
        <Portal>
            <TouchableWithoutFeedback onPress={onClose}>
                <Animated.View style={styles.modalContainer} entering={enteringContainer} exiting={exitingContainer}>
                    <TouchableWithoutFeedback>
                        <Animated.View style={{ ...styles.modalContent }} entering={entering} exiting={exiting}>
                            <Text style={[styles.title, type == 'success' && { color: COLORS.primary }]}>
                                {title}
                            </Text>
                            <Text style={styles.errorDescription}>
                                {body}
                            </Text>
                            <TouchableNativeFeedback onPress={onClose}>
                                <View style={styles.handleBtn}>
                                    <Text style={styles.handleBtnText}>
                                        {handleTitle}
                                    </Text>
                                </View>
                            </TouchableNativeFeedback>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </Animated.View>
            </TouchableWithoutFeedback>
        </Portal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
        position: "absolute",
        zIndex: 1,
        width: "100%",
        height: "100%"
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        alignSelf: 'center',
        width: "80%",
        maxWidth: 400,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#C4C4C4'
    },
    title: {
        fontSize: 18,
        color: 'red',
        opacity: 0.6,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 20
    },
    errorDescription: {
        textAlign: "center",
        marginVertical: 15,
        color: '#777'
    },
    handleBtn: {
        paddingVertical: 15,
        borderTopWidth: 0.5,
        borderTopColor: '#ddd'
    },
    handleBtnText: {
        textAlign: "center",
        fontWeight: "bold",
        color: COLORS.primary

    }
})