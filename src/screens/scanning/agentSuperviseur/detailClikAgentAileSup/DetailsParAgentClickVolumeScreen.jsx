import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, Image, TouchableOpacity, FlatList } from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons, FontAwesome5, Fontisto, Feather } from '@expo/vector-icons';
import { COLORS } from "../../../../styles/COLORS"
import moment from 'moment'

/**
 * Screen pour afficher le details de volumes lors de retours chez un agent sup aile scanning
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 23/8/2023
 * @returns 
 */


export default function DetailsParAgentClickVolumeScreen() {
        const navigation = useNavigation()
        const route = useRoute()
        const { details, userTraite } = route.params
        return (
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
                                        <Text style={styles.title}>{userTraite.NOM} {userTraite.PRENOM}</Text>
                                </View>
                        </View>
                        <FlatList
                                style={styles.contain}
                                data={details}
                                renderItem={({ item: detail, index }) => {
                                        return (
                                                <>
                                                        {
                                                                <TouchableNativeFeedback style={styles.cardDetails} key={index}
                                                                        onPress={() => navigation.navigate("ConfimerPvScreen", { detail: detail, userTraite: userTraite })}
                                                                >
                                                                        <View style={{ marginTop: 10, marginHorizontal: 5, overflow: 'hidden', borderRadius: 8 }}>

                                                                                <View style={styles.folio}>
                                                                                        <View style={styles.folioLeftSide}>
                                                                                                <View style={styles.folioImageContainer}>
                                                                                                        <Image source={require("../../../../../assets/images/dossierDetail.png")} style={styles.folioImage} />
                                                                                                </View>
                                                                                                <View style={styles.folioDesc}>
                                                                                                        <Text style={styles.folioName}>{detail?.volume?.NUMERO_VOLUME}</Text>
                                                                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                                                                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                                                        <AntDesign name="calendar" size={20} color="#777" />
                                                                                                                        <Text style={[styles.folioSubname, { marginLeft: 3 }]}>
                                                                                                                                {moment(detail?.DATE_INSERTION).format('DD/MM/YYYY HH:mm')}
                                                                                                                        </Text>
                                                                                                                </View>
                                                                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                                                        <Ionicons name="ios-document-text-outline" size={20} color="#777" />
                                                                                                                        <Text style={[styles.folioSubname, { marginLeft: 3 }]}>
                                                                                                                                {detail?.volume?.NOMBRE_DOSSIER ? detail?.volume?.NOMBRE_DOSSIER: "0"} dossier{detail?.volume?.NOMBRE_DOSSIER > 1 && 's'}
                                                                                                                        </Text>
                                                                                                                </View>
                                                                                                        </View>
                                                                                                </View>
                                                                                        </View>
                                                                                </View>
                                                                        </View>
                                                                </TouchableNativeFeedback>
                                                        }
                                                </>
                                        )
                                }}
                                keyExtractor={(volume, index) => index.toString()}
                        />

                </View>
        )
}
const styles = StyleSheet.create({
        container: {
                flex: 1,
        },
        actionIcon: {
                width: 45,
                height: 45,
                backgroundColor: COLORS.primary,
                borderRadius: 50,
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center'
        },
        actionLabel: {
                backgroundColor: '#fff',
                borderRadius: 5,
                padding: 5,
                marginRight: 10,
                fontWeight: 'bold',
        },
        action: {
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center'
        },
        emptyContaier: {
                // flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
        },
        emptyImage: {
                width: 100,
                height: 100,
                resizeMode: 'contain'
        },
        emptyTitle: {
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#333',
                marginVertical: 10,
                fontSize: 15
        },
        emptyDesc: {
                color: '#777',
                textAlign: 'center',
                maxWidth: 300,
                lineHeight: 20
        },
        cardDetails: {
                borderRadius: 10,
                elevation: 5,
                shadowColor: '#c4c4c4',
                marginTop: 10,
                backgroundColor: '#FFF',
                padding: 10,
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

        folio: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#fff',
                padding: 10,
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
                flex: 1
        },
        folioName: {
                fontWeight: 'bold',
                color: '#333',
        },
        folioSubname: {
                color: '#777',
                fontSize: 12
        },
        amountChanger: {
                width: 50,
                height: 50,
                backgroundColor: COLORS.primary,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 1,
                position: "absolute",
                left: "80%",
                bottom: 0,
                marginBottom: 10

        },
        amountChangerText: {
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 20
        },
        emptyContainer: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
        },
        emptyImage: {
                width: 100,
                height: 100,
                opacity: 0.8
        },
        emptyLabel: {
                fontWeight: 'bold',
                marginTop: 20,
                color: '#777',
                fontSize: 16
        },
        header: {
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 5
        },
        headerBtn: {
                padding: 10
        },

        cardTitle: {
                maxWidth: "85%"
        },
        title: {
                paddingHorizontal: 5,
                fontSize: 16,
                fontWeight: 'bold',
                color: '#777',
        },
})