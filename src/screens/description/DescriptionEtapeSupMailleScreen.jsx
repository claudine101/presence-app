import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useRef } from "react";
import { StyleSheet, Text, View, TouchableWithoutFeedback, TouchableNativeFeedback, Image } from "react-native"
import { COLORS } from '../../styles/COLORS';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useSelector } from "react-redux";
import { userSelector } from "../../store/selectors/userSelector";

/**
 * Screen de description de la tache qur tu veux faire
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 19/7/2023
 * @returns 
 */

export default function DescriptionEtapeSupMailleScreen() {
        const navigation = useNavigation()
        const user = useSelector(userSelector)
        const onHandleClick = () => {
                if(user.ID_PROFIL == 3){
                        navigation.navigate("AgentSuperviseurMalleScreen")
                }else if(user.ID_PROFIL == 8){
                        navigation.navigate("AgentSuperviseurFinScreen")
                }
        }
        return (
                <View style={styles.container}>
                        <View style={styles.cardHeader}>
                                <TouchableNativeFeedback
                                        onPress={() => navigation.goBack()}
                                        background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                                        <View style={styles.backBtn}>
                                                <Ionicons name="arrow-back-sharp" size={24} color="#fff" />
                                        </View>
                                </TouchableNativeFeedback>
                        </View>
                        <View style={styles.footer}>
                                <Image source={require("../../../assets/images/iconDescr.png")} style={styles.image} />
                                <Text style={styles.title}>
                                        Bonjour soyez les bienvenus
                                </Text>
                                {user.ID_PROFIL == 3 ? <Text style={styles.description}>
                                        Il semble que vous voulez mettre le volume dans une malle, choisissez le batiments, aille et agent distributeur
                                </Text>:null}
                                {user.ID_PROFIL == 8 ? <Text style={styles.description}>
                                        Il semble que vous voulez ajouter des details de folio apres qu'un agent de prepartion termine
                                </Text>:null}
                                <TouchableWithoutFeedback
                                        onPress={onHandleClick}
                                >
                                        <View style={[styles.button]}>
                                                <Text style={styles.buttonText}>Contunuer</Text>
                                        </View>
                                </TouchableWithoutFeedback>
                        </View>
                </View>

        )
}

const styles = StyleSheet.create({
        container: {
                flex: 1,
                backgroundColor: '#fff',
                marginHorizontal: 10,
                marginVertical: 10
        },
        footer: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
        },
        image: {
                width: "80%",
                height: "30%",
                maxHeight: 200,
                resizeMode: 'contain'
        },
        title: {
                fontWeight: 'bold',
                color: '#000',
                fontSize: 20,
                textAlign: 'center',
                maxWidth: 300,
                marginVertical: 30
        },
        description: {
                textAlign: 'center',
                lineHeight: 21,
                color: '#777',
                maxWidth: 500,
                paddingHorizontal: 10
        },
        button: {
                marginTop: 30,
                borderRadius: 8,
                paddingVertical: 14,
                paddingHorizontal: 10,
                backgroundColor: COLORS.primary,
                marginHorizontal: 20,
                minWidth: 250,
        },
        buttonText: {
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
        },
        cardHeader: {
                flexDirection: 'row',
                // marginTop: StatusBar.currentHeight,
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
})