// components/CameraCaptureModal.js

import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Alert, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function CameraCaptureModal({
    visible,
    onClose,
    onCapture
}) {
    const cameraRef = useRef(null);
    const [flash, setFlash] = useState('off');

    const [permission, requestPermission] = useCameraPermissions();

    const handleOpen = async () => {
        if (!permission) {
            Alert.alert("Loading", "Camera permission loading...");
            return false;
        }

        if (!permission.granted) {
            const res = await requestPermission();

            if (!res.granted) {
                Alert.alert(
                    "Permission Required",
                    "Camera permission is needed",
                    [
                        { text: "Cancel" },
                        { text: "Open Settings", onPress: () => Linking.openSettings() }
                    ]
                );
                return false;
            }
        }

        return true;
    };

    const takePhoto = async () => {
        if (!cameraRef.current) return;

        const photo = await cameraRef.current.takePictureAsync({ quality: 0.6 });

        onCapture(photo.uri);
        onClose();
    };

    // Prevent modal opening without permission
    if (visible) {
        handleOpen();
    }

    if (!permission) return null;

    return (
        <Modal visible={visible} animationType="slide">
            <View style={styles.container}>

                <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing="back"
                    flash={flash}
                />

                {/* Flash Toggle */}
                <TouchableOpacity
                    style={styles.flashBtn}
                    onPress={() => setFlash(flash === 'off' ? 'on' : 'off')}
                >
                    <MaterialCommunityIcons
                        name={flash === 'on' ? 'flash' : 'flash-off'}
                        size={28}
                        color="#fff"
                    />
                </TouchableOpacity>

                {/* Capture */}
                <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
                    <MaterialCommunityIcons name="camera" size={32} color="#fff" />
                </TouchableOpacity>

                {/* Close */}
                <TouchableOpacity style={styles.closeCamera} onPress={onClose}>
                    <MaterialCommunityIcons name="close" size={28} color="#fff" />
                </TouchableOpacity>

            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center'
    },
    camera: {
        width: 260,
        height: 360,
        borderRadius: 20,
        overflow: 'hidden'
    },
    captureButton: {
        position: 'absolute',
        bottom: 60,
        backgroundColor: '#137fec',
        width: 70,
        height: 70,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    flashBtn: {
        position: 'absolute',
        top: 60,
        right: 30
    },
    closeCamera: {
        position: 'absolute',
        top: 60,
        left: 30
    }
});