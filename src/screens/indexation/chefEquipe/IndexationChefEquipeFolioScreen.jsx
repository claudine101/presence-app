import { ActivityIndicator, ActivityIndicatorBase, FlatList, Image, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from "react-native";
import AppHeader from "../../../components/app/AppHeader";
import { useCallback, useEffect, useState } from "react";
import fetchApi from "../../../helpers/fetchApi";
import IDS_ETAPES_FOLIO from "../../../constants/ETAPES_FOLIO";
import Folio from "../../../components/folio/Folio";
import { COLORS } from "../../../styles/COLORS";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";

export default function IndexationChefEquipeFolioScreen() {
          const [folios, setFolios] = useState([])
          const [loading, setLoading] = useState(true)
          const [selectedItems, setSelectedItems] = useState([])
          const route = useRoute()
          const isSelected = folio => selectedItems.find(f => f.ID_FOLIO == folio.ID_FOLIO) ? true : false
          
          const handleFolioPress = (folio) => {
                    if(isSelected(folio)) {
                              const removed = selectedItems.filter(f => f.ID_FOLIO != folio.ID_FOLIO)
                              setSelectedItems(removed)
                    } else {
                              setSelectedItems(items => [...items, folio])
                    }
          }
          const navigation = useNavigation()
          useFocusEffect(useCallback(() => {
                    (async () => {
                              try {
                                        const res = await fetchApi(`/indexation/folio/etapes_folio/${IDS_ETAPES_FOLIO.RETOUR_AGENT_SUP_SCANNING_V_CHEF_PLATEAU}`)
                                        setFolios(res.result)
                              } catch (error) {
                                        console.log(error)
                              } finally {
                                        setLoading(false)
                              }
                    })()
          }, []))
          useEffect(() => {
            const { noSelectItems } = route.params || {}
            if (noSelectItems) {
                setSelectedItems([])
            }
        }, [route])
          return (
                    <>
                    <AppHeader title="Dossiers en attente " />
                    {loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                              <ActivityIndicator animating size={'large'} color={'#777'} />
                    </View> : <View style={styles.container}>
                              {folios.length == 0 ? <View style={styles.emptyContainer}>
                                        <Image source={require("../../../../assets/images/empty-folio.png")} style={styles.emptyImage} />
                                        <Text style={styles.emptyLabel}>Aucun dossier trouvé</Text>
                              </View>:
                              <FlatList
                                        data={folios}
                                        keyExtractor={(_, index) => index}
                                        renderItem={({ item, index} ) => {
                                                  return (
                                                            <Folio folio={item} key={index} onPress={handleFolioPress} isSelected={isSelected} />
                                                  )
                                        }}
                                        style={styles.folioList}
                              />}
                              {folios.length > 0 ? <View style={styles.actions}>
                                        <TouchableOpacity style={[styles.actionBtn, { opacity: selectedItems.length == 0 ? 0.5 : 1 }]} disabled={selectedItems.length == 0} onPress={() => {
                                                  navigation.navigate("SelectFlashAgentSupScreen", {
                                                            folios: selectedItems
                                                  })
                                        }}>
                                                  <Text style={styles.actionText}>Classer</Text>
                                        </TouchableOpacity>
                              </View> : null}
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
          
})