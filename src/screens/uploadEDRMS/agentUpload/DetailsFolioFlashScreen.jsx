import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import { Image, Text, ToastAndroid, TouchableNativeFeedback, TouchableOpacity, View } from "react-native"
import { StyleSheet } from "react-native"
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from "react-native";
import { useCallback, useRef, useState } from "react";
import fetchApi from "../../../helpers/fetchApi";
import { COLORS } from "../../../styles/COLORS";
import { Modalize } from "react-native-modalize";
import Loading from "../../../components/app/Loading";

export default function DetailsFolioFlashScreen() {
    const route = useRoute()
    const { folio } = route.params
    const navigation = useNavigation()
    const natureModalRef = useRef()
    const [selectedType, setSelectedType] = useState([])
    const [loading, setLoading] = useState(true)
    const [typeDocument, setTypeDocument] = useState([])
    const [document, setDocument] = useState([])
    const [upload, setUpload] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const isSelectedType = type => selectedType.find(f => f.ID_TYPE_FOLIO_DOCUMENT == type.ID_TYPE_FOLIO_DOCUMENT) ? true : false

    const handleFolioPressType = (type) => {
        if (isSelectedType(type)) {
            const removed = selectedType.filter(f => f.ID_TYPE_FOLIO_DOCUMENT != type.ID_TYPE_FOLIO_DOCUMENT)
            setSelectedType(removed)

        } else {
            setSelectedType(items => [...items, type])
        }
    }
    useFocusEffect(useCallback(() => {
        (async () => {
            try {

                const res = await fetchApi(`/uploadEDMRS/folio/document/${folio?.ID_FOLIO}`)
                setDocument(res.result)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        })()
    }, []))
    useFocusEffect(useCallback(() => {
        (async () => {
            try {

                const res = await fetchApi(`/uploadEDMRS/folio/typeDocument/${folio?.ID_NATURE}`)
                setTypeDocument(res.result)
                console.log(folio?.ID_NATURE)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        })()
    }, []))
    /**
     * Permet d'envoyer le chef agent d'indexation
     * @author darcydev <darcy@mediabox.bi>
     * @date 03/08/2023
     * @returns 
     */
    const handleSubmit = async () => {
        try {
            setIsSubmitting(true)
            const form = new FormData()
            form.append("ID_FOLIO",folio?.ID_FOLIO)
            form.append("TYPE_DOCUMENT", JSON.stringify(selectedType))
            const res = await fetchApi(`/uploadEDMRS/folio/isUpload`, {
                method: 'POST',
                body: form
            })
            ToastAndroid.show("Opération effectuée avec succès", ToastAndroid.SHORT);
            navigation.navigate("AgentFlashScreen")
        } catch (error) {
            console.log(error)
            ToastAndroid.show("Opération non effectuée, réessayer encore", ToastAndroid.SHORT);
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            {isSubmitting && <Loading />}

            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableNativeFeedback
                        onPress={() => navigation.goBack()}
                        background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                        <View style={styles.headerBtn}>
                            <Ionicons name="chevron-back-outline" size={24} color="black" />
                        </View>
                    </TouchableNativeFeedback>
                    <Text style={styles.title}>{folio ?folio?.NUMERO_FOLIO : null}</Text>
                </View>
                <ScrollView>
                    <View style={styles.selectContainer}>
                        <View style={{  overflow: 'hidden', borderRadius: 8 }}>
                            <View style={[styles.folio,]}>
                                <View style={styles.folioLeftSide}>
                                    <View style={styles.folioDesc}>
                                        <Text style={styles.folioName}>Numéro de feuille</Text>
                                        <Text style={styles.folioSubname}>{folio?.NUMERO_FEUILLE} {folio?.PRENOM_PROPRIETAIRE}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ overflow: 'hidden', borderRadius: 8 }}>
                            <View style={[styles.folio,]}>
                                <View style={styles.folioLeftSide}>

                                    <View style={styles.folioDesc}>
                                        <Text style={styles.folioName}>Propriétaire</Text>
                                        <Text style={styles.folioSubname}>{folio?.NOM_PROPRIETAIRE} {folio?.PRENOM_PROPRIETAIRE}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ overflow: 'hidden', borderRadius: 8 }}>
                            <View style={[styles.folio,]}>
                                <View style={styles.folioLeftSide}>

                                    <View style={styles.folioDesc}>
                                        <Text style={styles.folioName}>Numéro parcelle</Text>
                                        <Text style={styles.folioSubname}>{folio?.NUMERO_PARCELLE} {folio?.PRENOM_PROPRIETAIRE}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ overflow: 'hidden', borderRadius: 8 }}>
                            <View style={[styles.folio,]}>
                                <View style={styles.folioLeftSide}>

                                    <View style={styles.folioDesc}>
                                        <Text style={styles.folioName}>Localité</Text>
                                        <Text style={styles.folioSubname}>{folio?.LOCALITE} {folio?.PRENOM_PROPRIETAIRE}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {folio.ID_ETAPE_FOLIO == 16 ?

                        <TouchableNativeFeedback onPress={() => setUpload(u => !u)}>
                            <View style={styles.selectContainer}>
                            <View style={styles.folioUpload}>
                                <Text style={styles.folioName}>Is uploaded EDRMS</Text>
                                {upload ?
                                    <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                    <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                            </View>
                            </View>


                        </TouchableNativeFeedback> : null


                    }
                    {upload ? <View style={styles.selectContainer}>
                        {typeDocument?.map((type, index) => {
                            return (
                                <TouchableNativeFeedback key={index} onPress={() => handleFolioPressType(type)}>
                                    <View style={styles.listItem}>
                                        <View style={styles.listItemDesc}>
                                            <View style={styles.listItemImageContainer}>
                                                <Image source={require('../../../../assets/images/dossier.png')} style={styles.listItemImage} />
                                            </View>
                                            <View style={styles.listNames}>
                                                <Text style={styles.listItemTitle}>{type.NOM_DOCUMENT}</Text>
                                                {/* <Text style={styles.listItemSubTitle}>{type.NOM_DOCUMENT}</Text> */}
                                            </View>
                                        </View>
                                        {isSelectedType(type) ? <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} /> :
                                            <MaterialIcons style={styles.checkIndicator} name="check-box-outline-blank" size={24} color="#ddd" />}
                                    </View>
                                </TouchableNativeFeedback>
                            )
                        })}
                    </View> : null

                    }
                    {document.length > 0 && folio.ID_ETAPE_FOLIO != 16 ? 
                    <View style={styles.selectContainer}>
                                            <Text style={styles.listItemTitle}>Documents</Text>
                    {document?.map((type, index) => {
                        return (
                                <View style={styles.listItem} key={index}>
                                    <View style={styles.listItemDesc}>
                                        <View style={styles.listItemImageContainer}>
                                            <Image source={require('../../../../assets/images/dossier.png')} style={styles.listItemImage} />
                                        </View>
                                        <View style={styles.listNames}>
                                            <Text style={styles.listItemTitle}>{type.types.NOM_DOCUMENT}</Text>
                                            {/* <Text style={styles.listItemSubTitle}>{document.length }</Text> */}
                                        </View>
                                    </View>
                                    { <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} /> }
                                </View>
                        )
                    })}
                </View> :null }
                </ScrollView>
                {folio.ID_ETAPE_FOLIO == 16 ?
                    <View style={styles.actions}>
                        <TouchableOpacity style={[styles.actionBtn, { opacity: !selectedType.length > 0 ? 0.5 : 1 }]} disabled={!selectedType.length > 0} onPress={() => handleSubmit()}>
                            <Text style={styles.actionText}>Enregistrer</Text>
                        </TouchableOpacity>
                    </View> : null
                }
            </View>
            <Modalize
                ref={natureModalRef}
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
                onClosed={() => {
                    setSelectedType([])
                }}
            >
                {loading ? null :
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Type des documents</Text>
                        </View>
                        <View style={styles.actions}>
                            <TouchableOpacity style={[styles.actionBtn, { opacity: !selectedType.length > 0 ? 0.5 : 1 }]} disabled={!selectedType.length > 0} onPress={() => handleSubmit()}>
                                <Text style={styles.actionText}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>}
            </Modalize>
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
    },
    detailsHeader: {
        paddingHorizontal: 10
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    selectLabel: {
        marginLeft: 5
    },
    flash: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    flashName: {
        marginLeft: 5
    },
    folio: {
        padding: 5,
    },
    folioLeftSide: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    folioImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 40,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
    },
    folioImage: {
        width: '60%',
        height: '60%'
    },
    folioDesc: {
        marginLeft: 10,
    },
    folioUpload: {
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    folioName: {
        fontWeight: 'bold',
        color: '#333',
    },
    folioSubname: {
        color: '#777',
        fontSize: 12
    },
    folioList: {
        // paddingHorizontal: 10
    },
    actions: {
        padding: 10
    },
    actionBtn: {
        paddingVertical: 15,
        borderRadius: 8,
        backgroundColor: COLORS.primary
    },
    actionText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#fff'
    },
    selectContainer: {
        backgroundColor: "#fff",
        padding: 13,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#ddd",
        marginHorizontal: 10,
        marginVertical:10
    },
    selectedValue: {
        color: '#777',
        marginTop: 2
    },
    content: {
        paddingHorizontal: 10
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
        width: 35,
        height: 35,
        borderRadius: 10,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
    },
    listItemImage: {
        width: '30%',
        height: '30%',
    },
    listItemDesc: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    listNames: {
        marginLeft: 10,
        fontSize: 17,
    },
    listItemTitle: {
        fontWeight: 'bold'
    },
    listItemSubTitle: {
        color: '#777',
        fontSize: 12,
    },
})