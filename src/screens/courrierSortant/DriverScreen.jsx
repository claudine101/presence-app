import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome5, AntDesign } from '@expo/vector-icons';
import fetchApi from "../../helpers/fetchApi";
import { COLORS } from "../../styles/COLORS";
/**
 * Screen pour lister les societes
 * @author HABIYAKARE Leonard <leonard@mediabox.bi>
 * @date 29/04/2023
 * @returns 
 */
const Remet = ({ remet, index, handleSocietePress, selectedsociete }) => {
    return (
        <TouchableNativeFeedback onPress={() => handleSocietePress(remet)}>
            <View style={styles.institution}>
                <View style={styles.logoContainer}>
                    {remet.PHOTO_USER ?
                        <Image source={{ uri: remet.PHOTO_USER }} style={styles.logoInstitution} /> :
                        <AntDesign name="user" size={24} color="white" />
                    }
                    {remet.MOYENNE ? <View style={styles.notemoyene}>
                        <AntDesign name="star" size={10} color="white" style={{ marginRight: 2 }} />
                        <Text numberOfLines={2} style={styles.chauffeurnotes} >
                            {parseFloat(remet.MOYENNE).toFixed(1)}
                        </Text>
                    </View> : null}
                </View>
                <View style={styles.detais}>
                    <View style={styles.detailvehicule}>
                        <Text style={styles.institutionName} numberOfLines={1}>
                            {remet.NOM}  {remet.PRENOM}
                        </Text>
                        <Text style={styles.plaque}>{remet.NUMERO_PLAQUE}</Text>
                    </View>
                    <View style={styles.icon}>
                        {selectedsociete && selectedsociete.USERS_ID == remet.USERS_ID ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                            <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                    </View>

                </View>
            </View>
        </TouchableNativeFeedback>
    )
}
const ListHeader = ({ handleSocietePress, selectedsociete, newSociete, previousRouteName }) => {
    const navigation = useNavigation()
    const route = useRoute()
    const previousRoutesociete = navigation.getState().routes[navigation.getState().index - 1].name
}
export default function DriverScreen() {
    const navigation = useNavigation()
    const route = useRoute()
    const [loading, setLoading] = useState(true)
    const [remets, setRemets] = useState([])
    const { societe, courrier, newSociete, previousRouteName } = route.params
    const previousRoutesociete = navigation.getState().routes[navigation.getState().index - 1].name
    const [isInSearch, setIsInSearch] = useState(false)
    const [selectedsociete, setSelectedsociete] = useState(societe)
    const [q, setQ] = useState('')
    const handleSocietePress = remets => {
        setSelectedsociete(remets)
        navigation.navigate(previousRoutesociete, { ...route.params, societe: remets })
    }
    const handleBackPress = useCallback(() => {
        if (isInSearch) {
            setIsInSearch(false)
            return false
        }
        navigation.goBack()
    }, [isInSearch])
    const handleSearchPress = () => {
        setIsInSearch(true)
    }
    useEffect(() => {
        (async () => {
            if (q && q.trim() != '') {
                try {
                    setLoading(true)
                    const remt = await fetchApi(`/services/driver?q=${q}`)
                    setRemets(remt.result)
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            } else {
                try {
                    setLoading(true)
                    const remt = await fetchApi(`/services/driver`)
                    setRemets(remt.result)
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            }
        })()
    }, [q])

    useFocusEffect(useCallback(() => {
        (async () => {
            try {
                const remt = await fetchApi('/services/driver')
                setRemets(remt.result)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        })()
    }, []))
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.exiitSearch}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#C4C4C4', true)} onPress={handleBackPress}>
                        <View style={styles.headerBtn}>
                            <Ionicons name="arrow-back-outline" size={24} color="#18678E" />
                        </View>
                    </TouchableNativeFeedback>

                    {!isInSearch ? <Text style={styles.title}>Sélectionner le chauffeur</Text> : null}
                    {isInSearch ? <TextInput autoFocus style={styles.searchInput} value={setQ} onChangeText={n => setQ(n)} /> : false}
                </View>
                {!isInSearch ? <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#C4C4C4', true)} onPress={handleSearchPress}>
                    <View style={styles.headerBtn}>
                        <Feather name="search" size={24} color="#18678E" />
                    </View>
                </TouchableNativeFeedback> : null}
            </View>
            {loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator animating size={'large'} color='#000' />
            </View> :
                <FlatList
                    data={remets}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, index }) => {
                        return (
                            <Remet remet={item} index={index}
                                selectedsociete={selectedsociete}
                                handleSocietePress={handleSocietePress}
                            />
                        )
                    }}
                    ListHeaderComponent={() => <ListHeader
                        selectedsociete={selectedsociete} newSociete={selectedsociete && selectedsociete.ID_SOCIETE == "new" ? selectedsociete : null}
                        handleSocietePress={handleSocietePress}
                        previousRouteName={previousRouteName}
                    />}
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
    title: {
        fontWeight: 'bold',
        opacity: 0.8,
        color: COLORS.primary,
        fontSize: 16,
        marginLeft: 5
    },
    headerBtn: {
        padding: 10,
        borderRadius: 20
    },
    searchInput: {
        flex: 1
    },
    detais: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1
    },
    institution: {
        flexDirection: 'row',
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    plaque: {
        fontSize: 12
    },
    logoContainer: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: '#85969F',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
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
        opacity: 0.8,
    },
    institutionAddress: {
        color: '#777',
        fontSize: 12
    },
   
    notemoyene: {
        flexDirection: "row",
        alignItems: 'center',
        position: "absolute",
        backgroundColor: COLORS.primary,
        paddingHorizontal: 5,
        borderRadius: 30,
        bottom:-5
    },
    chauffeurnotes: {
        color: "white",
        fontSize: 10,
    },
    detailvehicule: {
        marginLeft: 10
    },
})