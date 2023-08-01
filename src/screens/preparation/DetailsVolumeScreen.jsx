import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, Image } from "react-native";
import { Ionicons, AntDesign, Feather, Fontisto } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from '../../styles/COLORS';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import * as DocumentPicker from 'expo-document-picker';
import fetchApi from "../../helpers/fetchApi";
import useFetch from "../../hooks/useFetch";
import Loading from "../../components/app/Loading";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

/**
 * Le screen pour associer un volume a un agents superviseur
 * @author claudine NDAYISABA <claudine@mediabox.bi>
 * @date 1/08/2021
 * @returns 
 */

export default function DetailsVolumeScreen() {
    const route = useRoute()
    const { volume } = route.params
    console.log(volume.volume.NUMERO_VOLUME)
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const [document, setDocument] = useState(null)

    const [data, handleChange, setValue] = useForm({
        numero: '',
        // document:null
    })

    const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
        numero: {
            required: true
        },
        // document:{
        //         required: true
        // }
    }, {
        numero: {
            required: 'ce champ est obligatoire',
        },
        // document: {
        //         required: 'ce champ est obligatoire',
        // }
    })

    const isValidAdd = () => {
        var isValid = false
        isValid = data.numero > 0 ? true : false
        isValid = volumes != null ? true : false
        isValid = agents != null ? true : false
        isValid = document != null ? true : false
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

    //Fonction pour le prendre l'image avec l'appareil photos
    const onTakePicha = async () => {
        try {
            const permission = await ImagePicker.requestCameraPermissionsAsync()
            if (!permission.granted) return false
            const image = await ImagePicker.launchCameraAsync()
            if (!image.didCancel) {
                setDocument(image)
            }
        }
        catch (error) {
            console.log(error)
        }
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
        const [loadingVolume, volumesAll] = useFetch('/volume/dossiers/volumes')
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
                                                    <Text style={styles.itemTitle}>{volume.volume.NUMERO_VOLUME}</Text>
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

    //Modal pour afficher la liste de agents archivages existants
    const AgentArchivageList = () => {
        const [loadingAgentArchive, agentSuperviseurArchives] = useFetch('/preparation/batiment/agentArchive')
        return (
            <>
                {loadingAgentArchive ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator animating size={'large'} color={'#777'} />
                </View> :
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Les agents superviseurs archives</Text>
                        </View>
                        {agentSuperviseurArchives.result.map((ag, index) => {
                            return (
                                <ScrollView key={index}>
                                    <TouchableNativeFeedback onPress={() => setSelectedAgent(ag)}>
                                        <View style={styles.modalItem} >
                                            <View style={styles.modalImageContainer}>
                                                {ag.PHOTO_USER ? <Image source={{ uri: ag.PHOTO_USER }} style={styles.image} /> :
                                                    <Image source={require('../../../assets/images/user.png')} style={styles.image} />}
                                            </View>
                                            <View style={styles.modalItemCard}>
                                                <View>
                                                    <Text style={styles.itemTitle}>{ag.NOM} {ag.PRENOM}</Text>
                                                    <Text style={styles.itemTitleDesc}>{ag.EMAIL}</Text>
                                                </View>
                                                {agents?.USERS_ID == ag.USERS_ID ? <Fontisto name="checkbox-active" size={21} color="#007bff" /> :
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

    //fonction pour envoyer les donnes dans la base 
    const handleSubmit = async () => {
        try {
            setLoading(true)
            const form = new FormData()
            form.append('NOMBRE_DOSSIER', data.numero)
            form.append('ID_USERS', agents.USERS_ID)
            if (document) {
                const manipResult = await manipulateAsync(
                    document.uri,
                    [
                        { resize: { width: 500 } }
                    ],
                    { compress: 0.8, format: SaveFormat.JPEG }
                );
                let localUri = manipResult.uri;
                let filename = localUri.split('/').pop();
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;
                form.append('PV', {
                    uri: localUri, name: filename, type
                })
            }
            const res = await fetchApi(`/preparation/volume/modifier/${volume.ID_VOLUME}`, {
                method: 'PUT',
                body: form,
            })
            navigation.goBack()
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (<>
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
                <Text style={styles.titlePrincipal}>Nommer un agent archive</Text>
            </View>
            <ScrollView>
                <View>
                    <View style={styles.selectContainer} >
                        <View>
                            <Text style={styles.selectLabel}>
                                Volume
                            </Text>
                            <View>
                                <Text style={styles.selectedValue}>
                                    {volume ? `${volume.volume.NUMERO_VOLUME}` : 'Aucun'}
                                </Text>
                                {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                        <Text style={styles.selectedValue}>
                                                                                M
                                                                        </Text>
                                                                </View> */}
                            </View>
                        </View>
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
                                    {agents ? `${agents.NOM}` + `${agents.PRENOM}` : 'Aucun'}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onTakePicha}>
                        <View style={[styles.addImageItem]}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Feather name="image" size={24} color="#777" />
                                <Text style={styles.addImageLabel}>
                                    Photo du proces verbal
                                </Text>
                            </View>
                            {document && <Image source={{ uri: document.uri }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />}
                        </View>
                    </TouchableOpacity>

                </View>
            </ScrollView>
            
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
    modalItemCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1
    },
    itemTitleDesc: {
        color: "#777",
        marginLeft: 10,
        fontSize: 11
    },
    addImageItem: {
        borderWidth: 0.5,
        borderColor: "#000",
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginBottom: 5
    },
    addImageLabel: {
        marginLeft: 5,
        opacity: 0.8
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
        resizeMode: "center"
    }
})