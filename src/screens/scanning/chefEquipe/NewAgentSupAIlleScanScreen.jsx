import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, Image } from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons, FontAwesome5, Fontisto, Feather } from '@expo/vector-icons';
import { COLORS } from "../../../styles/COLORS";
import { useRef } from "react";
import { useState } from "react";
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import useFetch from "../../../hooks/useFetch";

/**
 * Le screen pour de donner les volumes a un agent superviseur aile scanning
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 1/8/2021
 * @returns 
 */

export default function NewAgentSupAIlleScanScreen() {
        const navigation = useNavigation()

        // Aile superviseur select
        const superviseurModalizeRef = useRef(null);
        const [ailleSuperviseur, setAilleSuperviseur] = useState(null);
        const openDistributeurModalize = () => {
                superviseurModalizeRef.current?.open();
        };
        const setSelectedDistibuteur = (sup) => {
                superviseurModalizeRef.current?.close();
                setDistributeur(sup)
        }

        //Composent pour afficher la listes des agents aille superviseur 
        const AilleSuperviseurList = () => {
                // const [loadingVolume, volumesAll] = useFetch('/volume/dossiers/VolumesInMaille')
                return (
                        <>
                                <View style={styles.modalContainer}>
                                        <View style={styles.modalHeader}>
                                                <Text style={styles.modalTitle}>Les agents aille superviseur</Text>
                                        </View>
                                        {/* {volumesAll.result?.length == 0 ? <View style={styles.modalHeader}><Text>Aucun volumes trouves</Text></View> : null} */}

                                        <ScrollView>
                                                <TouchableNativeFeedback>
                                                        <View style={styles.modalItem} >
                                                                <View style={styles.modalImageContainer}>
                                                                        <AntDesign name="folderopen" size={20} color="black" />
                                                                </View>
                                                                <View style={styles.modalItemCard}>
                                                                        <View>
                                                                                <Text style={styles.itemTitle}>enfje</Text>
                                                                                <Text style={styles.itemTitleDesc}>djdj</Text>
                                                                        </View>
                                                                        <Fontisto name="checkbox-active" size={21} color="#007bff" />
                                                                        {/* <Fontisto name="checkbox-passive" size={21} color="black" /> */}
                                                                </View>
                                                        </View>
                                                </TouchableNativeFeedback>
                                        </ScrollView>
                                </View>
                        </>
                )
        }

        return (
                <>
                        <View style={styles.container}>
                                <View style={styles.cardHeader}>
                                        <TouchableNativeFeedback
                                                onPress={() => navigation.goBack()}
                                                background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                                                <View style={styles.backBtn}>
                                                        <Ionicons name="arrow-back-sharp" size={24} color="#fff" />
                                                </View>
                                        </TouchableNativeFeedback>
                                        <View style={styles.cardTitle}>
                                                <Text numberOfLines={2} style={styles.titlePrincipal}>selection d'un agent superviseur aile scanning</Text>
                                        </View>
                                </View>
                                <ScrollView>
                                        <View>
                                                <View style={styles.selectContainer}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Volume
                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {/* {volumes ? `${volumes.NUMERO_VOLUME}` : 'Aucun'} */}
                                                                                ddhdh
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </View>
                                        </View>
                                        <View>
                                                <View style={styles.selectContainer}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Malle
                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                                ddhdh
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </View>
                                        </View>
                                        <TouchableOpacity style={styles.selectContainer} onPress={openDistributeurModalize}>
                                                <View>
                                                        <Text style={styles.selectLabel}>
                                                                Selectioner le distributeur
                                                        </Text>
                                                        <View>
                                                                <Text style={styles.selectedValue}>
                                                                        {/* {distributeur ? `${distributeur.NOM}` + `${distributeur.PRENOM}` : 'Aucun'} */}
                                                                        djdjj
                                                                </Text>
                                                        </View>
                                                </View>
                                        </TouchableOpacity>
                                </ScrollView>
                        </View>
                        <Portal>
                                <Modalize ref={superviseurModalizeRef}  >
                                        <AilleSuperviseurList />
                                </Modalize>
                        </Portal>
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
        cardTitle: {
                maxWidth: "85%"
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
        modalItemCard: {
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 1
        },
        itemTitle: {
                marginLeft: 10
        },
        itemTitleDesc: {
                color: "#777",
                marginLeft: 10,
                fontSize: 11
        },
        modalTitle: {
                fontWeight: "bold",
                textAlign: "center",
                marginTop: 10,
                fontSize: 16
        },
})