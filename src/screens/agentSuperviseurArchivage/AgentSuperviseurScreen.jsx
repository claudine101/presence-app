import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Alert } from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { COLORS } from '../../styles/COLORS';
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import * as DocumentPicker from 'expo-document-picker';
import { useDispatch, useSelector } from "react-redux";
import { folioNatureCartSelector } from "../../store/selectors/folioNatureCartSelector";
import { addFolioAction, removeFolioAction } from "../../store/actions/folioNatureCartActions";

/**
 * Le screen pour details le volume, le dossier utilisable par un agent superviseur
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 12/7/2021
 * @returns 
 */


export default function AgentSuperviseurScreen() {
        const navigation = useNavigation()
        const dispatch = useDispatch()
        const folioNatures = useSelector(folioNatureCartSelector)

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

        //Fonction pour ajouter le folio da le redux
        const onAddToCart = () => {
                dispatch(addFolioAction({ ID_FOLIO: parseInt(data.dossier), NATURE: data.folio, TOTAL: data.dossier + data.folio }))
                // handleChange("nbre_volume", data.nbre_volume - 1)
                // handleChange("numero", "")
        }

        //Fonction pour enlever le folio da le redux
        const onRemoveProduct = (index) => {
                Alert.alert("Enlever le folio", "Voulez-vous vraiment enlever ce folio dans les details ?",
                        [
                                {
                                        text: "Annuler",
                                        style: "cancel"
                                },
                                {
                                        text: "Oui", onPress: async () => {
                                                dispatch(removeFolioAction(index))
                                        }
                                }
                        ])
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

        //Composent pour afficher le modal de volume associer a un agent superviceur
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

        //Composent pour afficher le modal de nature de folio
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

        const submitFolio = async () => {
                try {
                        const form = new FormData()
                        form.append('USER', data.dossier)
                        form.append('USER', data.folio)

                        // form.append('VOLUME', JSON.stringify(activity))
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
                                                <TouchableOpacity
                                                        onPress={onAddToCart}
                                                >
                                                        <View style={styles.buttonPlus}>
                                                                <Text style={styles.buttonTextPlus}>+</Text>
                                                        </View>
                                                </TouchableOpacity>
                                        </View>
                                        {folioNatures.map((product, index) => {
                                                return (
                                                        <View style={styles.headerRead}>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                                                                        <View style={styles.cardFolder}>
                                                                                <Text style={[styles.title]} numberOfLines={1}>{product.TOTAL}</Text>
                                                                                <View style={styles.cardDescription}>
                                                                                        <AntDesign name="folderopen" size={20} color="black" />
                                                                                </View>

                                                                        </View>
                                                                        <View>
                                                                                <Text style={[styles.title, { marginTop: 5 }]} numberOfLines={1}>{product.NATURE}</Text>
                                                                        </View>
                                                                        <View>
                                                                                <Text style={[styles.title, { marginTop: 5 }]} numberOfLines={1}>{product.ID_FOLIO}</Text>
                                                                        </View>
                                                                        <View>
                                                                                <TouchableOpacity style={styles.reomoveBtn} onPress={() => onRemoveProduct(index)}>
                                                                                        <MaterialCommunityIcons name="delete" size={24} color="#777" />
                                                                                </TouchableOpacity>
                                                                        </View>
                                                                </View>
                                                        </View>
                                                )
                                        })}
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
                                <TouchableWithoutFeedback
                                        onPress={submitFolio}
                                >
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
        buttonPlus: {
                width: 50,
                height: 50,
                borderRadius: 50,
                backgroundColor: COLORS.primary,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
        },
        buttonTextPlus: {
                color: "#fff",
                fontWeight: "bold",
                fontSize: 25
        },
        headerRead: {
                borderRadius: 8,
                backgroundColor: "#ddd",
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 5,
                paddingHorizontal: 30
        },
        cardFolder: {
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                backgroundColor: '#FFF',
                maxHeight: 50,
                borderRadius: 20,
                padding: 3,
                paddingVertical: 2,
                elevation: 10,
                shadowColor: '#c4c4c4',
        },
        cardDescription: {
                marginLeft: 10,
                width: 30,
                height: 30,
                borderRadius: 30,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                backgroundColor: "#ddd"
        },
        reomoveBtn: {
                width: 30,
                height: 30,
                backgroundColor: '#F1F1F1',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center'
        },
})