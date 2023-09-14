import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, Image, TouchableOpacity } from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons, FontAwesome5, Fontisto, Feather } from '@expo/vector-icons';
import { COLORS } from "../../../../styles/COLORS"
import moment from 'moment'

/**
 * Screen pour afficher le details de volumes lors de retours chez un agent agent distributeur
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 27/8/2023
 * @returns 
 */


export default function DetailsClickAgentDistributeurVolumeScreen() {
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
                                        <Text style={styles.title} numberOfLines={2}>{userTraite.NOM} {userTraite.PRENOM}</Text>
                                </View>
                        </View>

                        {details.map((detail, index) => {
                                return (
                                        <TouchableOpacity style={styles.cardDetails} key={index}
                                                onPress={()=>navigation.navigate("ConfirmerPvRetourAgentSupArchives", {detail:detail, id:detail.volume.ID_VOLUME})}
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

                </View>
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
})