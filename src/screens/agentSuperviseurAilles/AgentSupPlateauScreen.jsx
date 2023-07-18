import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback } from "react-native";
import { Ionicons, AntDesign, Fontisto } from '@expo/vector-icons';
import { COLORS } from '../../styles/COLORS';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import * as DocumentPicker from 'expo-document-picker';
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import useFetch from "../../hooks/useFetch";
import Loading from "../../components/app/Loading";
import { useEffect } from "react";
import fetchApi from "../../helpers/fetchApi";

/**
 * Le screen pour aider un superviseur aille affecter un chef du plateaux
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 17/7/2021
 * @returns 
 */

export default function AgentSupPlateauScreen() {
        const navigation = useNavigation()
        const [loading, setLoading] = useState(false)

        const [loadingInformation, setLoadingInformation] = useState(false)
        const [informations, setInformations] = useState(null);

        const [data, handleChange, setValue] = useForm({
                document: null,
        })

        const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
                document: {
                        required: true
                }
        }, {
                document: {
                        required: 'ce champ est obligatoire',
                }
        })

        const isValidAdd = () => {
                var isValid = false
                isValid = volumes != null ? true : false
                isValid = chefPlateaux != null ? true : false
                return isValid && isValidate()
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

        // Chef du plateau select
        const chefplateauModalizeRef = useRef(null);
        const [chefPlateaux, setChefPlateaux] = useState(null);
        const openChefPlateauModalize = () => {
                chefplateauModalizeRef.current?.open();
        };
        const setSelectedChefPlateau = (chef) => {
                chefplateauModalizeRef.current?.close();
                setChefPlateaux(chef)
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

        //Composent pour afficher le modal des chefs des plateaux
        const ChefPlateauList = () => {
                const [loadingSuperviseur, superviseurList] = useFetch('/folio/dossiers/chefPlateau')
                return (
                        <>
                                {loadingSuperviseur ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Listes des chefs de plateaux</Text>
                                                </View>
                                                {superviseurList.result.map((chef, index) => {
                                                        return (
                                                                <ScrollView key={index}>
                                                                        <TouchableNativeFeedback onPress={() => setSelectedChefPlateau(chef)}>
                                                                                <View style={styles.modalItem} >
                                                                                        <View style={styles.modalImageContainer}>
                                                                                                <AntDesign name="addusergroup" size={24} color="black" />
                                                                                        </View>
                                                                                        <View style={styles.modalItemCard}>
                                                                                                <View>
                                                                                                        <Text style={styles.itemTitle}>{chef.NOM} {chef.PRENOM}</Text>
                                                                                                        <Text style={styles.itemTitleDesc}>{chef.EMAIL}</Text>
                                                                                                </View>
                                                                                                {chefPlateaux?.ID_USER_AILE == chef.ID_USER_AILE ? <Fontisto name="checkbox-active" size={21} color="#007bff" /> :
                                                                                                        <Fontisto name="checkbox-passive" size={21} color="black" />}
                                                                                        </View>
                                                                                </View>
                                                                        </TouchableNativeFeedback>
                                                                </ScrollView>
                                                        )
                                                })}
                                        </View>
                                }
                        </>
                )
        }

        //Composent pour afficher le modal de volume 
        const VolumeAgentSuperviseurList = () => {
                const [loadingVolume, volumesAll] = useFetch('/volume/dossiers/myVolume')
                return (
                        <>
                                {loadingVolume ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Les volumes</Text>
                                                </View>
                                                {volumesAll.result.map((vol, index) => {
                                                        return (
                                                                <ScrollView key={index}>
                                                                        <TouchableNativeFeedback onPress={() => setSelectedVolume(vol)}>
                                                                                <View style={styles.modalItem} >
                                                                                        <View style={styles.modalImageContainer}>
                                                                                                <AntDesign name="folderopen" size={20} color="black" />
                                                                                        </View>
                                                                                        <View style={styles.modalItemCard}>
                                                                                                <View>
                                                                                                        <Text style={styles.itemTitle}>{vol.NUMERO_VOLUME}</Text>
                                                                                                        <Text style={styles.itemTitleDesc}>{vol.CODE_VOLUME}</Text>
                                                                                                </View>
                                                                                                {volumes?.ID_VOLUME == vol.ID_VOLUME ? <Fontisto name="checkbox-active" size={21} color="#007bff" /> :
                                                                                                        <Fontisto name="checkbox-passive" size={21} color="black" />}
                                                                                        </View>
                                                                                </View>
                                                                        </TouchableNativeFeedback>
                                                                </ScrollView>
                                                        )
                                                })}
                                        </View>
                                }
                        </>
                )
        }

        //Fonction pour appeller les autres information en passant l'id de volume selectionner
        useEffect(() => {
                (async () => {
                        try {

                                if (volumes) {
                                        setLoadingInformation(true)
                                        const aie = await fetchApi(`/volume/dossiers/batimentAile/${volumes.ID_VOLUME}`)
                                        setInformations(aie.result)
                                }
                        }
                        catch (error) {
                                console.log(error)
                        } finally {
                                setLoadingInformation(false)
                        }
                })()
        }, [volumes])

        const submitInAille = async () => {
                try {
                        setLoading(true)
                        const form = new FormData()
                        form.append('CHEF_PLATEAU', chefPlateaux.ID_USER_AILE)
                        if (data.document) {
                                let localUri = data.document.uri;
                                let filename = localUri.split('/').pop();
                                form.append("PV", {
                                        uri: data.document.uri, name: filename, type: data.document.mimeType
                                })
                        }
                        const volume = await fetchApi(`/volume/dossiers/affectationPlateau/${volumes.ID_VOLUME}`, {
                                method: "PUT",
                                body: form
                        })
                        navigation.goBack()
                }
                catch (error) {
                        console.log(error)
                } finally {
                        setLoading(false)
                }
        }


        return (
                <>
                        {loading && <Loading />}
                        <View style={styles.container}>
                                <View style={styles.cardHeader}>
                                        <TouchableNativeFeedback
                                                onPress={() => navigation.goBack()}
                                                background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                                                <View style={styles.backBtn}>
                                                        <Ionicons name="arrow-back-sharp" size={24} color="#fff" />
                                                </View>
                                        </TouchableNativeFeedback>
                                        <Text style={styles.titlePrincipal}>Affecter un chef plateaux</Text>
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
                                                                                {volumes ? `${volumes.NUMERO_VOLUME}` : 'Aucun'}
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </TouchableOpacity>
                                                {volumes ? <View style={styles.selectContainer}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Malle
                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {informations ? `${informations?.NUMERO_MAILLE}` : 'N/B'}
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </View> : null}
                                                {volumes ? <View style={styles.selectContainer}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Dossier
                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {informations ? `${informations?.NOMBRE_DOSSIER}` : 'N/B'}
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </View> : null}
                                                {volumes ? <View style={styles.selectContainer}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Batiments
                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {informations ? `${informations?.NUMERO_BATIMENT}` : 'N/B'}
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </View> : null}
                                                {volumes ? <View style={styles.selectContainer}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Ailles
                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {informations ? `${informations?.NUMERO_AILE}` : 'N/B'}
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </View> : null}
                                                <TouchableOpacity style={styles.selectContainer} onPress={openChefPlateauModalize}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Selectioner un chef de plateau
                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {chefPlateaux ? `${chefPlateaux.NOM}` + `${chefPlateaux.PRENOM}` : 'Aucun'}
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
                                        onPress={submitInAille}
                                >
                                        <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                                                <Text style={styles.buttonText}>Enregistrer</Text>
                                        </View>
                                </TouchableWithoutFeedback>
                                <Portal>
                                        <Modalize ref={chefplateauModalizeRef}  >
                                                <ChefPlateauList />
                                        </Modalize>
                                </Portal>
                                <Portal>
                                        <Modalize ref={volumeModalizeRef}  >
                                                <VolumeAgentSuperviseurList />
                                        </Modalize>
                                </Portal>
                        </View>
                </>
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
        itemTitleDesc: {
                color: "#777",
                marginLeft: 10,
                fontSize: 11
        },
        modalItemCard: {
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 1
        },
})