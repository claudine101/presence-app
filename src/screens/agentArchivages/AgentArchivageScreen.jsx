import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { COLORS } from '../../styles/COLORS';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import * as DocumentPicker from 'expo-document-picker';

/**
 * Le screen pour associer un volume a un agents superviseur
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 11/7/2021
 * @returns 
 */

export default function AgentArchivageScreen() {
        const navigation = useNavigation()

        const [data, handleChange, setValue] = useForm({
                numero: '',
        })

        const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
                numero: {
                        required: true
                }
        }, {
                numero: {
                        required: 'ce champ est obligatoire',
                }
        })

        const isValidAdd = () => {
                var isValid = false
                isValid = data.numero > 0 ? true : false
                isValid = volumes > 0 ? true : false
                isValid = agents > 0 ? true : false
                return isValid
        }


        // Volume select
        const volumeModalizeRef = useRef(null);
        const [volumes, setVolumes] = useState(null);
        const openVolumeModalize = () => {
                volumeModalizeRef.current?.open();
        };
        const setSelectedVolume = (vol) => {
                volumeModalizeRef.current?.close();
                setVolumes(vol)
        }

        // Agent archivage select
        const agentModalizeRef = useRef(null);
        const [agents, setAgents] = useState(null);
        const openAgentModalize = () => {
                agentModalizeRef.current?.open();
        };
        const setSelectedAgent = (ag) => {
                agentModalizeRef.current?.close();
                setAgents(ag)
        }

        //Fonction pour upload un documents 
        const selectdocument = async () => {
                setError("document", "")
                handleChange("document", null)
                const document = await DocumentPicker.getDocumentAsync({
                        type: ["image/*", "application/pdf", "application/docx", "application/xls", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
                })
                if (document.type == 'cancel') {
                        return false
                }
                var sizeDocument = ((document.size / 1000) / 1000).toFixed(2)
                if (sizeDocument <= 2) {
                        handleChange("document", document)
                }
                else {
                        setError("document", ["Document trop volumineux(max:2M)"])
                }

        }

        //Modal pour afficher la liste de volumes existants
        const VolumeList = () => {
                return (
                        <>
                                <View style={styles.modalContainer}>
                                        <View style={styles.modalHeader}>
                                                <Text style={styles.modalTitle}>Les volumes</Text>

                                        </View>
                                        <ScrollView>
                                                <TouchableNativeFeedback >
                                                        <View style={styles.modalItem} >
                                                                <View style={styles.modalImageContainer}>
                                                                        <AntDesign name="folderopen" size={20} color="black" />
                                                                </View>
                                                                <Text style={styles.itemTitle}>dgdg</Text>
                                                        </View>
                                                </TouchableNativeFeedback>
                                        </ScrollView>
                                </View>
                        </>
                )
        }

        //Modal pour afficher la liste de agents archivages existants
        const AgentArchivageList = () => {
                return (
                        <>
                                <View style={styles.modalContainer}>
                                        <View style={styles.modalHeader}>
                                                <Text style={styles.modalTitle}>Agents archivages</Text>

                                        </View>
                                        <ScrollView>
                                                <TouchableNativeFeedback >
                                                        <View style={styles.modalItem} >
                                                                <View style={styles.modalImageContainer}>
                                                                        <Feather name="users" size={24} color="black" />
                                                                </View>
                                                                <Text style={styles.itemTitle}>dgdg</Text>
                                                        </View>
                                                </TouchableNativeFeedback>
                                        </ScrollView>
                                </View>
                        </>
                )
        }


        const handleSubmit = async () => {
                try {
                        const form = new FormData()
                        form.append('numero', data.numero)
                        if (data.document) {
                                let localUri = data.document.uri;
                                let filename = localUri.split('/').pop();
                                form.append("document", {
                                        uri: data.document.uri, name: filename, type: data.document.mimeType
                                })
                        }
                        console.log(form)
                }
                catch (error) {
                        console.log(error)
                }
        }

        return (
                <View style={styles.container}>
                        <View style={styles.cardHeader}>
                                <TouchableNativeFeedback
                                        onPress={() => navigation.goBack()}
                                        background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                                        <View style={styles.backBtn}>
                                                <Ionicons name="arrow-back-sharp" size={24} color="#fff" />
                                        </View>
                                </TouchableNativeFeedback>
                                <Text style={styles.titlePrincipal}>Planifier un agent</Text>
                        </View>
                        <ScrollView>
                                <View>
                                        <TouchableOpacity style={styles.selectContainer} onPress={openVolumeModalize}>
                                                <View>
                                                        <Text style={styles.selectLabel}>
                                                                Selectioner le volume
                                                        </Text>
                                                        <View>
                                                                <Text style={styles.selectedValue}>
                                                                        hdhdh
                                                                </Text>
                                                                {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                        <Text style={styles.selectedValue}>
                                                                                M
                                                                        </Text>
                                                                </View> */}
                                                        </View>
                                                </View>
                                        </TouchableOpacity>
                                        <View style={{ marginVertical: 8 }}>
                                                <OutlinedTextField
                                                        label="Nombre de dossier"
                                                        fontSize={14}
                                                        baseColor={COLORS.smallBrown}
                                                        tintColor={COLORS.primary}
                                                        containerStyle={{ borderRadius: 20 }}
                                                        lineWidth={1}
                                                        activeLineWidth={1}
                                                        errorColor={COLORS.error}
                                                        value={data.numero}
                                                        onChangeText={(newValue) => handleChange('numero', newValue)}
                                                        onBlur={() => checkFieldData('numero')}
                                                        error={hasError('numero') ? getError('numero') : ''}
                                                        autoCompleteType='off'
                                                        blurOnSubmit={false}
                                                />
                                        </View>
                                        <TouchableOpacity style={styles.selectContainer} onPress={openAgentModalize}>
                                                <View>
                                                        <Text style={styles.selectLabel}>
                                                                Selectioner un agent d'archive
                                                        </Text>
                                                        <View>
                                                                <Text style={styles.selectedValue}>
                                                                        hdhdh
                                                                </Text>
                                                        </View>
                                                </View>
                                        </TouchableOpacity>
                                        <View>
                                                <TouchableOpacity style={[styles.selectContainer, hasError("document") && { borderColor: "red" }]}
                                                        onPress={selectdocument}
                                                >
                                                        <View>
                                                                <Text style={[styles.selectLabel, hasError("document") && { color: 'red' }]}>
                                                                        Importer le proces verbal
                                                                </Text>
                                                                {data.document ? <View>
                                                                        <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                                                {data.document.name}
                                                                        </Text>
                                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                <Text>{data.document.name.split('.')[1].toUpperCase()} - </Text>
                                                                                <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                                                        {((data.document.size / 1000) / 1000).toFixed(2)} M
                                                                                </Text>
                                                                        </View>
                                                                </View> : null}
                                                        </View>
                                                </TouchableOpacity>
                                        </View>

                                </View>
                        </ScrollView>
                        <TouchableWithoutFeedback
                                disabled={!isValidAdd()}
                                onPress={handleSubmit}
                        >
                                <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                                        <Text style={styles.buttonText}>Enregistrer</Text>
                                </View>
                        </TouchableWithoutFeedback>
                        <Portal>
                                <Modalize ref={volumeModalizeRef}  >
                                        <VolumeList />
                                </Modalize>
                        </Portal>
                        <Portal>
                                <Modalize ref={agentModalizeRef}  >
                                        <AgentArchivageList />
                                </Modalize>
                        </Portal>
                </View>
        )
}

const styles = StyleSheet.create({
        container: {
                flex: 1,
                marginHorizontal: 10,
                marginTop: -20
        },
        cardHeader: {
                flexDirection: 'row',
                marginTop: StatusBar.currentHeight,
                alignContent: "center",
                alignItems: "center",
                marginBottom: 15
        },
        backBtn: {
                backgroundColor: COLORS.ecommercePrimaryColor,
                justifyContent: 'center',
                alignItems: 'center',
                width: 50,
                height: 50,
                borderRadius: 50,
        },
        titlePrincipal: {
                fontSize: 18,
                fontWeight: "bold",
                marginLeft: 10,
                color: COLORS.primary
        },
        selectContainer: {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fff",
                padding: 13,
                borderRadius: 5,
                borderWidth: 0.5,
                borderColor: "#777",
                marginVertical: 10
        },
        modalHeader: {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 10,
                paddingVertical: 5
        },
        modalItem: {
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#F1F1F1'
        },
        modalImageContainer: {
                width: 40,
                height: 40,
                backgroundColor: '#F1F1F1',
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center"
        },
        modalImage: {
                width: "85%",
                height: "85%",
                resizeMode: "center",
                borderRadius: 100,
        },
        modalTitle: {
                fontWeight: "bold",
                textAlign: "center",
                marginTop: 10,
                fontSize: 16
        },
        itemTitle: {
                marginLeft: 10
        },
        button: {
                marginTop: 10,
                borderRadius: 8,
                paddingVertical: 14,
                paddingHorizontal: 10,
                backgroundColor: "#18678E",
        },
        buttonText: {
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center"
        },
        selectedValue: {
                color: '#777'
        },
})