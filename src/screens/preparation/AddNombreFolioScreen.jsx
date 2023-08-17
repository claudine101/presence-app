import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, Image } from "react-native";
import { Ionicons, AntDesign, Feather, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
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
 *  et add nbre folio d'un volume
 * @author claudine NDAYISABA <claudine@mediabox.bi>
 * @date 1/08/2021
 * @returns 
 */

export default function AddNombreFolioScreen() {
    const route = useRoute()
    const { volume } = route.params
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const [document, setDocument] = useState(null)
    const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)

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
        var isValidAg = false

        isValid = data.numero > 0 ? true : false
        isValid = volumes != null ? true : false
        isValidAg = agents != null ? true : false
        isValid = document != null ? true : false
        return isValid && isValidAg && isValidate()
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
        setIsCompressingPhoto(true)
        const permission = await ImagePicker.requestCameraPermissionsAsync()
        if (!permission.granted) return false
        const image = await ImagePicker.launchCameraAsync()
        if (image.canceled) {
            return setIsCompressingPhoto(false)
        }
        const photo = image.assets[0]
        setDocument(photo)
        const manipResult = await manipulateAsync(
            photo.uri,
            [
                { resize: { width: 500 } }
            ],
            { compress: 0.7, format: SaveFormat.JPEG }
        );
        setIsCompressingPhoto(false)
        //     handleChange('pv', manipResult)
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
                                {loadingAgentArchive ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }} >
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View > :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Sélectionner l'agent superviseur archive</Text>
                                                </View>
                                                <View style={styles.modalList}>
                                                        {agentSuperviseurArchives.result.map((ag, index) => {
                                                                return (
                                                                        <ScrollView key={index}>
                                                                                <TouchableNativeFeedback onPress={() => setSelectedAgent(ag)}>
                                                                                        <View style={styles.listItem} >
                                                                                                <View style={styles.listItemDesc}>
                                                                                                        <View style={styles.listItemImageContainer}>
                                                                                                      {  ag.PHOTO_USER ? <Image source={{ uri: ag.PHOTO_USER }} style={styles.image} /> :
                                                                                                                <Image source={require('../../../assets/images/user.png')} style={styles.listItemImage} />}
                                                                                                        </View>
                                                                                                        <View style={styles.listNames}>
                                                                                                                <Text style={styles.itemTitle}>{ag.NOM} {ag.PRENOM}</Text>
                                                                                                                <Text style={styles.itemTitleDesc}>{ag.EMAIL}</Text>
                                                                                                        </View>
                                                                                                </View>
                                                                                                {agents?.USERS_ID == ag.USERS_ID ? 
                                                                                               <MaterialIcons name="radio-button-checked" size={24} color={COLORS.primary} />:
                                                                                               <MaterialIcons name="radio-button-unchecked" size={24} color={COLORS.primary} />}
                                                                                        </View>
                                                                                </TouchableNativeFeedback>
                                                                        </ScrollView>
                                                                )
                                                        })}
                                                </View>
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
            <View style={styles.header}>
                <TouchableNativeFeedback
                    onPress={() => navigation.goBack()}
                    background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                    <View style={styles.headerBtn}>
                        <Ionicons name="chevron-back-outline" size={24} color="black" />
                    </View>
                </TouchableNativeFeedback>
                <View style={styles.cardTitle}>
                    <Text style={styles.title} numberOfLines={2}>Affecter un agent superviseur</Text>
                </View>
            </View>
            <ScrollView style={styles.inputs}>
                <TouchableOpacity style={styles.selectContainer}>
                    <View style={styles.labelContainer}>
                        <View style={styles.icon}>
                            <MaterialCommunityIcons name="file-document-multiple-outline" size={20} color="#777" />
                        </View>
                        <Text style={styles.selectLabel}>
                            Volume
                        </Text>
                    </View>
                    <Text style={styles.selectedValue}>
                        {volume ? `${volume.volume.NUMERO_VOLUME}` : 'Aucun'}
                    </Text>
                </TouchableOpacity>
                <View style={{ marginVertical: 8 }}>
                    <OutlinedTextField
                        label="Nombre de dossier"
                        fontSize={14}
                        baseColor={COLORS.smallBrown}
                        tintColor={COLORS.primary}
                        containerStyle={{ borderRadius: 20 }}
                        lineWidth={0.25}
                        activeLineWidth={0.25}
                        errorColor={COLORS.error}
                        value={data.numero}
                        onChangeText={(newValue) => handleChange('numero', newValue)}
                        onBlur={() => checkFieldData('numero')}
                        error={hasError('numero') ? getError('numero') : ''}
                        autoCompleteType='off'
                        blurOnSubmit={false}
                        keyboardType='number-pad'
                    />
                </View>
                <TouchableOpacity style={styles.selectContainer} onPress={openAgentModalize}>
                    <View style={styles.labelContainer}>
                        <View style={styles.icon}>
                            <Feather name="user" size={20} color="#777" />
                        </View>
                        <Text style={styles.selectLabel}>
                            Agent superviseur d'archive
                        </Text>
                    </View>
                    <Text style={styles.selectedValue}>
                        {agents ? `${agents.NOM} ${agents.PRENOM}` : "Cliquer pour choisir l'agent"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onTakePicha}>
                    <View style={[styles.addImageItem]}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <FontAwesome5 name="file-signature" size={20} color="#777" />
                                <Text style={styles.addImageLabel}>
                                    Photo du procès verbal
                                </Text>
                            </View>
                            {isCompressingPhoto ? <ActivityIndicator animating size={'small'} color={'#777'} /> : null}
                        </View>
                        {document && <Image source={{ uri: document.uri }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />}
                    </View>
                </TouchableOpacity>
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
    </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    headerBtn: {
        padding: 10
    },
    title: {
        paddingHorizontal: 5,
        fontSize: 17,
        fontWeight: 'bold',
        color: '#777',
        // color: COLORS.primary
    },
    cardTitle: {
        maxWidth: "85%"
    },
    inputs: {
        paddingHorizontal: 10
    },
    selectContainer: {
        backgroundColor: "#fff",
        padding: 13,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#ddd",
        marginVertical: 10
    },
    selectedValue: {
        color: '#777',
        marginTop: 2
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    selectLabel: {
        marginLeft: 5
    },
    addImageItem: {
        borderWidth: 0.5,
        borderColor: "#ddd",
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginBottom: 5
    },
    addImageLabel: {
        marginLeft: 5,
        opacity: 0.8
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    modalTitle: {
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
        fontSize: 16
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    listItemImageContainer: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
    },
    listItemImage: {
        width: '60%',
        height: '60%',
    },
    listItemDesc: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    listNames: {
        marginLeft: 10
    },
    listItemTitle: {
        fontWeight: 'bold'
    },
    listItemSubTitle: {
        color: '#777',
        fontSize: 12,
        marginTop: 5
    },
    addImageItem: {
        borderWidth: 0.5,
        borderColor: "#ddd",
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginBottom: 5
    },
    addImageLabel: {
        marginLeft: 5,
        opacity: 0.8
    },
    button: {
        marginTop: 10,
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 10,
        backgroundColor: COLORS.primary,
        marginHorizontal: 10
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center"
    },
})