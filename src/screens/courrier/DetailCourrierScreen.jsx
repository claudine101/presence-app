import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { ImageBackground, ScrollView, StyleSheet, StatusBar, Text, TouchableNativeFeedback, Linking, useWindowDimensions, View, Image, TouchableOpacity, ActivityIndicator, Alert, ToastAndroid } from "react-native";
import moment from 'moment'
import { Ionicons, AntDesign, MaterialIcons, FontAwesome5, Feather, MaterialCommunityIcons, Zocial, FontAwesome, Entypo } from '@expo/vector-icons';
import { COLORS } from "../../styles/COLORS";
import fetchApi from "../../helpers/fetchApi";
import Loading from "../../components/app/Loading";
import { Modalize } from "react-native-modalize";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as WebBrowser from 'expo-web-browser';
import * as DocumentPicker from 'expo-document-picker';
import { useForm } from "../../hooks/useForm";
import { useSelector } from "react-redux";
import { userSelector } from "../../store/selectors/userSelector";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
/**
 * Screen pour faire le detail du courrier 
 * @author NDAYIKENGURUKIYE Innocent <ndayikengurukiye.innocent@mediabox.bi>
 * @date 27/04/2023
 * @returns 
 */
export default function DetailCourrierScreen() {
    const [loading, setLoading] = useState(true)
    const [loadingDocument, setLoadingDocument] = useState(true)
    const [loadingDraft, setLoadingDraft] = useState(true)

    const [loadingmodifier, setLoadingmodier] = useState(false)
    const navigation = useNavigation()
    const user = useSelector(userSelector)
    const route = useRoute()
    const [document, setDocument] = useState(null)
    const [documents, setDocuments] = useState(null)
    const traitementModalizeRef = useRef(null)
    const { courrier, detailNotification } = route.params
    var id
    if (detailNotification) {
        id = courrier.ID_COURRIER
    }
    else {
        id = courrier.ID_COURRIER_ENTRANT
    }
    const [data, handleChange, setValue] = useForm({
        draft: null,
        decision: null,
        commentaire: null
    })
    const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
        document: {
            required: true
        }
    })
    const [detail, setDetail] = useState({})
    useEffect(() => {
        (async () => {
            try {
                const response = await fetchApi(`/courrier/courrier_entrants/courrier/${id}`)
                setDetail(response.result)
            }
            catch (error) {
                console.log({ error })
            }
            finally {
                setLoading(false)
            }
        })()
    }, [])
    const modifier = async () => {
        setLoadingmodier(true)
        try {
            const form = new FormData()
            if (data.draft) {

                let localUri = data.draft.uri;
                let filename = localUri.split('/').pop();
                form.append("draft", {
                    uri: data.draft.uri, name: filename, type: data.draft.mimeType
                })
            }
            if (data.decision != null) {
                form.append('decision', data.decision)
                form.append('commentaire', detail.ID_EXPEDITEUR_TYPE)
            }
            const res = await fetchApi(`/courrier/courrier_entrants/modifier/${detail.ID_COURRIER_ENTRANT}`, {
                method: 'PUT',
                body: form,
            })
            traitementModalizeRef.current?.close()
            navigation.navigate("AllCourrierScreen")
        }
        catch (error) {
            console.log(error)

        } finally {
            setLoadingmodier(false)
        }
    }
    useEffect(() => {
        (async () => {
            const perm = await MediaLibrary.requestPermissionsAsync()
            if (!perm.granted) return false
            if (detail.PATH_DOCUMENT) {
                const splits = detail.PATH_DOCUMENT.split('/')
                const fileName = splits[splits.length - 1]
                const downloadResult = await FileSystem.downloadAsync(
                    detail.PATH_DOCUMENT,
                    `${FileSystem.documentDirectory}/${fileName}`
                )
                const file = await FileSystem.getInfoAsync(downloadResult.uri)
                setDocument(file)
                setLoadingDocument(false)
            }
        })()
    }, [detail])
    useEffect(() => {
        (async () => {
            const perm = await MediaLibrary.requestPermissionsAsync()
            if (!perm.granted) return false
            if (detail.DRAFT) {
                const splits = detail.DRAFT.split('/')
                const fileName = splits[splits.length - 1]
                const downloadResult = await FileSystem.downloadAsync(
                    detail.DRAFT,
                    `${FileSystem.documentDirectory}/${fileName}`
                )
                const file = await FileSystem.getInfoAsync(downloadResult.uri)
                setDocuments(file)
                setLoadingDraft(false)
            }
        })()
    }, [detail])
    const openLink = async url => {
        const res = await WebBrowser.openBrowserAsync(url);
    }
    const getFileName = () => {
        if (detail.PATH_DOCUMENT) {
            const splits = detail.PATH_DOCUMENT.split('/')
            return splits[splits.length - 1]
        }
        return ""
    }
    const getFileNames = () => {
        if (detail.DRAFT) {
            const splits = detail.DRAFT.split('/')
            return splits[splits.length - 1]
        }
        return ""
    }
    const selectdocument = async () => {
        setError("draft", "")
        handleChange("draft", null)
        const draft = await DocumentPicker.getDocumentAsync({
            // ,"application/docx","application/xls"
            type: ["image/*", "application/pdf", "application/docx", "application/xls", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        })
        if (draft.type == 'cancel') {
            return false
        }
        var sizeDraft = ((draft.size / 1000) / 1000).toFixed(2)
        if (sizeDraft <= 2) {
            handleChange("draft", draft)
        }
        else {
            setError("draft", ["Document trop volumineux(max:2M)"])
        }
    }

    const openFile = async (url) => {
        try {
            const res = await WebBrowser.openBrowserAsync(document.uri);
        } catch (error) {
            console.log(error);
        }
    };
    const affecter = () => {
        navigation.navigate('AffecterCourrierScreen', {
            ...route.params,
            selectedAffect: detail.affected,
            inAffect: true,
            inEdit: false
        })
    }
    const canPrendreDecision = () => {


        if (detail.DRAFT && detail.NATURE_COURRIER == 1 && detail.STATUT_TRAITEMENT != 1) {
            return true
        }
        if (detail && detail.affected) {
            const isdestine = detail.affected.find(u => u.USERS_ID == user.USERS_ID && u.IS_AFFECTATION == 0) ? true : false
            return isdestine && detail.DRAFT && detail.STATUT_TRAITEMENT == 2
        }
        return false
    }
    const canEnvoyer = () => {
        if (canPrendreDecision()) {
            return data.decision != null
        }
        return data.draft != null
    }
    /**
    * fonction  utiliser pour  modifier  un courier
    * @author NDAYISABA claudine <claudinet@mediabox.bi>
    * @date 09/05/2023 à 21:07
    * @returns 
    */
    const handleEdit = courrier => {
        navigation.navigate("UpdateCourrierScreen", { courrier: detail, inEdit: true, inAffect: false })
    }
    /**
     * fonction  utiliser pour  supprimer  un courier
     * @author NDAYISABA claudine <claudinet@mediabox.bi>
     * @date 09/05/2023 à 21:07
     * @returns 
     */
    const supprimer = () => {
        Alert.alert(
            "Supprimer",
            "vous voulez supprimer ce courrier",
            [
                {
                    text: "annuler",
                    style: "cancel"
                },
                {
                    text: "oui", onPress: async () => {
                        try {
                            setLoading(true)
                            const res = await fetchApi(`/courrier/courrier_entrants/delete/${courrier.ID_COURRIER_ENTRANT}`, { method: "DELETE" })
                            navigation.navigate('Root', {
                                ...route.params,
                            })
                            ToastAndroid.show('suppression effectué avec succès!', ToastAndroid.LONG);
                        } catch (error) {
                            console.log(error)
                        } finally {
                            setLoading(false)
                        }
                    }
                }
            ]
        )

    }
    /**
 * modal pour faire le traitement du courrier 
 * @author NDAYIKENGURUKIYE Innocent <ndayikengurukiye.innocent@mediabox.bi>
 * @date 9/04/2023
 * @returns 
 */
    const TraitementModalize = () => {
        return (

            <View style={styles.modalContainer}>
                <View>
                    <View style={{ paddingHorizontal: 25 }}>
                        <View style={styles.titledraft}>
                            <Text style={[styles.detailTitle]}>
                                courrier
                            </Text>
                        </View>
                        {loadingDocument ? <View style={styles.detail}>
                            <ActivityIndicator animating size="large" color={"#777"} />
                        </View> :document ? <TouchableOpacity style={styles.detail} onPress={() => Linking.openURL(detail.PATH_DOCUMENT)}>
                            <Text style={styles.detailTitle} numberOfLines={1}>
                                <Ionicons name="document-outline" size={20} color="black" />{getFileName()}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.detailValue}>{getFileName().split(".")[1].toUpperCase()} - </Text>
                                <Text style={[styles.detailValue, { color: '#333' }]}>
                                    {((document.size / 1000) / 1000).toFixed(2)} M
                                </Text>
                            </View>
                        </TouchableOpacity> : null}

                        {detail.URL_DOCUMENT ? <TouchableOpacity style={styles.detail} onPress={() => openLink(detail.URL_DOCUMENT)}>
                            <Text style={styles.detailTitle}>
                                <Entypo name="link" size={20} color="black" /> Lien du courrier
                            </Text>
                            <Text style={[styles.detailValue, { color: '#007bff', textDecorationLine: 'underline' }]}>{detail.URL_DOCUMENT}</Text>
                        </TouchableOpacity> : null}
                        <View style={styles.titledraft}>
                            <Text style={[styles.detailTitle]}>
                                Draft du courrier
                            </Text>
                        </View>
                        {loadingDraft && detail.DRAFT ? <View style={styles.detail}>
                            <ActivityIndicator animating size="large" color={"#777"} />
                        </View> :documents ? <TouchableOpacity style={styles.detail} onPress={() => Linking.openURL(detail.DRAFT)}>
                            <Text style={styles.detailTitle} numberOfLines={1}>
                                <Ionicons name="document-outline" size={20} color="black" />{getFileNames()}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.detailValue}>{getFileNames().split(".")[1].toUpperCase()} - </Text>
                                <Text style={[styles.detailValue, { color: '#333' }]}>
                                    {((documents.size / 1000) / 1000).toFixed(2)} M
                                </Text>
                            </View>
                        </TouchableOpacity> : null}
                        {data.draft ? <View>
                            <Text style={[styles.selectedValue, { color: '#333' }]}>
                                {data.draft.name}
                            </Text>
                            <Text style={[styles.selectedValue, { color: '#333' }]}>
                                {((data.draft.size / 1000) / 1000).toFixed(2)} M

                            </Text></View> : null}
                        <TouchableOpacity
                            onPress={selectdocument}>
                            {!documents ? <Text style={[styles.selectLabel, { color: '#007bff', textDecorationLine: 'underline', marginLeft: 8 }]}>
                                Uploader un draft
                            </Text> : <TouchableOpacity
                                onPress={selectdocument}>
                                {documents ? <Text style={[styles.selectLabel, { color: '#007bff', textDecorationLine: 'underline', marginLeft: 8 }]}>
                                    Modifier le draft
                                </Text> : null}
                            </TouchableOpacity>}
                        </TouchableOpacity>
                        {hasError('draft') ? <Text style={{ marginTop: 5, paddingHorizontal: 10, fontSize: 12, color: "red" }}> {getError('draft')} </Text> : null}
                    </View>
                    {canPrendreDecision() ? <View style={styles.selectContainer}>
                        <View style={{ marginLeft: 10 }}>

                            <Text style={[styles.selectLabel]}>
                                Decision
                            </Text>

                            <TouchableOpacity
                                onPress={() => handleChange("decision", 1)}
                            >
                                <Text >
                                    {data?.decision == 1 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                        <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}Valider</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleChange("decision", 0)}
                            >
                                <Text>
                                    {data?.decision == 0 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                        <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}Retour  à la correction</Text>
                            </TouchableOpacity>

                            <Text style={[styles.selectedValue, { color: '#333' }]}>

                            </Text>
                            {/* {data?.decision == 0 && <View style={styles.inputCard}>
                                <View>
                                    <OutlinedTextField
                                        label="Commantaire"
                                        fontSize={14}
                                        multiline={true}
                                        baseColor={COLORS.smallBrown}
                                        tintColor={COLORS.primary}
                                        containerStyle={{ borderRadius: 20 }}
                                        lineWidth={1}
                                        activeLineWidth={1}
                                        value={data.commentaire}
                                        onChangeText={(newValue) => handleChange('commentaire', newValue)}
                                        onBlur={() => checkFieldData('commentaire')}
                                        autoCompleteType='off'
                                        blurOnSubmit={false}
                                    />
                                </View>
                            </View>} */}
                        </View>
                    </View> : null}
                    {loadingmodifier && <Loading />}
                    <TouchableOpacity disabled={!canEnvoyer()} style={[styles.button, !canEnvoyer() && { opacity: 0.5 }]} onPress={modifier} >
                        <Text style={styles.buttonText}>Envoyer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (

        <>
            <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                    <TouchableNativeFeedback
                        style={{}}
                        onPress={() => navigation.goBack()}
                        background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                        <View style={styles.headerBtn}>
                            <Ionicons name="arrow-back-sharp" size={24} color="#18678E" />
                        </View>
                    </TouchableNativeFeedback>
                    <Text style={styles.courrierCode}>
                        #{detail.CODE_REFERENCE}
                    </Text>
                </View>
                <View style={styles.courrierActions}>
                    {detail.STATUT_TRAITEMENT != 1 ? <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#c9c5c5', true)} onPress={() => handleEdit(courrier)}>
                        <View style={{ padding: 10 }}>
                            <AntDesign name="edit" size={24} color="#18678E" />
                        </View>
                    </TouchableNativeFeedback> : null}
                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#c9c5c5', true)} onPress={() => supprimer()}>
                        <View style={{ padding: 10 }}>
                            <Feather name="trash" size={24} color="red" />
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
            {loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator animating size="large" color={"#777"} />
            </View> :
                <ScrollView style={{ backgroundColor: "#E1EAF3", paddingHorizontal: 10 }}>
                    <View style={styles.detailCard}>
                        <View style={styles.detailCardHeader}>
                            <View style={styles.iconContainer}>
                                <Zocial name="statusnet" size={24} color="#071E43" />
                            </View>
                            <Text style={styles.cardTitle}>
                                Statut
                            </Text>
                        </View>
                        <View style={styles.detail}>
                            <Text style={styles.detailTitle}>Statut actuel</Text>
                            {detail.STATUT_TRAITEMENT == 0 ? <Text style={styles.detailValue}>En attente de traitement</Text> : null}
                            {detail.STATUT_TRAITEMENT == 1 ? <Text style={styles.detailValue}>traité</Text> : null}
                            {detail.STATUT_TRAITEMENT == 2 ? <Text style={styles.detailValue}>En attente de validation</Text> : null}
                        </View>
                    </View>
                    {detail.DRAFT ? <View style={styles.detailCard}>
                        <View style={styles.detailCardHeader}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="document-attach-outline" size={24} color="#071E43" />
                            </View>
                            <Text style={styles.cardTitle}>
                                Draft
                            </Text>

                        </View>
                        {loadingDraft ? <View style={styles.detail}>
                            <ActivityIndicator animating size="large" color={"#777"} />
                        </View> : detail.DRAFT ? <TouchableOpacity style={styles.detail} onPress={() => Linking.openURL(detail.DRAFT)}>
                            <Text style={styles.detailTitle} numberOfLines={1}>
                                <Ionicons name="document-outline" size={20} color="black" />{getFileNames()}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.detailValue}>{getFileNames().split(".")[1].toUpperCase()} - </Text>
                                <Text style={[styles.detailValue, { color: '#333' }]}>
                                    {((documents?.size / 1000) / 1000).toFixed(2)} M
                                </Text>
                            </View>
                        </TouchableOpacity> : null}
                    </View> : null}
                    <View style={styles.detailCard}>
                        <View style={styles.detailCardHeader}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="document-attach-outline" size={24} color="#071E43" />
                            </View>
                            <Text style={styles.cardTitle}>
                                Attachement
                            </Text>

                        </View>

                        {loadingDocument ? <View style={styles.detail}>
                            <ActivityIndicator animating size="large" color={"#777"} />
                        </View> : document ? <TouchableOpacity style={styles.detail} onPress={() => Linking.openURL(detail.PATH_DOCUMENT)}>
                            <Text style={styles.detailTitle} numberOfLines={1}>
                                <Ionicons name="document-outline" size={20} color="black" />{getFileName()}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.detailValue}>{getFileName().split(".")[1].toUpperCase()} - </Text>
                                <Text style={[styles.detailValue, { color: '#333' }]}>
                                    {((document.size / 1000) / 1000).toFixed(2)} M
                                </Text>
                            </View>
                        </TouchableOpacity> : null}
                        {detail.URL_DOCUMENT ? <TouchableOpacity style={styles.detail} onPress={() => openLink(detail.URL_DOCUMENT)}>
                            <Text style={styles.detailTitle}>
                                <Entypo name="link" size={20} color="black" /> Lien du courrier
                            </Text>
                            <Text style={[styles.detailValue, { color: '#007bff', textDecorationLine: 'underline' }]}>{detail.URL_DOCUMENT}</Text>
                        </TouchableOpacity> : null}
                    </View>
                    <View style={styles.detailCard}>
                        <View style={styles.detailCardHeader}>
                            <View style={styles.iconContainer}>
                                <Feather name="mail" size={24} color="#071E43" />
                            </View>
                            <Text style={styles.cardTitle}>
                                Courrier
                            </Text>
                        </View>
                        <View style={styles.detail}>
                            <Text style={styles.detailTitle}>Type de courrier</Text>
                            <Text style={styles.detailValue}>{detail.DESCRIPTION}</Text>
                        </View>
                        <View style={styles.detail}>
                            <Text style={styles.detailTitle}>Objet du courrier</Text>
                            <Text style={styles.detailValue}>{detail.NUMERO_REFERENCE}</Text>
                        </View>
                        {detail.NUMERO_CLASSEUR?<>
                            <View style={styles.detail}>
                            <Text style={styles.detailTitle}>Numéro du classeur</Text>
                            <Text style={styles.detailValue}>{detail.NUMERO_CLASSEUR}</Text>
                        </View>
                        <View style={styles.detail}>
                            <Text style={styles.detailTitle}>Lien classement</Text>
                            <Text style={styles.detailValue}>{detail.departements}</Text>
                        </View></>:null} 
                        <View style={styles.detail}>
                            <Text style={styles.detailTitle}>Code référence</Text>
                            <Text style={styles.detailValue}> #{detail.CODE_REFERENCE}</Text>
                        </View>
                    </View>
                    <View style={styles.detailCard}>
                        <View style={styles.detailCardHeader}>
                            <View style={styles.iconContainer}>
                                <FontAwesome name="building-o" size={24} color="#071E43" />
                            </View>
                            <Text style={styles.cardTitle}>
                                Expediteur
                            </Text>
                        </View>
                        <View style={styles.detail}>
                            <Text style={styles.detailTitle}>Type d'expediteur</Text>
                            <Text style={styles.detailValue}>{detail.ID_EXPEDITEUR_TYPE == 1 ? 'Personne physique' : "Personne morale"}</Text>
                        </View>
                        <View style={styles.detail}>
                            <Text style={styles.detailTitle}>Nom</Text>
                            <Text style={styles.detailValue}>{detail.SOCIETE ? detail.SOCIETE : `${detail.NOM_EXPEDI} ${detail.PRENOM_EXPEDI}`}</Text>
                        </View>
                        <View style={styles.detail}>
                            <Text style={styles.detailTitle}>Remettant</Text>
                            <Text style={styles.detailValue}>{`${detail.NOM} ${detail.PRENOM}`}</Text>
                        </View>
                    </View>

                    <View style={[styles.detailCard, { marginBottom: 10 }]}>
                        <View style={styles.detailCardHeader}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="account-group" size={24} color="#071E43" />
                            </View>
                            <Text style={styles.cardTitle}>
                                Destinataires
                            </Text>
                        </View>
                        <View style={styles.detail}>
                            <Text style={styles.detailTitle}>Nature de destination</Text>
                            <Text style={styles.detailValue}>{detail.NATURE_COURRIER == 0 ? 'Confidentiel' : 'Administratif'}</Text>
                        </View>
                        {detail.affected.length > 0 ? <View style={styles.detail}>
                            <Text style={styles.detailTitle}>Destinataires</Text>
                            {detail.affected.map((affecte, index) => {
                                return (
                                    <View key={index} style={{}}>
                                        <Text style={[styles.detailValue]} >- {affecte.NOM} {affecte.PRENOM}</Text>
                                    </View>
                                )
                            })}

                        </View> : null}
                    </View>
                </ScrollView>}

            {detail.STATUT_TRAITEMENT != 1 ? <View style={styles.courrierFooter}>
                <TouchableNativeFeedback onPress={() => {
                    traitementModalizeRef.current?.open()

                }}>
                    <View style={styles.footeractionBtn}>
                        <MaterialCommunityIcons name="list-status" size={24} color="#18678E" />
                        <Text style={styles.footeractionBtnText}>
                            Traiter
                        </Text>
                    </View>
                </TouchableNativeFeedback>
                {detail.NATURE_COURRIER == 0 ? <TouchableNativeFeedback onPress={affecter}>
                    <View style={styles.footeractionBtn}>
                        <MaterialCommunityIcons name="share" size={24} color="#18678E" />
                        <Text style={styles.footeractionBtnText}>
                            Partager
                        </Text>
                    </View>
                </TouchableNativeFeedback> : null}
            </View> : null}

            <Modalize
                ref={traitementModalizeRef}
                adjustToContentHeight
                handlePosition='inside'
                modalStyle={{
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                    paddingVertical: 20
                }}
                handleStyle={{ marginTop: 10 }}
                scrollViewProps={{
                    keyboardShouldPersistTaps: "handled"
                }}
            >
                <TraitementModalize />
            </Modalize>
        </>

    )

}
const styles = StyleSheet.create({
    availableServicesContainer: {
        flex: 1,
        backgroundColor: '#171717',
        padding: 10,
    },
    TitleDraft: {
        marginLeft: 10
    },
    inputCard: {
        // marginHorizontal:5,
        marginTop: 10,
        marginLeft: 5
    },
    titledraft: {
        marginLeft: 10
    },
    selectLabel: {
        color: '#777',
        fontSize: 13
    },
    button: {
        marginTop: 30,
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 10,
        backgroundColor: "#18678E",
        marginHorizontal: 10,
    },
    selectedValue: {
        //flexDirection:"row",
        marginLeft: 20
    },
    selectContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // marginHorizontal: 10,
        backgroundColor: "#fff",
        padding: 13,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#777",
        marginVertical: 10,
        marginLeft: 10,
        marginRight: 10
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        // textTransform:"uppercase",
        fontSize: 16,
        textAlign: "center"
    },
    modalContainer: {
        //backgroundColor:'red'
        //marginTop:500

    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        marginLeft: 10
    },
    cardDraft: {
        flexDirection: "row",
        marginLeft: 10
    },
    selectContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        //alignItems: "center",
        // marginHorizontal: 10,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#777",
        marginVertical: 8
    },
    draft: {
        flexDirection: "row",
        marginLeft: 10,
        marginTop: 10
    },
    textdraft: {
        marginLeft: 10,
        marginTop: 5
    },
    courrier: {
        width: 385,
        height: 100,
        backgroundColor: "#777",
        marginTop: -5,
        marginLeft: 10,
        borderRadius: 10,
        marginRight: 10,
        marginTop: 10
    },
    courriercard: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    selectLabel: {
        color: '#777',
        fontSize: 15,

    },
    selectContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // marginHorizontal: 10,
        backgroundColor: "#fff",
        padding: 13,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#777",
        marginVertical: 10,
        marginLeft: 10,
        marginRight: 10
    },
    draft: {
        marginLeft: 180
    },
    separator: {
        height: 2,
        width: "90%",
        backgroundColor: COLORS.handleColor,
        alignSelf: "center",
        marginTop: 5
    },
    contains: {
        width: 30,
        height: 30,
        borderRadius: 30,
        backgroundColor: "green",
        marginLeft: 15,
        alignItems: "center"
    },
    modalHeader: {
        //flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 5
    },
    headerBtn: {
        padding: 10
    },
    button: {
        marginTop: 10,
        borderRadius: 8,
        paddingVertical: 15,
        paddingHorizontal: 8,
        backgroundColor: "#18678E",
        marginHorizontal: 27,
        // marginRight: 10,
        // marginLeft: 10
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
        textAlign: "center"
    },
    statut: {
        fontWeight: "bold",
        fontSize: 15
    },
    detailCard: {
        borderRadius: 8,
        backgroundColor: '#FFF',
        elevation: 10,
        shadowColor: '#C4C4C4',
        marginTop: 10
    },
    detailCardHeader: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: '#F1F1F1',
        padding: 10
    },
    iconContainer: {
        width: 50,
        height: 50,
        backgroundColor: '#F1F1F1',
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    cardTitle: {
        fontWeight: "bold",
        marginLeft: 10,
        opacity: 0.8
    },
    iconDeatil: {
        width: 25,
        height: 25,
        borderRadius: 30,
        marginLeft: 15,
        justifyContent: "center"
    },
    text: {
        marginLeft: 10,
        fontSize: 15,
        fontWeight: "bold"
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        backgroundColor: "#fff"
    },
    availableHeader: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 20
    },
    traitement: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10
    },
    titles: {
        fontWeight: "bold",
        fontSize: 20,
        paddingHorizontal: 10,
        marginLeft: 10,
        marginBottom: 10

    },
    icon: {
        width: 25,
        height: 25,
        marginHorizontal: 5,
        borderRadius: 100,
        width: 40,
        height: 40,
        backgroundColor: "#f1f1f1",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonRightSide: {
        flexDirection: "row",
        alignItems: "center"
    },
    buttonLabels: {
        marginLeft: 10
    },
    buttonTitle: {
        fontWeight: "bold"
    },
    buttonDescription: {
        color: '#777',
        fontSize: 12
    },
    icons: {
        marginHorizontal: -15,
        marginTop: 25
    },

    availableTitle: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: "bold",
        opacity: 0.9,
        marginHorizontal: 5
    },
    item: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: "red",
        opacity: 0.9
    },
    detail: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F1F1'
    },
    detailTitle: {
        fontWeight: "bold",
        color: '#333',
        opacity: 0.9,

    },
    detailValue: {
        marginTop: 2,
        color: '#555',
        fontSize: 12,

    },
    typeCourrier: {
        color: COLORS.primary
    },
    TitleDetail: {
        fontSize: 20,
        fontWeight: "bold",
    },
    itemligne: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        marginHorizontal: 10,
        marginLeft: 10
    },
    header: {
        // marginHorizontal: 15,
        // borderRadius: 15,
        // backgroundColor: "white",
        // maxWidth: 400,
        // height: 65,
        // marginBottom: 5,
        // marginTop: 10
        marginLeft: 10
    },
    evService: {
        height: 100,
        borderRadius: 15,
        backgroundColor: '#2e2d2d',
        flexDirection: 'row',
        alignItems: "center",
        marginTop: 10,
    },
    evServiceImageContainer: {
        height: '100%',
        width: '30%'
    },


    evServiceImage: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15
    },
    evServiceName: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: "bold",
        paddingHorizontal: 10,
        marginLeft: 15
    },
    cardDescription: {
        marginLeft: 2,
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
        marginRight: 2
        //marginHorizontal: 7
    },
    cardEntete: {
        flexDirection: "row",
        marginHorizontal: 5,
        marginTop: 10
    },
    title: {
        flexDirection: "row"
    },
    contenu: {
        color: '#fff',
    },
    contain: {
        backgroundColor: '#f2f6f7',
    },
    courrierActions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    courrierCode: {
        fontWeight: 'bold',
        fontSize: 15,
        color: "#18678E"
    },
    courrierFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f1f1f1'
    },
    footeractionBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        flex: 1
    },
    footeractionBtnText: {
        fontWeight: 'bold',
        color: '#18678E'
    },

})