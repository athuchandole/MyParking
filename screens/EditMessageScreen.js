// Parking/screens/EditMessageScreen.js

import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert
} from "react-native";
import Header from "../components/Header";
import { getMessageTemplates, saveMessageTemplates } from "../storage/MessageTemplateStorage";

const AVAILABLE_VARS = [
    "@vehicleNumber",
    "@driverName",
    "@phoneNumber",
    "@vehicleType",
    "@rate",
    "@perHours",
    "@entryTime",
    "@exitTime",
    "@duration",
    "@billableBlocks",
    "@amount"
];

export default function EditMessageScreen({ navigation }) {
    const [activeTemplate, setActiveTemplate] = useState("");
    const [inactiveTemplate, setInactiveTemplate] = useState("");
    const [selectedType, setSelectedType] = useState("active");
    const [editing, setEditing] = useState(false);
    const [originalTemplates, setOriginalTemplates] = useState({ active: "", inactive: "" });
    const [selection, setSelection] = useState({ start: 0, end: 0 });

    const scrollRef = useRef();
    const editorRef = useRef();

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        const data = await getMessageTemplates();
        setActiveTemplate(data.active);
        setInactiveTemplate(data.inactive);
        setOriginalTemplates({ active: data.active, inactive: data.inactive });
    };

    const hasChanges = () => {
        return selectedType === "active"
            ? activeTemplate !== originalTemplates.active
            : inactiveTemplate !== originalTemplates.inactive;
    };

    const saveTemplates = async () => {
        await saveMessageTemplates({
            active: activeTemplate,
            inactive: inactiveTemplate
        });
        setOriginalTemplates({ active: activeTemplate, inactive: inactiveTemplate });
        Alert.alert("Success", "Templates saved");
        setEditing(false);
    };

    const cancelEditing = () => {
        if (selectedType === "active") setActiveTemplate(originalTemplates.active);
        else setInactiveTemplate(originalTemplates.inactive);
        setEditing(false);
    };

    const handleVarPress = (variable) => {
        const currentText = getCurrentTemplate();
        const start = selection.start;
        const end = selection.end;
        const newText = currentText.slice(0, start) + variable + currentText.slice(end);
        setCurrentTemplate(newText);
        const cursorPos = start + variable.length;
        setSelection({ start: cursorPos, end: cursorPos });
        editorRef.current?.focus();
    };

    const getCurrentTemplate = () => (selectedType === "active" ? activeTemplate : inactiveTemplate);
    const setCurrentTemplate = (text) => {
        selectedType === "active" ? setActiveTemplate(text) : setInactiveTemplate(text);
    };

    // Render preview with variables + bold/italic formatting
    const renderPreview = () => {
        const message = getCurrentTemplate();

        // Split text by variable first
        const varParts = message.split(/(@\w+)/g);

        return (
            <View style={styles.whatsappBubble}>
                <Text style={styles.previewText}>
                    {varParts.map((part, index) => {
                        if (AVAILABLE_VARS.includes(part)) {
                            return (
                                <Text key={index} style={styles.highlightVar}>
                                    {part}
                                </Text>
                            );
                        } else {
                            // Apply bold (*) and italic (_) rules
                            const tokens = part.split(/(\*[^*]+\*|_[^_]+_)/g).filter(Boolean);
                            return tokens.map((t, i) => {
                                if (t.startsWith("*") && t.endsWith("*")) {
                                    return (
                                        <Text key={i} style={{ fontWeight: "700" }}>
                                            {t.slice(1, -1)}
                                        </Text>
                                    );
                                } else if (t.startsWith("_") && t.endsWith("_")) {
                                    return (
                                        <Text key={i} style={{ fontStyle: "italic" }}>
                                            {t.slice(1, -1)}
                                        </Text>
                                    );
                                } else {
                                    return <Text key={i}>{t}</Text>;
                                }
                            });
                        }
                    })}
                </Text>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
            <Header title="Edit WhatsApp Message" navigation={navigation} />

            <ScrollView style={{ padding: 16 }} ref={scrollRef} keyboardShouldPersistTaps="handled">

                {/* Selector */}
                <View style={styles.selectorContainer}>
                    <TouchableOpacity
                        style={[styles.selectorBtn, selectedType === "active" && styles.selectorActive]}
                        onPress={() => setSelectedType("active")}
                    >
                        <Text style={[styles.selectorText, selectedType === "active" && styles.selectorTextActive]}>
                            Parking Message
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.selectorBtn, selectedType === "inactive" && styles.selectorActive]}
                        onPress={() => setSelectedType("inactive")}
                    >
                        <Text style={[styles.selectorText, selectedType === "inactive" && styles.selectorTextActive]}>
                            Exit Message
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* WhatsApp Preview */}
                <Text style={styles.editorLabel}>WhatsApp Preview</Text>
                {renderPreview()}

                {/* Edit pencil */}
                {!editing && (
                    <TouchableOpacity style={styles.editPencil} onPress={() => setEditing(true)}>
                        <Text style={styles.editPencilText}>✏️ Edit Message</Text>
                    </TouchableOpacity>
                )}

                {/* Available Variables above editor */}
                {editing && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                        {AVAILABLE_VARS.map(v => (
                            <TouchableOpacity
                                key={v}
                                style={styles.varBtn}
                                onPress={() => handleVarPress(v)}
                            >
                                <Text style={styles.varText}>{v}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                {/* Editor */}
                {editing && (
                    <View style={styles.editorWrapper}>
                        {/* X button top-right inside editor */}
                        <TouchableOpacity style={styles.closeButton} onPress={cancelEditing}>
                            <Text style={styles.closeButtonText}>✖</Text>
                        </TouchableOpacity>

                        <TextInput
                            ref={editorRef}
                            multiline
                            value={getCurrentTemplate()}
                            onChangeText={setCurrentTemplate}
                            style={styles.editorInput}
                            placeholder="Edit your template here..."
                            selection={selection}
                            onSelectionChange={({ nativeEvent: { selection } }) => setSelection(selection)}
                        />
                    </View>
                )}

                {/* Save button */}
                {hasChanges() && editing && (
                    <TouchableOpacity style={styles.saveBtn} onPress={saveTemplates}>
                        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Save Templates</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    varBtn: {
        backgroundColor: "#e0f2fe",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 25,
        marginRight: 8,
        borderWidth: 1,
        borderColor: "#38bdf8"
    },
    varText: {
        color: "#0369a1",
        fontWeight: "600"
    },
    selectorContainer: {
        flexDirection: "row",
        marginVertical: 16,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#f1f5f9",
        borderWidth: 1,
        borderColor: "#cbd5e1"
    },
    selectorBtn: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center"
    },
    selectorActive: {
        backgroundColor: "#2563eb"
    },
    selectorText: {
        fontWeight: "600",
        color: "#475569"
    },
    selectorTextActive: {
        color: "#fff"
    },
    editorLabel: {
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 8,
        color: "#1f2937"
    },
    whatsappBubble: {
        alignSelf: "flex-start",
        maxWidth: "85%",
        backgroundColor: "#dcf8c6",
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginBottom: 12
    },
    previewText: {
        color: "#111",
        fontSize: 14,
        lineHeight: 20
    },
    highlightVar: {
        color: "#1d4ed8",
        fontWeight: "600",
        fontSize: 14,
        lineHeight: 20
    },
    editPencil: {
        alignSelf: "flex-end",
        marginBottom: 16
    },
    editPencilText: {
        color: "#2563eb",
        fontWeight: "700",
        fontSize: 16
    },
    editorWrapper: {
        position: "relative",
        backgroundColor: "#fff",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        minHeight: 160,
        marginBottom: 20,
        padding: 14
    },
    closeButton: {
        position: "absolute",
        top: 8,
        right: 8,
        zIndex: 2,
        padding: 6
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#ef4444"
    },
    editorInput: {
        fontSize: 14,
        lineHeight: 20,
        textAlignVertical: "top",
        color: "#111"
    },
    saveBtn: {
        backgroundColor: "#2563eb",
        marginBottom: 20,
        height: 52,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3
    }
});