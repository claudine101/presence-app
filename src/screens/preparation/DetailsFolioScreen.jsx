import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, ActivityIndicator, FlatList, TouchableWithoutFeedback, TouchableOpacity, Image } from "react-native";
import { COLORS } from "../../styles/COLORS";
import { useNavigation, useRoute } from "@react-navigation/native";
import fetchApi from "../../helpers/fetchApi";
import { Ionicons, FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import * as DocumentPicker from 'expo-document-picker';
import Loading from "../../components/app/Loading";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import IDS_ETAPES_FOLIO from "../../constants/ETAPES_FOLIO";


/**
 * Screen pour afficher le details de folio avec leur nature  
 * @author claudine NDAYISABA <claudine@mediabox.bi>
 * @date 02/8/2023
 * @returns 
 */

export default function DetailsFolioScreen() {
        const navigation = useNavigation()
        const route = useRoute()
        const { folio,folioRetour } = route.params
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
                                                <Text style={styles.title} numberOfLines={2}>{folio.users.NOM} {folio.users.PRENOM}</Text>
                                        </View>
                                </View>
                                {folio.folios.length > 0 ?
                                        <View style={styles.folioList}>
                                                <FlatList
                                                        style={styles.contain}
                                                        data={folio.folios}
                                                        renderItem={({ item: folio, index }) => {
                                                                return (
                                                                        <>
                                                                                {
                                                                                        <View style={{ marginTop: 10, borderRadius: 80, }}>
                                                                                                <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}
                                                                                                        onPress={() => navigation.navigate("AddDetailsFolioScreen", { folio: folio.folio, ID_MAILLE: folio?.mailleNoTraite?.ID_MAILLE,folioRetour:folioRetour })}
                                                                                                >
                                                                                                        <View style={[styles.folio]}>
                                                                                                                <View style={styles.folioLeftSide}>
                                                                                                                        <View style={styles.folioLeft}>
                                                                                                                                <View style={styles.folioImageContainer}>
                                                                                                                                        <Image source={require("../../../assets/images/folio.png")} style={styles.folioImage} />
                                                                                                                                </View>
                                                                                                                                <View style={styles.folioDesc}>
                                                                                                                                        <Text style={styles.folioName}>{folio.folio.NUMERO_FOLIO}</Text>
                                                                                                                                        <View style={styles.folioNature}>
                                                                                                                                                <Text style={styles.folioSubname}>Folio:{folio.folio.NUMERO_FOLIO}</Text>
                                                                                                                                                <Text style={styles.folioSubname}>Nature:{folio.folio.natures.DESCRIPTION}</Text>
                                                                                                                                                <Text style={styles.folioSubname}></Text>
                                                                                                                                        </View>
                                                                                                                                </View>
                                                                                                                        </View>

                                                                                                                </View>
                                                                                                        </View>
                                                                                                </TouchableNativeFeedback>
                                                                                        </View>
                                                                                }
                                                                        </>
                                                                )
                                                        }}
                                                        keyExtractor={(folio, index) => index.toString()}
                                                />
                                        </View>
                                        : null}


                        </View>
                </>

        )
}
const styles = StyleSheet.create({
        container: {
                flex: 1,
                backgroundColor: '#fff'
        },
        cardDetails: {
                backgroundColor: '#fff',
                borderRadius: 10,
                elevation: 5,
                shadowColor: '#c4c4c4',
                marginTop: 10,
                backgroundColor: '#fff',
                padding: 15,
                overflow: 'hidden',
                marginHorizontal: 10
        },
        carddetailItem: {
                flexDirection: 'row',
                alignItems: 'center',
        },
        cardImages: {
                backgroundColor: '#DCE4F7',
                width: 50,
                height: 50,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center'
        },
        cardDescription: {
                marginLeft: 10,
                flex: 1
        },
        itemVolume: {
                fontSize: 15,
                fontWeight: "bold",
        },
        cardHeader: {
                flexDirection: 'row',
                // marginTop: StatusBar.currentHeight,
                alignContent: "center",
                alignItems: "center",
                marginBottom: 15,
                marginHorizontal: 10,
                marginVertical: 10
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
                fontSize: 18,
                fontWeight: "bold",
                marginLeft: 10,
                color: COLORS.primary
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
        selectContainer: {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fff",
                padding: 13,
                borderRadius: 5,
                borderWidth: 0.5,
                borderColor: "#777",
                marginVertical: 10,
                marginHorizontal: 10
        },
        selectedValue: {
                color: '#777'
        },
        addImageItem: {
                borderWidth: 0.5,
                borderColor: "#000",
                borderRadius: 5,
                paddingHorizontal: 10,
                paddingVertical: 15,
                marginBottom: 5,
                marginHorizontal: 10
        },
        addImageLabel: {
                marginLeft: 5,
                opacity: 0.8
        },
        headerRead: {
                borderRadius: 8,
                backgroundColor: "#f1f1f1",
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 5,
                paddingHorizontal: 10,
                marginBottom: 10,
                marginHorizontal: 10
        },
        folio: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f1f1f1',
                padding: 10,
                borderRadius: 10,
                marginHorizontal: 10
        },
        folioLeftSide: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flex: 1

        },
        folioLeft: {
                flexDirection: 'row',
                alignItems: 'center',

        },
        folioNature: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent:"space-between"

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
                flex:1
        },
        folioName: {
                fontWeight: 'bold',
                color: '#333',
        },
        folioSubname: {
                color: '#777',
                fontSize: 12
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
                // color: COLORS.primary
        },
        cardTitle: {
                maxWidth: "85%"
        },
})