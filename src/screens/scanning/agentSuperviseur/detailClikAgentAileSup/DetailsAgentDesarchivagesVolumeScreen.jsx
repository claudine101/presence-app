import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useRef } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, Image, TouchableWithoutFeedback, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons, EvilIcons, Fontisto, Feather } from '@expo/vector-icons';
import { COLORS } from "../../../../styles/COLORS"
import moment from 'moment'
import { Modalize } from 'react-native-modalize'
import { Portal } from "react-native-portalize";
import { useState } from "react";
import Loading from "../../../../components/app/Loading";
import fetchApi from "../../../../helpers/fetchApi";

/**
 * Screen pour afficher le details de volumes lors de retours chez un agent desarchivages
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 27/8/2023
 * @returns 
 */


export default function DetailsAgentDesarchivagesVolumeScreen() {
        const navigation = useNavigation()
        const route = useRoute()
        const { details, userTraite } = route.params
        const modelRef = useRef(null)
        const [allDetails, setAllDetails] = useState(null)
        const [valide, setValide] = useState(null)
        const [loadingData, setLoadingData] = useState(false)

        const openArchivesModalModalize = (detail) => {
                setAllDetails(detail)
                modelRef.current?.open();
        };

        const isValidAdd = () => {
                var isValid = false
                isValid = valide != null ? true : false
                return isValid
        }

        const submitDesarchivesData = async () => {
                modelRef.current?.close();
                try {
                        setLoadingData(true)
                        const form = new FormData()
                        form.append('ARCHIVER', valide)
                        form.append('MAILLE',allDetails.volume.ID_MALLE)
                        const volume = await fetchApi(`/scanning/retour/agent/desarchivages/archivevol/${allDetails.volume.ID_VOLUME}`, {
                                method: "PUT",
                                body: form
                        })
                        navigation.navigate("AllVolumeFolioRetourSupAilleScreen")
                }
                catch (error) {
                        console.log(error)
                } finally {
                        setLoadingData(false)
                }
        }


        const ArchiveModal = (allDetails) => {
                return (
                        <>
                                {loadingData && <Loading />}
                                <View style={styles.modalContent}>
                                        <View style={styles.cardTitlePrincipal}>
                                                <Text style={styles.titlePrincipal}>Voulez-vous archiver ce volume?</Text>
                                        </View>
                                        <View style={styles.separator} />
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                                <TouchableWithoutFeedback onPress={() => setValide(1)}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15 }} >
                                                                <Text style={{ color: "#000" }}>Qui</Text>
                                                                {valide == 1 ? <MaterialCommunityIcons name="radiobox-marked" size={20} color="#007bff" style={{ marginLeft: 5 }} /> :
                                                                        <MaterialCommunityIcons name="radiobox-blank" size={20} color="#777" style={{ marginLeft: 5 }} />}
                                                        </View>
                                                </TouchableWithoutFeedback>
                                                {/* <TouchableWithoutFeedback onPress={() => setValide(0)}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15 }}>
                                                                <Text style={{ color: "#000" }}>Non</Text>
                                                                {valide == 0 ? <MaterialCommunityIcons name="radiobox-marked" size={20} color="#007bff" style={{ marginLeft: 5 }} /> :
                                                                        <MaterialCommunityIcons name="radiobox-blank" size={20} color="#777" style={{ marginLeft: 5 }} />}
                                                        </View>
                                                </TouchableWithoutFeedback> */}
                                        </View>
                                        <View style={styles.separator} />
                                        <TouchableWithoutFeedback
                                                disabled={!isValidAdd()}
                                                onPress={submitDesarchivesData}
                                        >
                                                <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                                                        <Text style={styles.buttonText}>Enregistrer</Text>
                                                </View>
                                        </TouchableWithoutFeedback>
                                </View>
                        </>
                )
        }

        return (
                <>
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
                                                <Text style={styles.title} numberOfLines={2}>{userTraite.NOM} {userTraite.PRENOM}</Text>
                                        </View>
                                </View>
                                <ScrollView>
                                        {details.map((detail, index) => {
                                                return (
                                                        <TouchableOpacity style={styles.cardDetails} key={index}
                                                                onPress={() => openArchivesModalModalize(detail)}
                                                        >
                                                                <View style={styles.cardImages}>
                                                                        <Image source={require('../../../../../assets/images/dossierDetail.png')} style={styles.imageIcon} />
                                                                </View>
                                                                <View style={styles.cardAllDetails}>
                                                                        <View>
                                                                                <Text style={styles.titlePrincipal}>{detail?.volume?.NUMERO_VOLUME}</Text>
                                                                                <View style={styles.cardDescDetails}>
                                                                                        <Fontisto name="date" size={20} color="#777" />
                                                                                        <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{moment(detail?.DATE_INSERTION).format('DD-MM-YYYY, HH:mm')}</Text></View>
                                                                                </View>
                                                                        </View>
                                                                        <View>
                                                                                <View ><Text></Text></View>
                                                                                <View style={styles.cardDescDetails}>
                                                                                        <AntDesign name="filetext1" size={20} color="#777" />
                                                                                        <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{detail?.volume?.NOMBRE_DOSSIER} dossiers</Text></View>

                                                                                </View>
                                                                        </View>
                                                                </View>
                                                        </TouchableOpacity>
                                                )
                                        })}
                                </ScrollView>
                        </View>
                        <Modalize ref={modelRef}
                                handlePosition="inside"
                                adjustToContentHeight
                                modalStyle={{ backgroundColor: '#fff', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}
                                scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
                        >
                                <ArchiveModal allDetails={allDetails} />
                        </Modalize>
                </>
        )
}

const styles = StyleSheet.create({
        container: {
                flex: 1,
                backgroundColor: '#ddd'
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
                color: '#777'
        },
        cardTitle: {
                maxWidth: "85%"
        },
        cardDetails: {
                borderRadius: 10,
                elevation: 5,
                shadowColor: '#c4c4c4',
                marginTop: 10,
                backgroundColor: '#fff',
                padding: 10,
                overflow: 'hidden',
                marginHorizontal: 10,
                flexDirection: "row"
        },
        cardImages: {
                backgroundColor: '#ddd',
                width: 50,
                height: 50,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center'
        },
        imageIcon: {
                width: 25,
                height: 25
        },
        titeName: {
                color: "#777"
        },
        cardDescDetails: {
                flexDirection: "row",
                marginTop: 8
        },
        cardAllDetails: {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                flex: 1,
                marginLeft: 8
        },
        titlePrincipal: {
                fontWeight: "bold"
        },
        separator: {
                height: 1,
                width: "100%",
                backgroundColor: '#F1F1F1'
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
        cardTitlePrincipal: {
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 10
        }
})