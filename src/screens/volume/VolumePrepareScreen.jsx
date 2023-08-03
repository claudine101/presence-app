import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { ImageBackground, ScrollView, StyleSheet, StatusBar, Text, TouchableNativeFeedback, useWindowDimensions, View, Image, TouchableOpacity, ActivityIndicator, FlatList, TouchableWithoutFeedback } from "react-native";
import moment from 'moment'
import { Ionicons, AntDesign, MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from "../../styles/COLORS";
import AppHeader from "../../components/app/AppHeader";
import fetchApi from "../../helpers/fetchApi";
import Loading from "../../components/app/Loading";
import { FloatingAction } from "react-native-floating-action";
import { useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelector';
import { Modalize } from "react-native-modalize";
import * as DocumentPicker from 'expo-document-picker';
import { useForm } from "../../hooks/useForm";
import { Entypo } from '@expo/vector-icons';
import AppHeaderPrepare from "../../components/app/AppHeaderPrepare";
/**
 * Screen pour afficher la listes des volumes deja preparer
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 11/7/2023
 * @returns 
 */
export default function VolumePrepareScreen() {
    const navigation = useNavigation()
    const user = useSelector(userSelector)

    const Action = ({ title, image }) => {
        return (
            <View style={styles.action}>
                <Text style={styles.actionLabel}>{title}</Text>
                <View style={styles.actionIcon}>
                    <Image source={image} style={{ tintColor: '#fff', maxWidth: '50%', maxHeight: '50%', minWidth: '50%', minHeight: '50%' }} />
                </View>
            </View>
        )
    }

    const actions = [
    ];
    const actionsPlanification = [
        {
            text: "Ajouter volume",
            icon: require("../../../assets/images/entrant.jpg"),
            name: "DescriptionEtapeScreen",
            position: 1,
            render: () => <Action title={"Planification des activites"} image={require("../../../assets/images/mail-receive-small.png")} key={"key1"} />
        },
    ];
    const actionsAgentArchivages = [
        {
            text: "Agent Archivages",
            icon: require("../../../assets/images/entrant.jpg"),
            name: "DescriptionEtapeScreen",
            position: 2,
            render: () => <Action title={"Ajouter les dossiers"} image={require("../../../assets/images/mail-receive-small.png")} key={"key2"} />
        },
    ];
    const actionsAgentSuperviseur = [
        {
            text: "Agent superviseur",
            icon: require("../../../assets/images/entrant.jpg"),
            name: "DescriptionEtapeScreen",
            position: 3,
            render: () => <Action title={"Ajouter les details d'un folio"} image={require("../../../assets/images/mail-receive-small.png")} key={"key3"} />
        },
        {
            text: "Agent superviseur maille",
            icon: require("../../../assets/images/entrant.jpg"),
            name: "DescriptionEtapeSupMailleScreen",
            position: 4,
            render: () => <Action title={"Ajout de volume dans une malle"} image={require("../../../assets/images/mail-receive-small.png")} key={"key4"} />
        },
    ];
    const actionsAgentSuperviseurAille = [
        {
            text: "Agent superviseur aille",
            icon: require("../../../assets/images/entrant.jpg"),
            name: "DescriptionEtapeScreen",
            position: 5,
            render: () => <Action title={"Nommer agnt superviseur aille"} image={require("../../../assets/images/mail-receive-small.png")} key={"key5"} />
        },
    ];
    const actionsAgentAille = [
        {
            text: "Superviseur aille",
            icon: require("../../../assets/images/entrant.jpg"),
            name: "DescriptionEtapeScreen",
            position: 6,
            render: () => <Action title={"Nommer un chef plateau"} image={require("../../../assets/images/mail-receive-small.png")} key={"key6"} />
        },
    ];
    const actionsAgentchefPlateau = [
        {
            text: "Agent chef plateau",
            icon: require("../../../assets/images/entrant.jpg"),
            name: "DescriptionEtapeScreen",
            position: 7,
            render: () => <Action title={"Agent superviseur phase preparation"} image={require("../../../assets/images/mail-receive-small.png")} key={"key7"} />
        },
    ];
    const actionsAgentSuperviseurPhasePreparation = [
        {
            text: "Agent superviseur phase preparation",
            icon: require("../../../assets/images/entrant.jpg"),
            name: "DescriptionEtapeScreen",
            position: 8,
            render: () => <Action title={"Nommer un agent preparation"} image={require("../../../assets/images/mail-receive-small.png")} key={"key8"} />
        },
        {
            text: "Agent traitement",
            icon: require("../../../assets/images/entrant.jpg"),
            name: "DescriptionEtapeSupMailleScreen",
            position: 9,
            render: () => <Action title={"Ajout de detaits"} image={require("../../../assets/images/mail-receive-small.png")} key={"key9"} />
        },
    ];
    const actionsDiver = [
        {
            text: "Scanner un QR",
            icon: require("../../../assets/images/qr-code.png"),
            name: "CourrierScanSourceScreen",
            position: 3,
            render: () => <Action title={"Scanner un QR"} image={require("../../../assets/images/qr-code.png")} key={"key3"} />
        }
    ];
    return (
        <>

            <AppHeaderPrepare />
            <View style={styles.emptyContaier}>
                <Image source={require('../../../assets/images/mail-receive.png')} style={styles.emptyImage} />
                <Text style={styles.emptyTitle}>
                    Aucun volume preparer trouvé
                </Text>
                <Text style={styles.emptyDesc}>
                    Aucun volume prepare termine ou vous n'êtes pas affecte a aucun volume
                </Text>
            </View>

            <FloatingAction
                actions={user.ID_PROFIL ==1 ? actionsPlanification : 
                    user.ID_PROFIL == 2 ? actionsAgentArchivages : 
                    user.ID_PROFIL == 3 ? actionsAgentSuperviseur :
                    user.ID_PROFIL == 29 ? actionsAgentSuperviseurAille :
                    user.ID_PROFIL == 7 ? actionsAgentAille :
                    user.ID_PROFIL == 15 ? actionsAgentchefPlateau :
                    user.ID_PROFIL == 8 ? actionsAgentSuperviseurPhasePreparation : actions }
                onPressItem={name => {
                    if (name == 'DescriptionEtapeScreen') {
                        navigation.navigate("DescriptionEtapeScreen")
                    } else if (name == 'DescriptionEtapeScreen') {
                        navigation.navigate('DescriptionEtapeScreen')
                    } else if (name == 'DescriptionEtapeScreen') {
                        navigation.navigate('DescriptionEtapeScreen')
                    } else if (name == 'DescriptionEtapeSupMailleScreen') {
                        navigation.navigate('DescriptionEtapeSupMailleScreen')
                    } else if (name == 'DescriptionEtapeScreen') {
                        navigation.navigate('DescriptionEtapeScreen')
                    } else if(name == 'DescriptionEtapeScreen'){
                        navigation.navigate('DescriptionEtapeScreen')
                    }else if (name == 'DescriptionEtapeScreen') {
                        navigation.navigate('DescriptionEtapeScreen')
                    } else if (name == 'DescriptionEtapeScreen') {
                        navigation.navigate('DescriptionEtapeScreen')
                    } else {
                        navigation.navigate('DescriptionEtapeSupMailleScreen')
                    }
                }}
                color={COLORS.primary}
            />
        </>

    )
}

const styles = StyleSheet.create({
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
        flex: 1,
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
    }
})