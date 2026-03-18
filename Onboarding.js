// Parking/Onboarding.js
import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    Animated,
    Easing,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const onboardingData = [
    {
        key: "screen1",
        title: "Welcome to MyParking",
        description: "Parking management made easy.",
        image: require("./assets/welcome.png"),
        backgroundColor: "#E0F7FA",
        gradientStart: "#B2EBF2",
        gradientEnd: "#80DEEA",
    },
    {
        key: "screen2",
        title: "Dashboard Support",
        description: "Monitor parking lots and availability in real-time.",
        image: require("./assets/dashboard.png"),
        backgroundColor: "#FFF3E0",
        gradientStart: "#FFE0B2",
        gradientEnd: "#FFCC80",
    },
    {
        key: "screen3",
        title: "WhatsApp Messaging",
        description: "Send automated messages to vehicle owners instantly.",
        image: require("./assets/massages.png"),
        backgroundColor: "#F3E5F5",
        gradientStart: "#E1BEE7",
        gradientEnd: "#CE93D8",
    },
];

export default function Onboarding() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigation = useNavigation();

    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(width)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        animateScreen();
    }, [currentIndex]);

    const animateScreen = () => {
        fadeAnim.setValue(0);
        slideAnim.setValue(width);
        scaleAnim.setValue(0.8);
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 30,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleNext = async () => {
        if (currentIndex < onboardingData.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            await AsyncStorage.setItem("hasSeenOnboarding", "true");
            navigation.replace("Home");
        }
    };

    const handleSkip = async () => {
        await AsyncStorage.setItem("hasSeenOnboarding", "true");
        navigation.replace("Home");
    };

    const renderDots = () => {
        return (
            <View style={styles.dotsContainer}>
                {onboardingData.map((_, index) => {
                    const scale = currentIndex === index ? 1.6 : 1;
                    const color = currentIndex === index ? "#137fec" : "#ccc";
                    return (
                        <Animated.View
                            key={index}
                            style={[
                                styles.dot,
                                { backgroundColor: color, transform: [{ scale }] },
                            ]}
                        />
                    );
                })}
            </View>
        );
    };

    const { title, description, image, backgroundColor } = onboardingData[currentIndex];

    return (
        <Animated.View style={[styles.container, { backgroundColor }]}>
            {/* Skip button */}
            <View style={styles.topRight}>
                <TouchableOpacity onPress={handleSkip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            {/* Animated Onboarding content */}
            <Animated.View
                style={[
                    styles.content,
                    { opacity: fadeAnim, transform: [{ translateX: slideAnim }, { scale: scaleAnim }] },
                ]}
            >
                <Image source={image} style={styles.image} resizeMode="contain" />
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </Animated.View>

            {/* Dots */}
            {renderDots()}

            {/* Continue/Get Started Button */}
            <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>
                    {currentIndex === onboardingData.length - 1 ? "Get Started" : "Continue"}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    topRight: {
        alignItems: "flex-end",
    },
    skipText: {
        color: "#137fec",
        fontWeight: "600",
        fontSize: 16,
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    image: {
        width: width * 0.7,
        height: width * 0.7,
        marginBottom: 30,
        borderRadius: 30,
    },
    title: {
        fontSize: 30,
        fontWeight: "900",
        textAlign: "center",
        marginBottom: 14,
        color: "#101922",
    },
    description: {
        fontSize: 18,
        textAlign: "center",
        color: "#606770",
        lineHeight: 28,
        maxWidth: width * 0.8,
    },
    dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 30,
        gap: 12,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    button: {
        backgroundColor: "#137fec",
        paddingVertical: 18,
        borderRadius: 40,
        alignItems: "center",
        alignSelf: "center",
        width: width * 0.7,
    },
    buttonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
});