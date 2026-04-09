// components/CameraCaptureModal.js

import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Alert,
    Linking,
    ActivityIndicator,
    Text
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function CameraCaptureModal({
    visible,
    onClose,
    onCapture
}) {
    const cameraRef = useRef(null);

    const [flash, setFlash] = useState('off');
    const [facing, setFacing] = useState('back');
    const [zoom, setZoom] = useState(0);
    const [isCapturing, setIsCapturing] = useState(false);

    const lastDistance = useRef(null);

    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        if (visible) handleOpen();
    }, [visible]);

    const handleOpen = async () => {
        if (!permission) return;

        if (!permission.granted) {
            const res = await requestPermission();

            if (!res.granted) {
                Alert.alert(
                    "Permission Required",
                    "Camera permission is needed",
                    [
                        { text: "Cancel", onPress: onClose },
                        { text: "Open Settings", onPress: () => Linking.openSettings() }
                    ]
                );
            }
        }
    };

    const toggleFlash = () => {
        if (flash === 'off') setFlash('on');
        else if (flash === 'on') setFlash('auto');
        else setFlash('off');
    };

    const toggleCamera = () => {
        setFacing(prev => (prev === 'back' ? 'front' : 'back'));
    };

    const takePhoto = async () => {
        if (!cameraRef.current || isCapturing) return;

        try {
            setIsCapturing(true);

            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.7,
            });

            onCapture(photo.uri);
            onClose();
        } catch {
            Alert.alert("Error", "Failed to capture image");
        } finally {
            setIsCapturing(false);
        }
    };

    const handleTouchMove = (event) => {
        const touches = event.nativeEvent.touches;

        if (touches.length === 2) {
            const [t1, t2] = touches;

            const dx = t1.pageX - t2.pageX;
            const dy = t1.pageY - t2.pageY;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (lastDistance.current) {
                let diff = distance - lastDistance.current;

                let newZoom = zoom + diff * 0.002;

                if (newZoom < 0) newZoom = 0;
                if (newZoom > 1) newZoom = 1;

                setZoom(newZoom);
            }

            lastDistance.current = distance;
        }
    };

    const handleTouchEnd = () => {
        lastDistance.current = null;
    };

    if (!permission || !permission.granted) {
        return (
            <Modal visible={visible}>
                <View style={styles.permissionContainer}>
                    <TouchableOpacity onPress={requestPermission}>
                        <MaterialCommunityIcons name="camera" size={40} color="#fff" />
                        <Text style={{ color: '#fff', marginTop: 10 }}>
                            Enable Camera
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} animationType="fade">
            <View
                style={styles.container}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >

                <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing={facing}
                    flash={flash}
                    zoom={zoom}
                />

                {/* TOP BAR */}
                <View style={styles.topBar}>
                    <TouchableOpacity style={styles.iconBtn} onPress={onClose}>
                        <MaterialCommunityIcons name="close" size={26} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.flashPill} onPress={toggleFlash}>
                        <MaterialCommunityIcons
                            name={
                                flash === 'off'
                                    ? 'flash-off'
                                    : flash === 'on'
                                        ? 'flash'
                                        : 'flash-auto'
                            }
                            size={20}
                            color="#fff"
                        />
                        <Text style={styles.flashText}>{flash.toUpperCase()}</Text>
                    </TouchableOpacity>
                </View>

                {/* ZOOM INDICATOR */}
                <View style={styles.zoomIndicator}>
                    <MaterialCommunityIcons name="magnify" size={18} color="#fff" />
                    <Text style={styles.zoomText}>{(zoom * 100).toFixed(0)}%</Text>
                </View>

                {/* BOTTOM BAR */}
                <View style={styles.bottomBar}>

                    <TouchableOpacity style={styles.iconBtn} onPress={toggleCamera}>
                        <MaterialCommunityIcons name="camera-switch" size={28} color="#fff" />
                    </TouchableOpacity>

                    {/* CAPTURE BUTTON */}
                    <TouchableOpacity
                        style={styles.captureOuter}
                        onPress={takePhoto}
                        disabled={isCapturing}
                    >
                        <View style={styles.captureInner}>
                            {isCapturing && <ActivityIndicator color="#fff" />}
                        </View>
                    </TouchableOpacity>

                    <View style={{ width: 40 }} />

                </View>

            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },

    camera: {
        flex: 1
    },

    topBar: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    iconBtn: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 10,
        borderRadius: 50
    },

    flashPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20
    },

    flashText: {
        color: '#fff',
        fontSize: 12
    },

    zoomIndicator: {
        position: 'absolute',
        top: '45%',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20
    },

    zoomText: {
        color: '#fff',
        fontSize: 13
    },

    bottomBar: {
        position: 'absolute',
        bottom: 50,
        left: 30,
        right: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    captureOuter: {
        width: 80,
        height: 80,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },

    captureInner: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: '#137fec',
        alignItems: 'center',
        justifyContent: 'center'
    },

    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    }
});