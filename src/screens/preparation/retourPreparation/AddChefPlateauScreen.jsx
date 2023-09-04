import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Image } from "react-native";
import { Ionicons, AntDesign, Fontisto, FontAwesome5,MaterialCommunityIcons,MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../styles/COLORS';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import * as DocumentPicker from 'expo-document-picker';
import { useForm } from '../../../hooks/useForm';
import { useFormErrorsHandle } from '../../../hooks/useFormErrorsHandle';
import useFetch from "../../../hooks/useFetch";
import Loading from "../../../components/app/Loading";
import { useEffect } from "react";
import fetchApi from "../../../helpers/fetchApi";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

/**
 * Le screen pour aider un superviseur aille affecter un chef du plateaux
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 17/7/2021
 * @returns 
 */

export default function AddChefPlateauScreen() {
        const navigation = useNavigation()
        const [loading, setLoading] = useState(false)
        const route = useRoute()
        const { volume ,histo_IDETAPE} = route.params
        const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
        const [loadingInformation, setLoadingInformation] = useState(false)
        const [informations, setInformations] = useState(null);
        const [document, setDocument] = useState(null)

        const [data, handleChange, setValue] = useForm({
                // document: null,
        })

        const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {

        }, {
        })

        const isValidAdd = () => {
                var isValid = false
                isValid = volumes != null ? true : false
                isValid = chefPlateaux != null ? true : false
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

        //Composent pour afficher le modal des chefs des plateaux
        const ChefPlateauList = () => {
                const [loadingSuperviseur, superviseurList] = useFetch('/preparation/batiment/chefPlateau')
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
                                                                                        <View style={styles.imageContainer}>
                                                                                                {chef.PHOTO_USER ? <Image source={{ uri: chef.PHOTO_USER }} style={styles.image} /> :
                                                                                                        <Image source={require('../../../../assets/images/user.png')} style={styles.image} />}
                                                                                        </View>
                                                                                        <View style={styles.modalItemCard}>
                                                                                                <View>
                                                                                                        <Text style={styles.itemTitle}>{chef.NOM} {chef.PRENOM}</Text>
                                                                                                        <Text style={styles.itemTitleDesc}>{chef.EMAIL}</Text>
                                                                                                </View>
                                                                                                {chefPlateaux?.USERS_ID == chef.USERS_ID ?  <MaterialIcons name="radio-button-checked" size={24} color={COLORS.primary} />:
                                                                                               <MaterialIcons name="radio-button-unchecked" size={24} color={COLORS.primary} />}
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
                                                {volumesAll.result?.length == 0 ? <View style={styles.modalHeader}><Text>Aucun volumes trouves</Text></View> : null}
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
                        form.append('CHEF_PLATEAU', chefPlateaux.USERS_ID)
                        form.append('ID_MAILLE', volume?.maille?.ID_MAILLE)
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
                        const vol = await fetchApi(`/preparation/volume/addChefEquipe`, {
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
                                <View style={styles.header}>
                                        <TouchableNativeFeedback
                                                onPress={() => navigation.goBack()}
                                                background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                                                <View style={styles.headerBtn}>
                                                        <Ionicons name="chevron-back-outline" size={24} color="black" />
                                                </View>
                                        </TouchableNativeFeedback>
                                        <View style={styles.cardTitle}>
                                                <Text style={styles.title} numberOfLines={2}>Affecter un chef plateau</Text>
                                        </View>
                                </View>
                                <ScrollView>
                                        <View>
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
                                                {volume ? <View style={styles.selectContainer}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Malle
                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {volume.mailleNoTraite ? `${volume.mailleNoTraite?.NUMERO_MAILLE}` : 'N/B'}
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </View> : null}
                                                {volume ? <View style={styles.selectContainer}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Dossier
                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {volume.folios?.length ? volume.folios?.length : "0"} dossier{volume.folios?.length > 1 && 's'}

                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </View> : null}
                                                <TouchableOpacity style={styles.selectContainer} onPress={openChefPlateauModalize}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Chef de plateau
                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {chefPlateaux ? `${chefPlateaux.NOM}` + ` ${chefPlateaux.PRENOM}` : 'Sélectionner un chef de plateau'}
                                                                        </Text>
                                                                </View>
                                                        </View>
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
                                        </View>
                                </ScrollView>
                                <TouchableWithoutFeedback
                                        disabled={!isValidAdd()}
                                        onPress={submitInAille}
                                >
                                        <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                                                <Text style={styles.buttonText}>Enregistrer </Text>
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
                backgroundColor: '#fff'
        },
        cardHeader: {
                flexDirection: 'row',
                marginTop: StatusBar.currentHeight,
                alignContent: "center",
                alignItems: "center",
                marginBottom: 15
        },
        backBtn: {
                backgroundColor: COLORS.primary,
                justifyContent: 'center',
                alignItems: 'center',
                width: 50,
                height: 50,
                borderRadius: 50,
        },
        titlePrincipal: {
                fontSize: 15,
                fontWeight: "bold",
                marginLeft: 10,
                color: COLORS.primary
        },
        selectContainer: {
                backgroundColor: "#fff",
                padding: 13,
                borderRadius: 5,
                borderWidth: 0.5,
                borderColor: "#ddd",
                marginVertical: 10,
                marginHorizontal: 10

        },
        selectedValue: {
                color: '#777',
                marginLeft: 5
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
                backgroundColor: COLORS.primary,
                marginHorizontal:10
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
        addImageItem: {
                borderWidth: 0.5,
                borderColor: "#ddd",
                borderRadius: 5,
                paddingHorizontal: 10,
                paddingVertical: 15,
                marginBottom: 5,
                marginHorizontal:10
            },
        addImageLabel: {
                marginLeft: 5,
                opacity: 0.8
        },
        imageContainer: {
                width: 40,
                height: 40,
                backgroundColor: COLORS.handleColor,
                borderRadius: 10,
                padding: 5
        },
        image: {
                width: "100%",
                height: "100%",
                borderRadius: 10,
                resizeMode: "center"
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
                fontSize: 16,
                fontWeight: 'bold',
                color: '#777',
        },
        cardTitle: {
                maxWidth: "85%"
        },
       
        labelContainer: {
                flexDirection: 'row',
                alignItems: 'center'
        },
        selectLabel: {
                marginLeft: 5
        },
})