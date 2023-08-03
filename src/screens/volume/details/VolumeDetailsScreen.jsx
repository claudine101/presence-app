import React, { useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TouchableWithoutFeedback, TouchableNativeFeedback } from "react-native";
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import * as DocumentPicker from 'expo-document-picker';
import { EvilIcons, Ionicons } from '@expo/vector-icons';
import { useFormErrorsHandle } from '../../../hooks/useFormErrorsHandle';
import { useForm } from '../../../hooks/useForm';
import { COLORS } from '../../../styles/COLORS';
import { useNavigation, useRoute } from "@react-navigation/native";
import moment from 'moment'

/**
 * Screen pour afficher le details de volume de chef de division
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 15/7/2023
 * @returns 
 */

export default function VolumeDetailsScreen() {
        const modelRef = useRef(null)
        const navigation = useNavigation()
        const route = useRoute()
        const {volume} = route.params
        const [data, handleChange, setValue] = useForm({
                document: null
        })

        const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {

                document: {
                        required: true
                }
        })
        const onOpenModal = async () => {
                modelRef.current.open()
        }

        const submitDocument = () => {
                modelRef.current.close()
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
        return (
                <>
                        <ScrollView style={styles.container}>
                                <View style={styles.cardHeader}>
                                        <TouchableNativeFeedback
                                                onPress={() => navigation.goBack()}
                                                background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                                                <View style={styles.backBtn}>
                                                        <Ionicons name="arrow-back-sharp" size={24} color="#fff" />
                                                </View>
                                        </TouchableNativeFeedback>
                                </View>
                                <View style={styles.cardDetails}>
                                        <View style={styles.carddetailItem}>
                                                <View style={styles.cardDescription}>
                                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                <View>
                                                                        <Text style={styles.itemVolume}>Volume</Text>
                                                                        <Text style={styles.itemVolume}>{volume.NUMERO_VOLUME}</Text>
                                                                        <Text>{volume.CODE_VOLUME}</Text>
                                                                </View>
                                                                <View>
                                                                        <Text>{moment(volume.DATE_INSERTION).format('DD-MM-YYYY')}</Text>
                                                                        {/* <Text>sjsjsj</Text> */}
                                                                </View>
                                                        </View>
                                                </View>
                                        </View>
                                        <View style={styles.separator}></View>
                                        <View style={styles.carddetailItem}>
                                                <View style={styles.cardDescription}>
                                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                <View>
                                                                        <Text style={styles.itemVolume}>Nombre de dossier</Text>
                                                                        {volume.NOMBRE_DOSSIER ? <Text>{volume.NOMBRE_DOSSIER}</Text>:<Text>N/B</Text>}
                                                                        {/* <Text>Vanny</Text> */}
                                                                </View>
                                                                {/* <View>
                                                                        <Text>Etape</Text>
                                                                </View> */}
                                                        </View>
                                                </View>
                                        </View>
                                        <View style={styles.separator}></View>
                                        {/* <View style={styles.footer}>
                                                <View>
                                                        <Text>Pas encore etape retour</Text>
                                                </View>
                                                <TouchableOpacity onPress={onOpenModal}>
                                                        <View style={styles.nextBtn}>
                                                                <Text style={styles.nextBtnText}>
                                                                        Valider
                                                                </Text>
                                                        </View>
                                                </TouchableOpacity>
                                        </View> */}
                                </View>
                        </ScrollView>
                        <Portal>
                                <Modalize ref={modelRef}
                                        handlePosition="inside"
                                        adjustToContentHeight
                                        modalStyle={{ backgroundColor: '#fff', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}
                                        scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
                                >
                                        <View style={{ paddingHorizontal: 10, }}>
                                                <View style={styles.modalContainer}>
                                                        <View style={styles.modalHeader}>
                                                                <Text style={styles.modalTitle}>Les volumes</Text>
                                                        </View>
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
                                                        <View style={styles.separator} />
                                                        <TouchableWithoutFeedback
                                                                onPress={submitDocument}
                                                        >
                                                                <View style={styles.button}>
                                                                        <Text style={styles.buttonText}>Enregistrer</Text>
                                                                </View>
                                                        </TouchableWithoutFeedback>
                                                </View>


                                        </View>
                                </Modalize>
                        </Portal>
                </>
        )
}

const styles = StyleSheet.create({
        container: {
                flex: 1,
                backgroundColor: '#ddd'
        },
        cardDetails: {
                backgroundColor: '#fff',
                borderRadius: 10,
                elevation: 5,
                shadowColor: '#c4c4c4',
                marginTop: 10,
                backgroundColor: '#fff',
                padding: 15,
                overflow: 'hidden',
                marginHorizontal: 10
        },
        carddetailItem: {
                flexDirection: 'row',
                alignItems: 'center',
        },
        cardDescription: {
                flex: 1
        },
        itemVolume: {
                fontSize: 15,
                fontWeight: "bold",
        },
        separator: {
                height: 1,
                width: "100%",
                backgroundColor: '#F1F1F1',
                marginVertical: 10
        },
        footer: {
                backgroundColor: '#FFF',
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
        },
        nextBtn: {
                backgroundColor: '#DCE4F7',
                borderRadius: 10,
                paddingVertical: 10,
                paddingHorizontal: 20,
                alignSelf: "flex-end"
        },
        backBtn: {
                backgroundColor: '#fff',
                borderColor: '#ddd',
                borderWidth: 1
        },
        nextBtnText: {
                color: '#000',
                fontWeight: "bold",
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
                paddingVertical: 5
        },
        modalTitle: {
                fontWeight: "bold",
                textAlign: "center",
                marginTop: 10,
                fontSize: 16
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
        cardHeader: {
                flexDirection: 'row',
                // marginTop: StatusBar.currentHeight,
                alignContent: "center",
                alignItems: "center",
                marginHorizontal: 10,
                marginTop: 10

        },
        backBtn: {
                backgroundColor: COLORS.ecommercePrimaryColor,
                justifyContent: 'center',
                alignItems: 'center',
                width: 50,
                height: 50,
                borderRadius: 50,
        },
})