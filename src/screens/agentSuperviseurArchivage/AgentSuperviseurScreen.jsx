import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { COLORS } from '../../styles/COLORS';
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import * as DocumentPicker from 'expo-document-picker';

/**
 * Le screen pour details le volume, le dossier utilisable par un agent superviseur
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 12/7/2021
 * @returns 
 */


export default function AgentSuperviseurScreen() {
        const navigation = useNavigation()

        const [data, handleChange, setValue] = useForm({
                dossier: '',
                folio: '',
        })

        const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
                dossier: {
                        required: true
                },
                folio: {
                        required: true
                }
        }, {
                dossier: {
                        required: 'ce champ est obligatoire',
                },
                folio: {
                        required: 'ce champ est obligatoire',
                }
        })

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

        // Nature du dossier select
        const natureModalizeRef = useRef(null);
        const [natures, setNatures] = useState(null);
        const openNaturesModalize = () => {
                natureModalizeRef.current?.open();
        };
        const setSelectedNtures = (nat) => {
                natureModalizeRef.current?.close();
                setNatures(nat)
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

        const VolumeAgentSuperviseurList = () => {
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

        const NatureDossierList = () => {
                return (
                        <>
                                <View style={styles.modalContainer}>
                                        <View style={styles.modalHeader}>
                                                <Text style={styles.modalTitle}>Nature du dossier</Text>

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
                                <Text style={styles.titlePrincipal}>Detailler le volume</Text>
                        </View>
                        <ScrollView>
                                <View>
                                        <TouchableOpacity style={styles.selectContainer} onPress={openVolumeModalize}>
                                                <View>
                                                        <Text style={styles.selectLabel}>
                                                                Volume
                                                        </Text>
                                                        <View>
                                                                <Text style={styles.selectedValue}>
                                                                        hdhdh
                                                                </Text>
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
                                                        value={data.dossier}
                                                        onChangeText={(newValue) => handleChange('dossier', newValue)}
                                                        onBlur={() => checkFieldData('dossier')}
                                                        error={hasError('dossier') ? getError('dossier') : ''}
                                                        autoCompleteType='off'
                                                        blurOnSubmit={false}
                                                />
                                        </View>
                                        <View style={{ marginBottom: 8 }}>
                                                <Text style={styles.label}>Folio</Text>
                                        </View>
                                        <View style={{ marginVertical: 8 }}>
                                                <OutlinedTextField
                                                        label="Nombre de folio"
                                                        fontSize={14}
                                                        baseColor={COLORS.smallBrown}
                                                        tintColor={COLORS.primary}
                                                        containerStyle={{ borderRadius: 20 }}
                                                        lineWidth={1}
                                                        activeLineWidth={1}
                                                        errorColor={COLORS.error}
                                                        value={data.folio}
                                                        onChangeText={(newValue) => handleChange('folio', newValue)}
                                                        onBlur={() => checkFieldData('folio')}
                                                        error={hasError('folio') ? getError('folio') : ''}
                                                        autoCompleteType='off'
                                                        blurOnSubmit={false}
                                                />
                                        </View>
                                        <View style={{ marginBottom: 8 }}>
                                                <Text style={styles.label}>Nature du dossier</Text>
                                        </View>
                                        <TouchableOpacity style={styles.selectContainer} onPress={openNaturesModalize}>
                                                <View>
                                                        <Text style={styles.selectLabel}>
                                                                Selectioner la nature
                                                        </Text>
                                                        <View>
                                                                <Text style={styles.selectedValue}>
                                                                        hdhdh
                                                                </Text>
                                                        </View>
                                                </View>
                                        </TouchableOpacity>
                                        <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                                <View></View>
                                                <TouchableOpacity>
                                                        <View style={styles.buttonPlus}>
                                                                <Text style={styles.buttonTextPlus}>+</Text>
                                                        </View>
                                                </TouchableOpacity>
                                        </View>
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
                        <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                <View></View>
                                <TouchableWithoutFeedback>
                                        <View style={styles.button}>
                                                <Text style={styles.buttonText}>Enregistrer</Text>
                                        </View>
                                </TouchableWithoutFeedback>
                        </View>
                        <Portal>
                                <Modalize ref={volumeModalizeRef}  >
                                        <VolumeAgentSuperviseurList />
                                </Modalize>
                        </Portal>
                        <Portal>
                                <Modalize ref={natureModalizeRef}  >
                                        <NatureDossierList />
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
        selectedValue: {
                color: '#777'
        },
        label: {
                fontSize: 16,
                fontWeight: 'bold'
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
                marginVertical: 10,
                borderRadius: 8,
                paddingVertical: 14,
                paddingHorizontal: 10,
                backgroundColor: COLORS.primary
        },
        buttonText: {
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center"
        },
        buttonPlus:{
                width:50,
                height:50,
                borderRadius: 50,
                backgroundColor: COLORS.primary,
                justifyContent:"center",
                alignContent:"center",
                alignItems:"center"
        },
        buttonTextPlus:{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 25
        }
})