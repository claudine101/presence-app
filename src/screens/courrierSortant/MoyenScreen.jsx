import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome5, AntDesign,SimpleLineIcons,Entypo,MaterialIcons  } from '@expo/vector-icons';
import fetchApi from "../../helpers/fetchApi";

/**
 * Screen pour lister les moyens de transport
 * @author HABIYAKARE Leonard <leonard@mediabox.bi>
 * @date 09/05/2023
 * @returns 
 */
const Remet = ({ remet, index, handleMoyenPress, selectedMoyen }) => {
    return (
        <TouchableNativeFeedback onPress={() => handleMoyenPress(remet)}>

            <View style={styles.institution}>
                <View style={styles.institutionLeftSide}>
                    <View style={styles.logoContainer}>
                        {remet.IMAGE ?
                            <Image source={{ uri: remet.IMAGE }} style={styles.logoInstitution} /> :
                            <MaterialIcons name="emoji-transportation" size={24} color="white" />
                        }
                    </View>
                    <View style={styles.institutionDetails}>
                        <Text style={styles.institutionName} numberOfLines={1} >
                            {remet.DESCR_MOYEN_TRANS}
                        </Text>
                    </View>
                </View>

                {selectedMoyen && selectedMoyen.MOYEN_TRANSPORT_ID == remet.MOYEN_TRANSPORT_ID ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                    <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
            </View>
        </TouchableNativeFeedback>
    )
}


export default function MoyenScreen() {
    const navigation = useNavigation()
    const route = useRoute()
    const [loading, setLoading] = useState(true)
    const [moyentranport, setMoyentransport] = useState([])
    const{moyen,newMoyen}=route.params

 const[selectedMoyen,SetMoyen]=useState(moyen)
    const handleMoyenPress = moyentranport => {
        SetMoyen(moyentranport)
        navigation.navigate("CourrierSortantScreen", {moyen:moyentranport })
}
  
    const handleBackPress = useCallback(() => { 
        navigation.goBack()
    }, [])
   
    useEffect(() => {
        (async () => {
           
                try {
                    setLoading(true)
                    const moyn = await fetchApi(`/services/moyenTrans`)
                    setMoyentransport(moyn.result)
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
           
        })()
    }, [])

    useFocusEffect(useCallback(() => {
        (async () => {
            try {
                const moyn = await fetchApi('/services/moyenTrans')
                setMoyentransport(moyn.result)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        })()
    }, []))

//     const handleBackPress = () => {
//         navigation.goBack()
// }
    return (
        <View style={styles.container}>
            
                
            <View style={styles.header}>
                <View style={styles.exiitSearch}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#C4C4C4', true)} onPress={handleBackPress}>
                        <View style={styles.headerBtn}>
                            <Ionicons name="arrow-back-outline" size={24} color="#777" />
                        </View>
                    </TouchableNativeFeedback>
                    
                </View>
                
            </View>
            
            {loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator animating size={'large'} color='#000' />
            </View> :
                <FlatList
                    data={moyentranport}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, index }) => {
                        return (
                            <Remet remet={item} index={index}
                            selectedMoyen={selectedMoyen}
                            handleMoyenPress={handleMoyenPress}
                            />

                        )
                    }}
                    keyboardShouldPersistTaps='handled'
                />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10
    },
    exiitSearch: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerBtn: {
        padding: 10,
        borderRadius: 20
    },
    searchInput: {
        flex: 1
    },
    institution: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    institutionLeftSide: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoContainer: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: '#85969F',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoInstitution: {
        width: '95%',
        height: '95%',
        borderRadius: 100
    },
    institutionDetails: {
        marginLeft: 10
    },
    institutionName: {
        fontWeight: 'bold',
        opacity: 0.8
    },
    institutionAddress: {
        color: '#777',
        fontSize: 12
    },
    listHeader: {
    }
})