import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, ActivityIndicator, FlatList, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { COLORS } from "../../../styles/COLORS";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback } from "react";
import fetchApi from "../../../helpers/fetchApi";
import moment from 'moment'
import { Ionicons, AntDesign, Fontisto } from '@expo/vector-icons';
import { useForm } from "../../../hooks/useForm";
import { useFormErrorsHandle } from "../../../hooks/useFormErrorsHandle";
import * as DocumentPicker from 'expo-document-picker';
import Loading from "../../../components/app/Loading";


/**
 * Screen pour afficher le details de folio avec leur nature  
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 17/7/2023
 * @returns 
 */

export default function AgentSupPhasePreparationRetourDetailsScreen() {
        const navigation = useNavigation()
        const route = useRoute()
        const { ID_FOLIO_AILE_AGENT_PREPARATION, NOM, PRENOM, ID_USER_AILE_AGENT_PREPARATION, ID_ETAPE_FOLIO } = route.params
        console.log(ID_ETAPE_FOLIO)
        const [allDetails, setAllDetails] = useState([])
        const [loading, setLoading] = useState(false)
        const [loadingSubmit, setLoadingSubmit] = useState(false)

        const [data, handleChange, setValue] = useForm({
                document: null,
        })

        const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
                document: {
                        required: true
                },
        }, {
                document: {
                        required: 'ce champ est obligatoire',
                },
        })

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

        const submitData = async () => {
                try {
                        setLoadingSubmit(true)
                        const form = new FormData()
                        if (data.document) {
                                let localUri = data.document.uri;
                                let filename = localUri.split('/').pop();
                                form.append("PV", {
                                        uri: data.document.uri, name: filename, type: data.document.mimeType
                                })
                        }
                        const res = await fetchApi(`/folio/dossiers/retourPreparation/${ID_USER_AILE_AGENT_PREPARATION}`, {
                                method: "PUT",
                                body: form
                        })
                        navigation.goBack()
                }
                catch (error) {
                        console.log(error)
                } finally {
                        setLoadingSubmit(false)
                }
        }

        //Fonction pour recuperer les details de folios 
        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoading(true)
                                const res = await fetchApi(`/folio/dossiers/folioPreparations/${ID_FOLIO_AILE_AGENT_PREPARATION}`)
                                setAllDetails(res.result)
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoading(false)
                        }
                })()
        }, [ID_FOLIO_AILE_AGENT_PREPARATION]))

        return (
                <>
                        {loadingSubmit && <Loading />}
                        <View style={styles.container}>
                                <View style={styles.cardHeader}>
                                        <TouchableNativeFeedback
                                                onPress={() => navigation.goBack()}
                                                background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                                                <View style={styles.backBtn}>
                                                        <Ionicons name="arrow-back-sharp" size={24} color="#fff" />
                                                </View>
                                        </TouchableNativeFeedback>
                                        <Text style={styles.titlePrincipal}>{NOM} {PRENOM}</Text>
                                </View>
                                <FlatList
                                        style={styles.contain}
                                        data={allDetails}
                                        renderItem={({ item: folio, index }) => {
                                                return (
                                                        <>
                                                                {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                                                </View> :
                                                                        <View>
                                                                                <View style={styles.cardDetails}>
                                                                                        <View style={styles.carddetailItem}>
                                                                                                <View style={styles.cardImages}>
                                                                                                        <AntDesign name="folderopen" size={24} color="black" />
                                                                                                </View>
                                                                                                <View style={styles.cardDescription}>
                                                                                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                                                                <View style={styles.cardNames}>
                                                                                                                        <Text style={styles.itemVolume} numberOfLines={1}>{folio.NUMERO_FOLIO}</Text>
                                                                                                                        <Text>{folio.CODE_FOLIO}</Text>
                                                                                                                </View>
                                                                                                                <Text style={{ color: "#777" }}>{moment(folio.DATE_INSERTION).format('DD-MM-YYYY')}</Text>
                                                                                                        </View>
                                                                                                </View>
                                                                                        </View>
                                                                                </View>
                                                                        </View>
                                                                }
                                                        </>
                                                )
                                        }}
                                        keyExtractor={(folio, index) => index.toString()}
                                />
                                {ID_ETAPE_FOLIO == 2 ? <>
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
                                        <TouchableWithoutFeedback
                                                disabled={!isValidate()}
                                                onPress={submitData}
                                        >
                                                <View style={[styles.button, !isValidate() && { opacity: 0.5 }]}>
                                                        <Text style={styles.buttonText}>Enregistrer</Text>
                                                </View>
                                        </TouchableWithoutFeedback>
                                </>:null}

                        </View>
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
        cardImages: {
                backgroundColor: '#DCE4F7',
                width: 50,
                height: 50,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center'
        },
        cardDescription: {
                marginLeft: 10,
                flex: 1
        },
        itemVolume: {
                fontSize: 15,
                fontWeight: "bold",
        },
        cardHeader: {
                flexDirection: 'row',
                // marginTop: StatusBar.currentHeight,
                alignContent: "center",
                alignItems: "center",
                marginBottom: 15,
                marginHorizontal: 10,
                marginVertical: 10
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
        button: {
                marginTop: 10,
                borderRadius: 8,
                paddingVertical: 14,
                paddingHorizontal: 10,
                backgroundColor: "#18678E",
                marginHorizontal: 10
        },
        buttonText: {
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center"
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
                marginVertical: 10,
                marginHorizontal: 10
        },
        selectedValue: {
                color: '#777'
        },
})