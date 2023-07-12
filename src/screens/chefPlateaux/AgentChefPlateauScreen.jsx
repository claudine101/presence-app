import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Alert } from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../styles/COLORS';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import * as DocumentPicker from 'expo-document-picker';
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { useDispatch, useSelector } from "react-redux";
import { folioDetailsCartSelector } from "../../store/selectors/folioDetailsCartSelector";
import { addFolioDetailAction, removeFolioDetailAction } from "../../store/actions/folioDetailsCartActions";

/**
 * Le screen pour aider le superviseur de la phase preparation
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 12/7/2021
 * @returns 
 */

export default function AgentChefPlateauScreen() {
        const navigation = useNavigation()
        const dispatch = useDispatch()
        const folioDetails = useSelector(folioDetailsCartSelector)

        const [data, handleChange, setValue] = useForm({
                folio: '',
                dossier: ''
        })

        const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
                folio: {
                        required: true
                },
                dossier: {
                        required: true
                }
        }, {
                folio: {
                        required: 'ce champ est obligatoire',
                },
                dossier: {
                        required: 'ce champ est obligatoire',
                }
        })

        // Agent superviseur preparation select
        const preparationModalizeRef = useRef(null);
        const [supPreparations, setSupPreparations] = useState(null);
        const openSupPreparationModalize = () => {
                preparationModalizeRef.current?.open();
        };
        const setSelectedSupPreparation = (prep) => {
                preparationModalizeRef.current?.close();
                setSupPreparations(prep)
        }


        //Fonction pour ajouter le folio details dans redux
        const onAddToCart = () => {
                dispatch(addFolioDetailAction({ NOMBRE: data.folio }))
                // handleChange("nbre_volume", data.nbre_volume - 1)
                // handleChange("numero", "")
        }

        //Fonction pour enlever le folio da le redux
        const onRemoveProduct = (index) => {
                Alert.alert("Enlever le details du folio", "Voulez-vous vraiment enlever ce detail du folio ?",
                        [
                                {
                                        text: "Annuler",
                                        style: "cancel"
                                },
                                {
                                        text: "Oui", onPress: async () => {
                                                dispatch(removeFolioDetailAction(index))
                                        }
                                }
                        ])
        }


        //Composent pour afficher le modal des agents de phase preparation
        const SupervisionPreparationList = () => {
                return (
                        <>
                                <View style={styles.modalContainer}>
                                        <View style={styles.modalHeader}>
                                                <Text style={styles.modalTitle}>Les agents de preparations</Text>

                                        </View>
                                        <ScrollView>
                                                <TouchableNativeFeedback >
                                                        <View style={styles.modalItem} >
                                                                <View style={styles.modalImageContainer}>
                                                                        <AntDesign name="addusergroup" size={24} color="black" />
                                                                </View>
                                                                <Text style={styles.itemTitle}>dgdg</Text>
                                                        </View>
                                                </TouchableNativeFeedback>
                                        </ScrollView>
                                </View>
                        </>
                )
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

        const submitDataPreparation = async () => {
                try {
                        const form = new FormData()
                        form.append('USER', data.malle)
                        form.append('USER', data.aille)

                        form.append('VOLUME', JSON.stringify(folioDetails))
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
                                <Text style={styles.titlePrincipal}>Detailler dans l'aille</Text>
                        </View>
                        <ScrollView>
                                <View>
                                        <View style={styles.selectContainer}>
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
                                        </View>
                                        <View style={styles.selectContainer}>
                                                <View>
                                                        <Text style={styles.selectLabel}>
                                                                Malle
                                                        </Text>
                                                        <View>
                                                                <Text style={styles.selectedValue}>
                                                                        hdhdhdkdj
                                                                </Text>
                                                        </View>
                                                </View>
                                        </View>
                                        <View style={styles.selectContainer}>
                                                <View>
                                                        <Text style={styles.selectLabel}>
                                                                Nombre de dossier
                                                        </Text>
                                                        <View>
                                                                <Text style={styles.selectedValue}>
                                                                        hkdj
                                                                </Text>
                                                        </View>
                                                </View>
                                        </View>
                                        <TouchableOpacity style={styles.selectContainer} onPress={openSupPreparationModalize}>
                                                <View>
                                                        <Text style={styles.selectLabel}>
                                                                Selectioner un agent de preparation
                                                        </Text>
                                                        <View>
                                                                <Text style={styles.selectedValue}>
                                                                        hdhdggk
                                                                </Text>
                                                        </View>
                                                </View>
                                        </TouchableOpacity>
                                        <View style={{ marginBottom: 8 }}>
                                                <Text style={styles.label}>Nombre de dossier</Text>
                                        </View>
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
                                                        label="detail de folio"
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
                                        {folioDetails.map((product, index) => {
                                                return (
                                                        <View style={styles.headerRead}>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                                                                        <View style={styles.cardFolder}>
                                                                                <Text style={[styles.title]} numberOfLines={1}>{product.NOMBRE}</Text>
                                                                                <View style={styles.cardDescription}>
                                                                                        <AntDesign name="folderopen" size={20} color="black" />
                                                                                </View>
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
                        <TouchableWithoutFeedback
                                onPress={submitDataPreparation}
                        >
                                <View style={styles.button}>
                                        <Text style={styles.buttonText}>Enregistrer</Text>
                                </View>
                        </TouchableWithoutFeedback>
                        <Portal>
                                <Modalize ref={preparationModalizeRef}  >
                                        <SupervisionPreparationList />
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
        label: {
                fontSize: 16,
                fontWeight: 'bold'
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