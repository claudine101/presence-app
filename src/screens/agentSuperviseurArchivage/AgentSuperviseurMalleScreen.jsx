import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons, FontAwesome5, Fontisto } from '@expo/vector-icons';
import { COLORS } from '../../styles/COLORS';
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import * as DocumentPicker from 'expo-document-picker';
import useFetch from "../../hooks/useFetch";
import fetchApi from "../../helpers/fetchApi";

/**
 * Le screen pour  mettre le volume detailler dans un malle
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 12/7/2021
 * @returns 
 */

export default function AgentSuperviseurMalleScreen() {
        const navigation = useNavigation()

        const [data, handleChange, setValue] = useForm({
                malle: '',
                aille: ''
        })

        const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
                dossier: {
                        required: true
                },
                aille: {
                        required: true
                }
        }, {
                dossier: {
                        required: 'ce champ est obligatoire',
                },
                aille: {
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

        // Malle select
        const maleModalizeRef = useRef(null);
        const [malles, setMalles] = useState(null);
        const openMallesModalize = () => {
                maleModalizeRef.current?.open();
        };
        const setSelectedMalle = (mal) => {
                maleModalizeRef.current?.close();
                setMalles(mal)
        }

        // Batiment select
        const batimentModalizeRef = useRef(null);
        const [batiments, setBatiments] = useState(null);
        const openBatimentModalize = () => {
                batimentModalizeRef.current?.open();
        };
        const setSelectedBatiment = (bat) => {
                batimentModalizeRef.current?.close();
                setBatiments(bat)
        }

        // Ailles select
        const aillesModalizeRef = useRef(null);
        const [ailles, setAilles] = useState(null);
        const openAilleModalize = () => {
                aillesModalizeRef.current?.open();
        };
        const setSelectedAille = (ail) => {
                aillesModalizeRef.current?.close();
                setAilles(ail)
        }

        // Distributeur select
        const distributrutModalizeRef = useRef(null);
        const [distributeur, setDistributeur] = useState(null);
        const openDistributeurModalize = () => {
                distributrutModalizeRef.current?.open();
        };
        const setSelectedDistibuteur = (distr) => {
                distributrutModalizeRef.current?.close();
                setDistributeur(distr)
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

        //Composent pour afficher le maille existant
        const MalleList = () => {
                const [loadingMalle, mallesAll] = useFetch('/folio/dossiers/maille')
                return (
                        <>
                                {loadingMalle ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Listes des malles</Text>
                                                </View>
                                                {mallesAll.result.map((mal, index) => {
                                                        return (
                                                                <ScrollView key={index}>
                                                                        <TouchableNativeFeedback onPress={() => setSelectedMalle(mal)}>
                                                                                <View style={styles.modalItem} >
                                                                                        <View style={styles.modalImageContainer}>
                                                                                                <AntDesign name="folderopen" size={20} color="black" />
                                                                                        </View>
                                                                                        <View style={styles.modalItemCard}>
                                                                                                <View>
                                                                                                        <Text style={styles.itemTitle}>{mal.NUMERO_MAILLE}</Text>
                                                                                                        {/* <Text style={styles.itemTitleDesc}>{vol.CODE_VOLUME}</Text> */}
                                                                                                </View>
                                                                                                {malles?.ID_MAILLE == mal.ID_MAILLE ? <Fontisto name="checkbox-active" size={21} color="#007bff" /> :
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

        //Composent pour afficher le modal de volume associer a un agent superviceur
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

        //Composent pour afficher le modal des batiments 
        const BatimentList = () => {
                const [loadingBatiment, batimentsAll] = useFetch('/folio/dossiers/batiment')
                return (
                        <>
                                <>
                                        {loadingBatiment ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View> :
                                                <View style={styles.modalContainer}>
                                                        <View style={styles.modalHeader}>
                                                                <Text style={styles.modalTitle}>Listes des batiments</Text>
                                                        </View>
                                                        {batimentsAll.result.map((bat, index) => {
                                                                return (
                                                                        <ScrollView key={index}>
                                                                                <TouchableNativeFeedback onPress={() => setSelectedBatiment(bat)}>
                                                                                        <View style={styles.modalItem} >
                                                                                                <View style={styles.modalImageContainer}>
                                                                                                        <FontAwesome5 name="house-damage" size={20} color="black" />
                                                                                                </View>
                                                                                                <View style={styles.modalItemCard}>
                                                                                                        <View>
                                                                                                                <Text style={styles.itemTitle}>{bat.NUMERO_BATIMENT}</Text>
                                                                                                        </View>
                                                                                                        {batiments?.ID_BATIMENT == bat.ID_BATIMENT ? <Fontisto name="checkbox-active" size={21} color="#007bff" /> :
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
                        </>
                )
        }

        //Composent pour afficher le modal de liste des ailles
        const AillesList = ({ batiments }) => {
                const [allailles, setAllailles] = useState([]);
                const [aillesLoading, setAillesLoading] = useState(false);
                useEffect(() => {
                        (async () => {
                                try {

                                        if (batiments) {
                                                setAillesLoading(true)
                                                const aie = await fetchApi(`/folio/dossiers/aile/${batiments.ID_BATIMENT}`)
                                                setAllailles(aie.result)
                                        }
                                }
                                catch (error) {
                                        console.log(error)
                                } finally {
                                        setAillesLoading(false)
                                }
                        })()
                }, [batiments])
                return (
                        <>
                                {aillesLoading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Listes des ailles</Text>
                                                </View>
                                                {allailles.map((ail, index) => {
                                                        return (
                                                                <ScrollView key={index}>
                                                                        <TouchableNativeFeedback onPress={() => setSelectedAille(ail)}>
                                                                                <View style={styles.modalItem} >
                                                                                        <View style={styles.modalImageContainer}>
                                                                                                <FontAwesome5 name="house-damage" size={20} color="black" />
                                                                                        </View>
                                                                                        <View style={styles.modalItemCard}>
                                                                                                <View>
                                                                                                        <Text style={styles.itemTitle}>{ail.NUMERO_AILE}</Text>
                                                                                                </View>
                                                                                                {ailles?.ID_AILE == ail.ID_AILE ? <Fontisto name="checkbox-active" size={21} color="#007bff" /> :
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

        //Composent pour afficher le modal de liste des distrubuteur 
        const DistributeurAgentList = ({ ailles }) => {
                const [allDistributeur, setAllDistributeur] = useState([]);
                const [distributeurLoading, setDistributeurLoading] = useState(false);

                useEffect(() => {
                        (async () => {
                                try {

                                        if (ailles) {
                                                setDistributeurLoading(true)
                                                const distr = await fetchApi(`/folio/dossiers/agent/${ailles.ID_AILE}`)
                                                setAllDistributeur(distr.result)
                                        }
                                }
                                catch (error) {
                                        console.log(error)
                                } finally {
                                        setDistributeurLoading(false)
                                }
                        })()
                }, [ailles])
                return (
                        <>
                                {distributeurLoading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Listes des distributeurs</Text>
                                                </View>
                                                {allDistributeur.map((distr, index) => {
                                                        return (
                                                                <ScrollView key={index}>
                                                                        <TouchableNativeFeedback onPress={() => setSelectedDistibuteur(distr)}>
                                                                                <View style={styles.modalItem} >
                                                                                        <View style={styles.modalImageContainer}>
                                                                                                <AntDesign name="addusergroup" size={24} color="black" />
                                                                                        </View>
                                                                                        <View style={styles.modalItemCard}>
                                                                                                <View>
                                                                                                        <Text style={styles.itemTitle}>{distr.NOM} {distr.PRENOM} </Text>
                                                                                                        <Text style={styles.itemTitleDesc}>{distr.EMAIL}</Text>
                                                                                                </View>
                                                                                                {distributeur?.ID_AFFECTATION == distr.ID_AFFECTATION ? <Fontisto name="checkbox-active" size={21} color="#007bff" /> :
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

        const submitInMalle = async () => {
                try {
                        const form = new FormData()
                        form.append('USER', data.malle)
                        form.append('USER', data.aille)

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
                                <Text style={styles.titlePrincipal}>Detail de volume dans un malle</Text>
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
                                        <TouchableOpacity style={styles.selectContainer} onPress={openMallesModalize}>
                                                <View>
                                                        <Text style={styles.selectLabel}>
                                                                Selectioner le malle
                                                        </Text>
                                                        <View>
                                                                <Text style={styles.selectedValue}>
                                                                        {malles ? `${malles.NUMERO_MAILLE}` : 'Aucun'}
                                                                </Text>
                                                        </View>
                                                </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.selectContainer} onPress={openBatimentModalize}>
                                                <View>
                                                        <Text style={styles.selectLabel}>
                                                                Selectioner le batiment
                                                        </Text>
                                                        <View>
                                                                <Text style={styles.selectedValue}>
                                                                        {batiments ? `${batiments.NUMERO_BATIMENT}` : 'Aucun'}
                                                                </Text>
                                                        </View>
                                                </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.selectContainer} onPress={openAilleModalize}>
                                                <View>
                                                        <Text style={styles.selectLabel}>
                                                                Selectioner ailles
                                                        </Text>
                                                        <View>
                                                                <Text style={styles.selectedValue}>
                                                                        {ailles ? `${ailles.NUMERO_AILE}` : 'Aucun'}
                                                                </Text>
                                                        </View>
                                                </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.selectContainer} onPress={openDistributeurModalize}>
                                                <View>
                                                        <Text style={styles.selectLabel}>
                                                                Selectioner le distributeur
                                                        </Text>
                                                        <View>
                                                                <Text style={styles.selectedValue}>
                                                                        {distributeur ? `${distributeur.NOM}` + `${distributeur.PRENOM}` : 'Aucun'}
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
                                onPress={submitInMalle}
                        >
                                <View style={styles.button}>
                                        <Text style={styles.buttonText}>Enregistrer</Text>
                                </View>
                        </TouchableWithoutFeedback>
                        <Portal>
                                <Modalize ref={volumeModalizeRef}  >
                                        <VolumeAgentSuperviseurList />
                                </Modalize>
                        </Portal>
                        <Portal>
                                <Modalize ref={maleModalizeRef}  >
                                        <MalleList />
                                </Modalize>
                        </Portal>

                        <Portal>
                                <Modalize ref={batimentModalizeRef}  >
                                        <BatimentList />
                                </Modalize>
                        </Portal>
                        <Portal>
                                <Modalize ref={aillesModalizeRef}  >
                                        <AillesList batiments={batiments} />
                                </Modalize>
                        </Portal>
                        <Portal>
                                <Modalize ref={distributrutModalizeRef}  >
                                        <DistributeurAgentList ailles={ailles} />
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