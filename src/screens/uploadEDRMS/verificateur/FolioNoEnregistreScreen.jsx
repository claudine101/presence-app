import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";
import AppHeader from "../../../components/app/AppHeader";
import { useCallback, useState } from "react";
import fetchApi from "../../../helpers/fetchApi";
import { COLORS } from "../../../styles/COLORS";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function FolioNoEnregistreScreen() {
    const [folios, setFolios] = useState([])
    const [loading, setLoading] = useState(true)
    const navigation = useNavigation()
    useFocusEffect(useCallback(() => {
        (async () => {
            try {
                const res = await fetchApi(`/uploadEDMRS/folio/noEnregistre`)
                setFolios(res.result)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        })()
    }, []))
    const handleFoliosPress = folio => {
        navigation.navigate("DetailsFolioFlashScreen", { folio:folio.folio })
    }
    return (
        <>
            <AppHeader title="Dossiers no enregistrés" />
            {loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator animating size={'large'} color={'#777'} />
            </View> : <View style={styles.container}>
                {/* {folios.length > 0 ? <Text style={styles.title}>Dossiers no enregistre</Text> : null} */}
                {folios.length == 0 ? <View style={styles.emptyContainer}>
                    <Image source={require("../../../../assets/images/empty-folio.png")} style={styles.emptyImage} />
                    <Text style={styles.emptyLabel}>Aucun dossier trouvé</Text>
                </View> :
                    <FlatList
                        data={folios}
                        keyExtractor={(_, index) => index}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableNativeFeedback onPress={() => handleFoliosPress(item)} key={index} >
                                    <View style={{ marginTop: 10, overflow: 'hidden', borderRadius: 8 }}>
                                        <View style={[styles.folio]}>
                                            <View style={styles.folioLeftSide}>
                                                <View style={styles.folioImageContainer}>
                                                    <Image source={require("../../../../assets/images/folio.png")} style={styles.folioImage} />
                                                </View>
                                                <View style={styles.folioDesc}>
                                                    <Text style={styles.folioName}>{item.folio.NUMERO_FOLIO}</Text>
                                                    <Text style={styles.folioSubname}>{item.folio.NUMERO_FOLIO}</Text>
                                                </View>
                                            </View>

                                        </View>
                                    </View>
                                </TouchableNativeFeedback>

                            )
                        }}
                        style={styles.folioList}
                    />}

            </View>}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        paddingHorizontal: 10,
        marginTop: 10,
        fontSize: 17,
        fontWeight: 'bold',
        color: '#777'
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
    folioList: {
        paddingHorizontal: 10
    },
    actions: {
        padding: 10
    },
    actionBtn: {
        paddingVertical: 15,
        borderRadius: 8,
        backgroundColor: COLORS.primary
    },
    actionText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#fff'
    },
    folioImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 40,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
    },
    folio: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 10
    },
    folioLeftSide: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    folioImage: {
        width: '60%',
        height: '60%'
    },
    folioDesc: {
        marginLeft: 10
    },
    folioName: {
        fontWeight: 'bold',
        color: '#333',
    },
    folioSubname: {
        color: '#777',
        fontSize: 12
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
})