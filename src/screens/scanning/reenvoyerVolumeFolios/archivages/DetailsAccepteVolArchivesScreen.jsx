import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useRef } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, Image, TouchableWithoutFeedback, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons, EvilIcons, Fontisto, MaterialIcons } from '@expo/vector-icons';
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


export default function DetailsAccepteVolArchivesScreen() {
        const navigation = useNavigation()
        const route = useRoute()
        const { details, userTraite } = route.params
        const modelRef = useRef(null)
        const [valide, setValide] = useState(null)
        const [loadingData, setLoadingData] = useState(false)
        const [multiFolios, setMultiFolios] = useState([]);

        const isValidAdd = () => {
                var isValid = false
                isValid = multiFolios.length > 0 ? true : false
                return isValid
        }

        const isSelected = id_folio => multiFolios.find(u => u.folio.ID_FOLIO == id_folio) ? true : false
        const setSelectedFolio = (fol) => {
                if (isSelected(fol.folio.ID_FOLIO)) {
                        const newfolio = multiFolios.filter(u => u.folio.ID_FOLIO != fol.folio.ID_FOLIO)
                        setMultiFolios(newfolio)
                } else {
                        setMultiFolios(u => [...u, fol])
                }

        }

        const submitEquipeData = async () => {
                try {
                        setLoadingData(true)
                        const form = new FormData()
                        form.append('folio', JSON.stringify(multiFolios))
                        const vol = await fetchApi(`/scanning/retour/agent/reenvoyez/supailleScanning/desarchivages/nice`, {
                                method: "PUT",
                                body: form
                        })
                        navigation.navigate('AllVolumeReenvoyezRetournerScreen')
                }
                catch (error) {
                        console.log(error)
                } finally {
                        setLoadingData(false)
                }
        }

        return (
                <>
                          {loadingData && <Loading />}
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
                                                <Text style={styles.title} numberOfLines={2}>Archives les dossiers</Text>
                                        </View>
                                </View>
                                <ScrollView>
                                        {details.map((fol, index) => {
                                                return (
                                                        <TouchableNativeFeedback onPress={() => setSelectedFolio(fol)} key={index}>
                                                                <View style={styles.listItem} >
                                                                        <View style={styles.listItemDesc}>
                                                                                <View style={styles.listItemImageContainer}>
                                                                                        {/* <Image source={require('../../../../assets/images/user.png')} style={styles.listItemImage} /> */}
                                                                                        <AntDesign name="folderopen" size={20} color="black" />
                                                                                </View>
                                                                                <View style={styles.listNames}>
                                                                                        <Text style={styles.itemTitle}>{fol.folio.NUMERO_FOLIO}</Text>
                                                                                </View>
                                                                        </View>
                                                                        {isSelected(fol.folio.ID_FOLIO) ? <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} /> :
                                                                                <MaterialIcons name="check-box-outline-blank" size={24} color="black" />}

                                                                </View>
                                                        </TouchableNativeFeedback>
                                                )
                                        })}
                                </ScrollView>
                                <TouchableWithoutFeedback
                                        disabled={!isValidAdd()}
                                        onPress={submitEquipeData}
                                >
                                        <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                                                <Text style={styles.buttonText}>Enregistrer</Text>
                                        </View>
                                </TouchableWithoutFeedback>
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
                color: "#777",
                fontSize: 12
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
                marginHorizontal: 10,
                marginBottom:5
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
        },
        listItem: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#F1F1F1'
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
                width: '80%',
                height: '80%',
                borderRadius: 10
        },
        listItemDesc: {
                flexDirection: 'row',
                alignItems: 'center'
        },
        title: {
                paddingHorizontal: 5,
                fontSize: 17,
                fontWeight: 'bold',
                color: '#777'
        },
        listNames:{
                marginLeft:10
        }

})