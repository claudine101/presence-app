import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableNativeFeedback, View } from "react-native"
import AppHeader from "../../../components/app/AppHeader"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { useCallback, useState } from "react"
import fetchApi from "../../../helpers/fetchApi"
import { COLORS } from "../../../styles/COLORS"
import { AntDesign, Ionicons } from '@expo/vector-icons'; 
import moment from "moment"

export default function SupFlashValidesScreen() {
          const [loading, setLoading] = useState(true)
          const [flashs, setFlashs] = useState([])

          const navigation = useNavigation()
          const fetchFlash = async () => {
                    try {
                              const res = await fetchApi(`/indexation/flashs/sup_aile_indexation?precision=valides`)
                              setFlashs(res.result)
                    } catch (error) {
                              console.log(error)
                    } finally {
                              setLoading(false)
                    }
          }
          useFocusEffect(useCallback(() => {
                    (async () => {
                              fetchFlash()
                    })()
          }, []))
          const handleFlashPress = flash => {
                    navigation.navigate("SelectChefPlateauScreen", { flash })
          }
          return (
                    <>
                              <AppHeader title="Dossiers classés" />
                              {loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                              </View> : <View style={styles.container}>
                                        {!loading && flashs.length > 0 ? <Text style={styles.title}>Clés des dossiers indexés</Text> : null}
                                        {flashs.length == 0 ? <View style={styles.emptyContainer}>
                                                  <Image source={require("../../../../assets/images/empty-folio.png")} style={styles.emptyImage} />
                                                  <Text style={styles.emptyLabel}>Aucun dossier trouvé</Text>
                                        </View>:
                                        <FlatList
                                                  data={flashs}
                                                  keyExtractor={(_, index) => index}
                                                  renderItem={({ item, index} ) => {
                                                            return (
                                                                      <TouchableNativeFeedback key={index} onPress={() => handleFlashPress(item.folio.flash)}>
                                                                                <View style={{ marginTop: 10, overflow: 'hidden', borderRadius: 8 }}>
                                                                                          <View style={styles.folio}>
                                                                                                    <View style={styles.folioLeftSide}>
                                                                                                              <View style={styles.folioImageContainer}>
                                                                                                                        <Image source={require("../../../../assets/images/usb-flash-drive.png")} style={styles.folioImage} />
                                                                                                              </View>
                                                                                                              <View style={styles.folioDesc}>
                                                                                                                        <Text style={styles.folioName}>{ item.NOM_FLASH }</Text>
                                                                                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                                                                                                                                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                                                                            <AntDesign name="calendar" size={20} color="#777" />
                                                                                                                                            <Text style={[styles.folioSubname, { marginLeft: 3 }]}>
                                                                                                                                                      {moment(item.DATE_INSERTION).format('DD/MM/YYYY HH:mm')}
                                                                                                                                            </Text>
                                                                                                                                  </View>
                                                                                                                                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                                                                            <Ionicons name="ios-document-text-outline" size={20} color="#777" />
                                                                                                                                            <Text style={[styles.folioSubname, { marginLeft: 3 }]}>
                                                                                                                                                      {item.folioCounts} dossier{item.folioCounts > 1 && 's'}
                                                                                                                                            </Text>
                                                                                                                                  </View>
                                                                                                                        </View>
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
          }
})