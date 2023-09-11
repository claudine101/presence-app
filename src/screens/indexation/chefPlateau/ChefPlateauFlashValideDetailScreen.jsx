import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import { ActivityIndicator, Image, Text, ToastAndroid, TouchableNativeFeedback, TouchableNativeFeedbackBase, TouchableOpacity, View } from "react-native"
import { StyleSheet } from "react-native"
import { Ionicons, MaterialCommunityIcons, Entypo, Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from "react-native";
import { useCallback, useRef, useState } from "react";
import fetchApi from "../../../helpers/fetchApi";
import { COLORS } from "../../../styles/COLORS";
import { useForm } from "../../../hooks/useForm";
import { useFormErrorsHandle } from "../../../hooks/useFormErrorsHandle";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import { Modalize } from "react-native-modalize";
import useFetch from "../../../hooks/useFetch";
import PROFILS from "../../../constants/PROFILS";
import Loading from "../../../components/app/Loading";
import moment from "moment";
import ImageView from "react-native-image-viewing";
import Folio from "../../../components/folio/Folio";
export default function ChefPlateauFlashValideDetailScreen() {
  const route = useRoute()
  const { flash, flashindexe } = route.params
  const [flashDetail, setFlashDetail] = useState({})
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation()
  const [galexyIndex, setGalexyIndex] = useState(null)
  const [selectedItems, setSelectedItems] = useState([])

  useFocusEffect(useCallback(() => {
    (async () => {
      try {
        const res = await fetchApi(`/indexation/flashs/details/valide/${flash.ID_FLASH}`)
        setFlashDetail(res.result)
        if (res.result.folios) {
          setSelectedItems(res.result.folios)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    })()
  }, []))
  return (
    <>
      {(galexyIndex != null && flashDetail && flashDetail?.pv) &&
        <ImageView
          images={[{ uri: flashDetail.pv.PV_PATH }, flashDetail.pvRetour ? { uri: flashDetail.pvRetour.PV_PATH } : undefined]}
          imageIndex={galexyIndex}
          visible={(galexyIndex != null) ? true : false}
          onRequestClose={() => setGalexyIndex(null)}
          swipeToCloseEnabled
          keyExtractor={(_, index) => index.toString()}
        />
      }
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableNativeFeedback
            onPress={() => navigation.goBack()}
            background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
            <View style={styles.headerBtn}>
              <Ionicons name="chevron-back-outline" size={24} color="black" />
            </View>
          </TouchableNativeFeedback>
          <Text style={styles.title}>{flashindexe ? flashindexe.NOM_FLASH : null}</Text>
        </View>
        {(loading) ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator animating size={'large'} color={'#777'} />
        </View> : <ScrollView style={styles.inputs}>

          <View style={styles.content}>
            {flashDetail ? <TouchableOpacity style={styles.selectContainer}>
              <View>
                <View style={styles.labelContainer}>
                  <View style={styles.icon}>
                    <MaterialCommunityIcons name="file-document-multiple-outline" size={20} color="#777" />
                  </View>
                  <Text style={styles.selectLabel}>
                    Dossiers
                  </Text>
                </View>
                <Text style={styles.selectedValue}>
                  {flashDetail?.folios?.length} dossier{flashDetail?.folios?.length > 1 && 's'}
                </Text>
              </View>
              <Entypo name="chevron-small-down" size={24} color="#777" />
            </TouchableOpacity> : null}

            <TouchableOpacity style={styles.selectContainer} disabled>
              <View style={{ width: '100%' }}>
                <View style={styles.labelContainer}>
                  <View style={styles.icon}>
                    <Feather name="user" size={20} color="#777" />
                  </View>
                  <Text style={styles.selectLabel}>
                    Agent indexation
                  </Text>
                </View>
                {flashDetail ? <><Text style={styles.selectedValue}>
                  {flashDetail?.pv?.traitement?.NOM} {flashDetail?.pv?.traitement?.PRENOM}
                </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                    <FontAwesome5 name="file-signature" size={20} color="#777" />
                    <Text style={styles.addImageLabel}>
                      Photo du procès verbal
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => {
                    setGalexyIndex(0)
                  }}>
                    <Image source={{ uri: flashDetail?.pv?.PV_PATH }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />
                  </TouchableOpacity>
                  {flashDetail?.pv ? <Text style={{ fontStyle: 'italic', color: '#777', fontSize: 10, marginTop: 5, textAlign: 'right' }}>Fait: {moment(flashDetail?.pv?.DATE_INSERTION).format("DD/MM/YYYY [à] HH:mm")}</Text> : null}
                </> : null}
              </View>
            </TouchableOpacity>
            {<View style={styles.folioList}>
               <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.selectedValue}>
                      {flashDetail?.folios?.length} dossier{flashDetail?.folios?.length > 1 && 's'}
                    </Text>
                    <Text style={styles.selectedValue}>
                      {selectedItems.length} indexé{selectedItems.length > 1 && 's'}
                    </Text>
                  </View>
              {flashDetail?.folios?.map((folio, index) => {
                return (
                  <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple("#c4c4c4", false)} key={index}>
                    <View style={{ marginTop: 10, overflow: 'hidden', borderRadius: 8 }}>
                      <View style={styles.folio}>
                        <View style={styles.folioLeftSide}>
                          <View style={styles.folioImageContainer}>
                            <Image source={require("../../../../assets/images/folio.png")} style={styles.folioImage} />
                          </View>
                          <View style={styles.folioDesc}>
                            <Text style={styles.folioName}>{folio.folio.NUMERO_FOLIO}</Text>
                            <Text style={styles.folioSubname}>{folio.folio.NUMERO_FOLIO}</Text>
                          </View>
                        </View>
                        <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} />
                      </View>
                    </View>
                  </TouchableNativeFeedback>
                )
              })}
            </View>}
            {(flashDetail?.pv) ? 
            <TouchableOpacity style={[styles.selectContainer, { flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'baseline' }]} disabled>
              <View style={styles.labelContainer}>
                <View style={styles.icon}>
                  <MaterialCommunityIcons name="usb-flash-drive-outline" size={20} color="#777" />
                </View>
                <Text style={styles.selectLabel}>
                  Support  de stockage  initial
                </Text>
              </View>
              <Text style={styles.selectedValue}>
                {flashDetail?.pv?.folio?.flash ? flashDetail?.pv?.folio?.flash?.NOM_FLASH:"N/A"}
              </Text> 
            </TouchableOpacity> : null}
            <TouchableOpacity style={styles.selectContainer} disabled>
              <View style={{ width: '100%' }}>
                
                {flashDetail?.pvRetour ? <>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                    <Text style={styles.addImageLabel}>
                      Photo du procès verbal retour
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => {
                    setGalexyIndex(1)
                  }}>
                    <Image source={{ uri: flashDetail?.pvRetour?.PV_PATH }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />
                  </TouchableOpacity>
                  {flashDetail?.pvRetour ? <Text style={{ fontStyle: 'italic', color: '#777', fontSize: 10, marginTop: 5, textAlign: 'right' }}>Fait: {moment(flashDetail.pvRetour.DATE_INSERTION).format("DD/MM/YYYY [à] HH:mm")}</Text> : null}
                </> : null}
              </View>
            </TouchableOpacity>

           
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
 
    backgroundColor: "#fff",
    padding: 13,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: "#ddd",
    marginVertical: 10,
    width: '100%'
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
    justifyContent: 'space-between',
    width: '100%'
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