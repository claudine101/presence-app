import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, Alert, Image } from "react-native";
import { Ionicons, AntDesign, Feather, EvilIcons, Fontisto } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from '../../styles/COLORS';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { launchCamera } from 'react-native-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import useFetch from "../../hooks/useFetch";
import { useEffect } from "react";
import fetchApi from "../../helpers/fetchApi";
import Loading from "../../components/app/Loading";

/**
 * Le screen pour aider le superviseur chef plateaux d'enregistrer le donnees de superviseur de preparation
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 12/7/2021
 * @returns 
 */

export default function AddDetailsFolioScreen() {
        const navigation = useNavigation()
        const [loading, setLoading] = useState(false)
        const route = useRoute()
        const {folio,users } = route.params
        console.log(users)
        const [data, handleChange, setValue] = useForm({
                parcelle: '',
                localite: '',
                nom: '',
                nombre: '',
                doublon: '',
                prenom: ''
        })

        const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
                parcelle: {
                        required: true
                },
                localite: {
                        required: true
                },
                nom: {
                        required: true
                },
                nombre: {
                        required: true
                },
                doublon: {
                        required: true
                },
                prenom: {
                        required: true
                }
        }, {
                parcelle: {
                        required: 'ce champ est obligatoire',
                },
                localite: {
                        required: 'ce champ est obligatoire',
                },
                nom: {
                        required: 'ce champ est obligatoire',
                },
                nombre: {
                        required: 'ce champ est obligatoire',
                },
                doublon: {
                        required: 'ce champ est obligatoire',
                },
                prenom: {
                        required: 'ce champ est obligatoire',
                }
        })

        const [logoImage, setLogoImage] = useState(null)
        const [loadingCompress, setLoadingCompress] = useState(null)

        const isValidAdd = () => {
                var isValid = false
                isValid = agentPreparation != null ? true : false
                isValid = allFolio != null ? true : false
                isValid = logoImage != null ? true : false
                return isValid && isValidate()
        }

        //Fonction pour upload un documents 
        // const selectdocument = async () => {
        //         setError("document", "")
        //         handleChange("document", null)
        //         const document = await DocumentPicker.getDocumentAsync({
        //                 type: ["image/*", "application/pdf", "application/docx", "application/xls", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        //         })
        //         if (document.type == 'cancel') {
        //                 return false
        //         }
        //         var sizeDocument = ((document.size / 1000) / 1000).toFixed(2)
        //         if (sizeDocument <= 2) {
        //                 handleChange("document", document)
        //         }
        //         else {
        //                 setError("document", ["Document trop volumineux(max:2M)"])
        //         }

        // }

        // Agent preparation select
        const preparationModalizeRef = useRef(null);
        const [agentPreparation, setAgentPreparation] = useState(null);
        const openPreparationModalize = () => {
                preparationModalizeRef.current?.open();
        };
        const setSelectedPreparartion = (prep) => {
                preparationModalizeRef.current?.close();
                setAgentPreparation(prep)
        }

        // Folio select
        const folioModalizeRef = useRef(null);
        const [allFolio, setAllFolio] = useState(null);
        const openFolioModalize = () => {
                folioModalizeRef.current?.open();
        };
        const setSelectedFolio = (fol) => {
                folioModalizeRef.current?.close();
                setAllFolio(fol)
        }

        //Composent pour afficher le modal des agents de preparation
        const PreparationList = () => {
                const [loadingAgentPrepa, allAgentsPreparation] = useFetch('/folio/dossiers/agentPreparation')
                return (
                        <>
                                {loadingAgentPrepa ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Les agents de preparations</Text>
                                                </View>
                                                {allAgentsPreparation.result.map((prep, index) => {
                                                        return (
                                                                <ScrollView key={index}>
                                                                        <TouchableNativeFeedback onPress={() => setSelectedPreparartion(prep)}>
                                                                                <View style={styles.modalItem} >
                                                                                        <View style={styles.modalImageContainer}>
                                                                                                <AntDesign name="addusergroup" size={24} color="black" />
                                                                                        </View>
                                                                                        <View style={styles.modalItemCard}>
                                                                                                <View>
                                                                                                        <Text style={styles.itemTitle}>{prep.NOM} {prep.PRENOM}</Text>
                                                                                                        <Text style={styles.itemTitleDesc}>{prep.EMAIL}</Text>
                                                                                                </View>
                                                                                                {agentPreparation?.ID_USER_AILE == prep.ID_USER_AILE ? <Fontisto name="checkbox-active" size={21} color="#007bff" /> :
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

        //Composent pour afficher le modal de listes de folio
        const FolioList = ({ agentPreparation }) => {
                const [allFolios, setAllFolios] = useState([])
                const [loadingFolio, setLoadingFolio] = useState(false)
                useEffect(() => {
                        (async () => {
                                try {
                                        setLoadingFolio(true)
                                        var url = `/folio/dossiers/getFolios`
                                        if (agentPreparation) {
                                                url += `?AGENT_PREPARATION=${agentPreparation.ID_USER_AILE}`
                                        }
                                        const res = await fetchApi(url)
                                        setAllFolios(res.result)
                                }
                                catch (error) {
                                        console.log(error)
                                } finally {
                                        setLoadingFolio(false)
                                }
                        })()
                }, [agentPreparation])


                return (
                        <>
                                {loadingFolio ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Listes des folios</Text>
                                                </View>
                                                {allFolios.map((fol, index) => {
                                                        return (
                                                                <ScrollView key={index}>
                                                                        <TouchableNativeFeedback onPress={() => setSelectedFolio(fol)}>
                                                                                <View style={styles.modalItem} >
                                                                                        <View style={styles.modalImageContainer}>
                                                                                                <AntDesign name="folderopen" size={20} color="black" />
                                                                                        </View>
                                                                                        <View style={styles.modalItemCard}>
                                                                                                <View>
                                                                                                        <Text style={styles.itemTitle}>{fol.NUMERO_FOLIO}</Text>
                                                                                                        <Text style={styles.itemTitleDesc}>{fol.CODE_FOLIO}</Text>
                                                                                                </View>
                                                                                                {allFolio?.ID_FOLIO == fol.ID_FOLIO ? <Fontisto name="checkbox-active" size={21} color="#007bff" /> :
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


        //Fonction pour le prendre l'image avec l'appareil photos
        const onTakePicha = async () => {
                try {
                        const permission = await ImagePicker.requestCameraPermissionsAsync()
                        if (!permission.granted) return false
                        const image = await ImagePicker.launchCameraAsync()
                        if (!image.didCancel) {
                                setLogoImage(image)
                                // const photo = image.assets[0]
                                // const photoId = Date.now()
                                // const manipResult = await manipulateAsync(
                                //         photo.uri,
                                //         [
                                //                 { resize: { width: 500 } }
                                //         ],
                                //         { compress: 0.7, format: SaveFormat.JPEG }
                                // );
                                // setLogoImage(manipResult)
                        }
                }
                catch (error) {
                        console.log(error)
                }

        }


        //Fonction pour importer l'image dans le galerie

        // const inporterImages = async () => {
        //         modelRef.current.close()
        //         const permission = await ImagePicker.requestCameraPermissionsAsync()
        //         if (!permission.granted) return false
        //         let photo = await ImagePicker.launchImageLibraryAsync({
        //                 mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //                 allowsMultipleSelection: true
        //         })
        //         if (!photo.cancelled) {
        //                 setLogoImage(photo)
        //         }
        // }

        const submitData = async () => {
                try {
                        setLoading(true)
                        const form = new FormData()
                        form.append('NUMERO_PARCELLE', data.parcelle)
                        form.append('LOCALITE', data.localite)
                        form.append('NOM_PROPRIETAIRE', data.nom)
                        form.append('PRENOM_PROPRIETAIRE', data.prenom)
                        form.append('NUMERO_FEUILLE', data.nombre)
                        form.append('NOMBRE_DOUBLON', data.doublon)
                        form.append('ID_FOLIO', folio.ID_FOLIO)
                        if (logoImage) {
                                const manipResult = await manipulateAsync(
                                        logoImage.uri,
                                        [
                                                { resize: { width: 500 } }
                                        ],
                                        { compress: 0.8, format: SaveFormat.JPEG }
                                );
                                let localUri = manipResult.uri;
                                let filename = localUri.split('/').pop();
                                let match = /\.(\w+)$/.exec(filename);
                                let type = match ? `image/${match[1]}` : `image`;
                                form.append('PHOTO_DOSSIER', {
                                        uri: localUri, name: filename, type
                                })

                        }
                        const volume = await fetchApi(`/preparation/folio/addDetails`, {
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
                        {loading && <Loading/>}
                        <View style={styles.container}>
                                <View style={styles.cardHeader}>
                                        <TouchableNativeFeedback
                                                onPress={() => navigation.goBack()}
                                                background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                                                <View style={styles.backBtn}>
                                                        <Ionicons name="arrow-back-sharp" size={24} color="#fff" />
                                                </View>
                                        </TouchableNativeFeedback>
                                        <Text style={styles.titlePrincipal}>Ajout de details :{folio.NUMERO_FOLIO}</Text>
                                </View>
                                <ScrollView>
                                        <View>
                                                <View style={{ marginVertical: 8 }}>
                                                        <OutlinedTextField
                                                                label="Nom du parcelle"
                                                                fontSize={14}
                                                                baseColor={COLORS.smallBrown}
                                                                tintColor={COLORS.primary}
                                                                containerStyle={{ borderRadius: 20 }}
                                                                lineWidth={1}
                                                                activeLineWidth={1}
                                                                errorColor={COLORS.error}
                                                                value={data.parcelle}
                                                                onChangeText={(newValue) => handleChange('parcelle', newValue)}
                                                                onBlur={() => checkFieldData('parcelle')}
                                                                error={hasError('parcelle') ? getError('parcelle') : ''}
                                                                autoCompleteType='off'
                                                                blurOnSubmit={false}
                                                        />
                                                </View>
                                                <View style={{ marginVertical: 8 }}>
                                                        <OutlinedTextField
                                                                label="localite"
                                                                fontSize={14}
                                                                baseColor={COLORS.smallBrown}
                                                                tintColor={COLORS.primary}
                                                                containerStyle={{ borderRadius: 20 }}
                                                                lineWidth={1}
                                                                activeLineWidth={1}
                                                                errorColor={COLORS.error}
                                                                value={data.localite}
                                                                onChangeText={(newValue) => handleChange('localite', newValue)}
                                                                onBlur={() => checkFieldData('localite')}
                                                                error={hasError('localite') ? getError('localite') : ''}
                                                                autoCompleteType='off'
                                                                blurOnSubmit={false}
                                                        />
                                                </View>
                                                <View style={{ marginVertical: 8 }}>
                                                        <OutlinedTextField
                                                                label="Nom du proprietaire"
                                                                fontSize={14}
                                                                baseColor={COLORS.smallBrown}
                                                                tintColor={COLORS.primary}
                                                                containerStyle={{ borderRadius: 20 }}
                                                                lineWidth={1}
                                                                activeLineWidth={1}
                                                                errorColor={COLORS.error}
                                                                value={data.nom}
                                                                onChangeText={(newValue) => handleChange('nom', newValue)}
                                                                onBlur={() => checkFieldData('nom')}
                                                                error={hasError('nom') ? getError('nom') : ''}
                                                                autoCompleteType='off'
                                                                blurOnSubmit={false}
                                                        />
                                                </View>
                                                <View style={{ marginVertical: 8 }}>
                                                        <OutlinedTextField
                                                                label="Prenom du proprietaire"
                                                                fontSize={14}
                                                                baseColor={COLORS.smallBrown}
                                                                tintColor={COLORS.primary}
                                                                containerStyle={{ borderRadius: 20 }}
                                                                lineWidth={1}
                                                                activeLineWidth={1}
                                                                errorColor={COLORS.error}
                                                                value={data.prenom}
                                                                onChangeText={(newValue) => handleChange('prenom', newValue)}
                                                                onBlur={() => checkFieldData('prenom')}
                                                                error={hasError('prenom') ? getError('prenom') : ''}
                                                                autoCompleteType='off'
                                                                blurOnSubmit={false}
                                                        />
                                                </View>
                                                <TouchableWithoutFeedback onPress={onTakePicha}>
                                                        <View style={[styles.addImageItem]}>
                                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                                        <Feather name="image" size={24} color="#777" />
                                                                        <Text style={styles.addImageLabel}>
                                                                                Photo du document
                                                                        </Text>
                                                                </View>
                                                                {logoImage && <Image source={{ uri: logoImage.uri }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />}
                                                        </View>
                                                </TouchableWithoutFeedback>
                                                <View style={{ marginVertical: 8 }}>
                                                        <OutlinedTextField
                                                                label="Nombre de feuille"
                                                                fontSize={14}
                                                                baseColor={COLORS.smallBrown}
                                                                tintColor={COLORS.primary}
                                                                containerStyle={{ borderRadius: 20 }}
                                                                lineWidth={1}
                                                                activeLineWidth={1}
                                                                errorColor={COLORS.error}
                                                                value={data.nombre}
                                                                onChangeText={(newValue) => handleChange('nombre', newValue)}
                                                                onBlur={() => checkFieldData('nombre')}
                                                                error={hasError('nombre') ? getError('nombre') : ''}
                                                                autoCompleteType='off'
                                                                blurOnSubmit={false}
                                                        />
                                                </View>
                                                <View style={{ marginVertical: 8 }}>
                                                        <OutlinedTextField
                                                                label="Nombre de doublon"
                                                                fontSize={14}
                                                                baseColor={COLORS.smallBrown}
                                                                tintColor={COLORS.primary}
                                                                containerStyle={{ borderRadius: 20 }}
                                                                lineWidth={1}
                                                                activeLineWidth={1}
                                                                errorColor={COLORS.error}
                                                                value={data.doublon}
                                                                onChangeText={(newValue) => handleChange('doublon', newValue)}
                                                                onBlur={() => checkFieldData('doublon')}
                                                                error={hasError('doublon') ? getError('doublon') : ''}
                                                                autoCompleteType='off'
                                                                blurOnSubmit={false}
                                                        />
                                                </View>
                                               
                                        </View>
                                </ScrollView>
                                <TouchableWithoutFeedback
                                        disabled={!isValidAdd()}
                                        onPress={submitData}
                                >
                                        <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                                                <Text style={styles.buttonText}>Enregistrer</Text>
                                        </View>
                                </TouchableWithoutFeedback>
                                <Portal>
                                        <Modalize ref={preparationModalizeRef}  >
                                                <PreparationList />
                                        </Modalize>
                                </Portal>
                                <Portal>
                                        <Modalize ref={folioModalizeRef}  >
                                                <FolioList agentPreparation={agentPreparation} />
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
        modalItem: {
                paddingHorizontal: 20,
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 20
        },
        modalItemTitle: {
                marginLeft: 10,
                fontWeight: "bold"
        },
        separator: {
                height: 1,
                width: "100%",
                backgroundColor: '#F1F1F1'
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