import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import { ActivityIndicator, Image, Text, ToastAndroid, TouchableNativeFeedback, TouchableNativeFeedbackBase, TouchableOpacity, View } from "react-native"
import { StyleSheet } from "react-native"
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { ScrollView } from "react-native";
import { useCallback, useRef, useState } from "react";
import fetchApi from "../../helpers/fetchApi";
import { COLORS } from "../../styles/COLORS";
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import ImageView from "react-native-image-viewing";
import moment from "moment";

export default function AgentSuperviseurValideDetailScreen() {
          const route = useRoute()
          const { agent,folio } = route.params
          const [loading, setLoading] = useState(true)
          const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
          const navigation = useNavigation()
          const agentsModalRef = useRef()
          const [isSubmitting, setIsSubmitting] = useState(false)
          const [galexyIndex, setGalexyIndex] = useState(null)
        const [loadingPvs, setLoadingPvs] = useState(false)
        const [pvs, setPvs] = useState(null)
        const folio_ids = folio?.map(folio => folio.ID_FOLIO)
        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoadingPvs(true)
                                const form = new FormData()
                                form.append('folioIds', JSON.stringify(folio_ids))
                                form.append('AGENT_SUPERVISEUR', agent.USERS_ID)
                                const res = await fetchApi(`/preparation/folio/getPvAgentSuperviseur`, {
                                        method: "POST",
                                        body: form
                                })
                                setPvs(res)

                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoadingPvs(false)
                        }
                })()
        }, []))


          const [data, handleChange] = useForm({
                    agent: null,
                    pv: null
          })
          const { hasError, getError, setErrors, checkFieldData, isValidate, setError } = useFormErrorsHandle(data, {
                    agent: {
                              required: true
                    },
                    pv: {
                              required: true
                    }
          })

          const openAgentModalize = () => {
                    agentsModalRef.current?.open()
          }
         
          return (
                    <>
                              {(galexyIndex != null && pvs?.result && pvs?.result) &&
                                        <ImageView
                                                  images={[{ uri: pvs?.result.PV_PATH }, pvs?.result?.pvRetour ? { uri: pvs?.result?.pvRetour.PV_PATH } : undefined]}
                                                  imageIndex={galexyIndex}
                                                  visible={(galexyIndex != null) ? true : false}
                                                  onRequestClose={() => setGalexyIndex(null)}
                                                  swipeToCloseEnabled
                                                  keyExtractor={(_, index) => index.toString()}
                                        />
                              }
                              {/* {isSubmitting && <Loading />} */}
                              <View style={styles.container}>
                                        <View style={styles.header}>
                                                  <TouchableNativeFeedback
                                                            onPress={() => navigation.goBack()}
                                                            background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                                                            <View style={styles.headerBtn}>
                                                                      <Ionicons name="chevron-back-outline" size={24} color="black" />
                                                            </View>
                                                  </TouchableNativeFeedback>
                                                  <Text style={styles.title}>{agent.NOM } {agent.PRENOM }</Text>
                                        </View>
                                        {loadingPvs ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                  <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View> : <ScrollView style={styles.inputs}>
                                                  
                                                  <View style={styles.content}>
                                                            <TouchableOpacity style={styles.selectContainer} onPress={openAgentModalize} disabled={pvs?.result ? true : false}>
                                                                      <View style={{ width: '100%' }}>
                                                                               
                                                                                {loadingPvs ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                          <ActivityIndicator animating size={'small'} color={'#777'} />
                                                                                          <Text style={[styles.selectedValue, { marginLeft: 5 }]}>
                                                                                                    Chargement
                                                                                          </Text>
                                                                                </View> : 
                                                                                pvs?.result ?
                                                                                    <>
                                                                                              <TouchableOpacity onPress={() => {
                                                                                                        setGalexyIndex(0)
                                                                                              }}>
                                                                                                        <Image source={{ uri: pvs?.result?.PV_PATH }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />
                                                                                              </TouchableOpacity>
                                                                                              <Text style={{ fontStyle: 'italic', color: '#777', fontSize: 10, marginTop: 5, textAlign: 'right' }}>Fait: {moment(pvs?.result?.date).format("DD/MM/YYYY [à] HH:mm")}</Text>
                                                                                    </> : null}
                                                                                
                                                                               
                                                                                
                                                                      </View>
                                                            </TouchableOpacity>

                                                             {pvs?.result?.foliosPrepares.length > 0 ? <View style={styles.selectContainer}>
                                                                      <View style={{ width: '100%' }}>
                                                                                <View style={[styles.labelContainer, { justifyContent: 'space-between' }]}>
                                                                                          
                                                                                </View>
                                                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                          <Text style={styles.selectedValue}>
                                                                                          </Text>
                                                                                          <Text style={styles.selectedValue}>
                                                                                                    {pvs?.result?.foliosPrepares.length} préparé{pvs?.result?.foliosPrepares.length > 1 && 's'}
                                                                                          </Text>
                                                                                </View>
                                                                                <View style={styles.folioList}>
                                                                                          {pvs?.result?.foliosPrepares.map((folio, index) => {
                                                                                                    return (
                                                                                                        <View style={{ marginTop: 10, overflow: 'hidden', borderRadius: 8 }}>
                                                                                                        <View style={[styles.folio]}>
                                                                                                                  <View style={styles.folioLeftSide}>
                                                                                                                            <View style={styles.folioImageContainer}>
                                                                                                                                      <Image source={require("../../../assets/images/folio.png")} style={styles.folioImage} />
                                                                                                                            </View>
                                                                                                                            <View style={styles.folioDesc}>
                                                                                                                                      <Text style={styles.folioName}>{ folio.NUMERO_FOLIO }</Text>
                                                                                                                                      <Text style={styles.folioSubname}>{ folio.NUMERO_FOLIO }</Text>
                                                                                                                            </View>
                                                                                                                  </View>
                                                                                                                  <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} /> 
                                                                                                        </View>
                                                                                              </View>
                                                                                                    )
                                                                                          })}
                                                                                </View>
                                                                      </View>
                                                            </View> : null}
                                                            {pvs?.result?.foliosNoPrepare?.length > 0 ? <View style={styles.selectContainer}>
                                                                      <View style={{ width: '100%' }}>
                                                                                <View style={[styles.labelContainer, { justifyContent: 'space-between' }]}>
                                                                                          
                                                                                </View>
                                                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                          <Text style={styles.selectedValue}>
                                                                                          </Text>
                                                                                          <Text style={styles.selectedValue}>
                                                                                                    {pvs?.result?.foliosNoPrepare.length} non préparé{pvs?.result?.foliosPrepares.length > 1 && 's'}
                                                                                          </Text>
                                                                                </View>
                                                                                <View style={styles.folioList}>
                                                                                          {pvs?.result?.foliosNoPrepare.map((folio, index) => {
                                                                                                    return (
                                                                                                        <View style={{ marginTop: 10, overflow: 'hidden', borderRadius: 8 }}>
                                                                                                        <View style={[styles.folio]}>
                                                                                                                  <View style={styles.folioLeftSide}>
                                                                                                                            <View style={styles.folioImageContainer}>
                                                                                                                                      <Image source={require("../../../assets/images/folio.png")} style={styles.folioImage} />
                                                                                                                            </View>
                                                                                                                            <View style={styles.folioDesc}>
                                                                                                                                      <Text style={styles.folioName}>{ folio.NUMERO_FOLIO }</Text>
                                                                                                                                      <Text style={styles.folioSubname}>{ folio.NUMERO_FOLIO }</Text>
                                                                                                                            </View>
                                                                                                                  </View>
                                                                                                                  <MaterialIcons style={styles.checkIndicator} name="cancel" size={24} color="red" /> 
                                                                                                        </View>
                                                                                              </View>
                                                                                                    )
                                                                                          })}
                                                                                </View>
                                                                      </View>
                                                            </View> : null}
                                                            <View style={[styles.addImageItem]}>
                                                                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                                                                                          <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                                                                    <FontAwesome5 name="file-signature" size={20} color="#777" />
                                                                                                    <Text style={styles.addImageLabel}>
                                                                                                              Procès verbal du retour
                                                                                                    </Text>
                                                                                          </View>
                                                                                          {isCompressingPhoto ? <ActivityIndicator animating size={'small'} color={'#777'} /> : null}
                                                                                </View>
                                                            <TouchableOpacity style={styles.selectContainer} onPress={openAgentModalize} disabled={pvs?.result?.pvRetour ? true : false}>
                                                                      <View style={{ width: '100%' }}>
                                                                               
                                                                                {loadingPvs ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                          <ActivityIndicator animating size={'small'} color={'#777'} />
                                                                                          <Text style={[styles.selectedValue, { marginLeft: 5 }]}>
                                                                                                    Chargement
                                                                                          </Text>
                                                                                </View> : 
                                                                                pvs?.result ?
                                                                                    <>
                                                                                              <TouchableOpacity onPress={() => {
                                                                                                        setGalexyIndex(1)
                                                                                              }}>
                                                                                                        <Image source={{ uri: pvs?.result?.pvRetour?.PV_PATH }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />
                                                                                              </TouchableOpacity>
                                                                                              <Text style={{ fontStyle: 'italic', color: '#777', fontSize: 10, marginTop: 5, textAlign: 'right' }}>Fait: {moment(pvs?.result?.pvRetour?.DATE_INSERTION).format("DD/MM/YYYY [à] HH:mm")}</Text>
                                                                                    </> : null}
                                                                                    
                                                                                
                                                                               
                                                                                
                                                                      </View>
                                                            </TouchableOpacity>
                                                            </View>
                                                            
                                                  </View>
                                        </ScrollView>}
                                        
                              </View>
                              
                    </>
          )
}

const styles = StyleSheet.create({
          container: {
                    flex: 1,
                    backgroundColor: '#fff'
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
                    color: '#777',
          },
          detailsHeader: {
                    paddingHorizontal: 10
          },
          labelContainer: {
                    flexDirection: 'row',
                    alignItems: 'center'
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
          folio: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#f1f1f1',
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
          folioList: {
                    // paddingHorizontal: 10
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
          selectContainer: {
                    backgroundColor: "#fff",
                    padding: 13,
                    borderRadius: 5,
                    borderWidth: 0.5,
                    borderColor: "#ddd",
                    marginVertical: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
          },
          selectedValue: {
                    color: '#777',
                    marginTop: 2
          },
          content: {
                    paddingHorizontal: 10
          },
          addImageItem: {
                    borderWidth: 0.5,
                    borderColor: "#ddd",
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 15,
                    marginBottom: 5
          },
          addImageLabel: {
                    marginLeft: 5,
                    opacity: 0.8
          },
          modalHeader: {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 10,
                    paddingVertical: 5
          },
          modalTitle: {
                    fontWeight: "bold",
                    textAlign: "center",
                    marginTop: 10,
                    fontSize: 16
          },
          listItem: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                    paddingHorizontal: 10
          },
          listItemImageContainer: {
                    width: 50,
                    height: 50,
                    borderRadius: 10,
                    backgroundColor: '#ddd',
                    justifyContent: 'center',
                    alignItems: 'center'
          },
          listItemImage: {
                    width: '60%',
                    height: '60%',
          },
          listItemDesc: {
                    flexDirection: 'row',
                    alignItems: 'center'
          },
          listNames: {
                    marginLeft: 10
          },
          listItemTitle: {
                    fontWeight: 'bold'
          },
          listItemSubTitle: {
                    color: '#777',
                    fontSize: 12,
                    marginTop: 5
          },
})