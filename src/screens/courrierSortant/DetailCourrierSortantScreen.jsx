import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { ImageBackground, ScrollView, StyleSheet, StatusBar, Text, TouchableNativeFeedback, Linking, useWindowDimensions, View, Image, TouchableOpacity, ActivityIndicator, Alert, ToastAndroid } from "react-native";
import moment from 'moment'
import { Ionicons, AntDesign, MaterialIcons, Feather, MaterialCommunityIcons, Zocial, FontAwesome, Entypo } from '@expo/vector-icons';
import { COLORS } from "../../styles/COLORS";
import AppHeader from "../../components/app/AppHeader";
import fetchApi from "../../helpers/fetchApi";
import Loading from "../../components/app/Loading";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as WebBrowser from 'expo-web-browser';
import { useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelector';
import * as Location from 'expo-location';
/**
 * Screen pour faire le detail du courrier sortant 
 * @author HABIYAKARE Leonard <leonard@mediabox.bi>
 * @date 05/05/2023
 * @returns 
 */
export default function DetailCourrierSortantScreen() {
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation()
  const route = useRoute()
  const [document, setDocument] = useState(null)
  const [qrcode, setQrcode] = useState(null)
  const [qrcodeDest, setQrcodeDest] = useState(null)
  const [accuse, setAccuse] = useState(null)
  const user = useSelector(userSelector)
  const [loadingDocument, setLoadingDocument] = useState(true)
  const [loadingCoords, setLoadingCoords] = useState(true)

  const [loadingQrcode, setLoadingQrcode] = useState(true)
  const [loadingQrcodeDest, setLoadingQrcodeDest] = useState(true)

  const [loadingAccuse, setLoadingAccuse] = useState(true)
  const { courrier, detailNotification } = route.params
  var id
  if (detailNotification) {
    id = courrier.ID_COURRIER
  }
  else {
    id = courrier.TRANSMISSION_ID
  }
  const handleEdit = courrier => {
    navigation.navigate("UpdateCourrierSortantScreen", { courrier: detail, inEdit: true, inAffect: false })
  }

  const supprimer = () => {
    Alert.alert(
      "Supprimer",
      " voulez-vous supprimer ce courrier ? ",
      [
        {
          text: "annuler",
          style: "cancel"
        },
        {
          text: "oui", onPress: async () => {
            try {
              setLoading(true)
              const res = await fetchApi(`/courrier/courrier_entrants/courriersortantdelete/${courrier.TRANSMISSION_ID}`, { method: "DELETE" })
              navigation.navigate('Root', {
                ...route.params,
              })
              ToastAndroid.show('suppression effectué avec succès!', ToastAndroid.LONG);
            } catch (error) {
              console.log(error)
            } finally {
              setLoading(false)
            }
          }

        }
      ]
    )

  }
  const [detail, setDetail] = useState({})

  /**
     * fonction utilise pour recupere les coordonnes
     * @author NDAYISABA  claudine <claudine@mediabox.bi>
     * @date 08/05/2023 à 10:07
     */
  useEffect(() => {
    (async () => {
      try {
        setLoadingCoords(true)
        let { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        if (locationStatus !== 'granted') {
          return setLoading(false)
        }
        var loc = await Location.getCurrentPositionAsync({});
        setLatitude(loc.coords.latitude)
        setLongitude(loc.coords.longitude)
      }
      catch (error) {
        console.log(error)
      } finally {
        setLoadingCoords(false)
      }
    }
    )()
  }, []);
  useEffect(() => {
    (async () => {
      try {
        const response = await fetchApi(`/courrier/courrier_entrants/sortantcourrier/${id}`)
        setDetail(response.result)
      }
      catch (error) {
        console.log({ error })
      }
      finally {
        setLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      const perm = await MediaLibrary.requestPermissionsAsync()
      if (!perm.granted) return false
      if (detail.LETTRE_PAPH) {
        const splits = detail.LETTRE_PAPH.split('/')
        const fileName = splits[splits.length - 1]
        const downloadResult = await FileSystem.downloadAsync(
          detail.LETTRE_PAPH,
          `${FileSystem.documentDirectory}/${fileName}`
        )
        const file = await FileSystem.getInfoAsync(downloadResult.uri)
        setDocument(file)
        setLoadingDocument(false)
      }
    })()
  }, [detail])

  useEffect(() => {
    (async () => {
      const perm = await MediaLibrary.requestPermissionsAsync()
      if (!perm.granted) return false
      if (detail.QRCODE_SOURCE) {
        const splits = detail.QRCODE_SOURCE.split('/')
        const fileName = splits[splits.length - 1]
        const downloadResult = await FileSystem.downloadAsync(
          detail.QRCODE_SOURCE,
          `${FileSystem.documentDirectory}/${fileName}`
        )
        const file = await FileSystem.getInfoAsync(downloadResult.uri)
        setQrcode(file)
        setLoadingQrcode(false)
      }
    })()
  }, [detail])
  useEffect(() => {
    (async () => {
      const perm = await MediaLibrary.requestPermissionsAsync()
      if (!perm.granted) return false
      if (detail.QRCODE_DESTINATAIRE) {
        const splits = detail.QRCODE_DESTINATAIRE.split('/')
        const fileName = splits[splits.length - 1]
        const downloadResult = await FileSystem.downloadAsync(
          detail.QRCODE_DESTINATAIRE,
          `${FileSystem.documentDirectory}/${fileName}`
        )
        const file = await FileSystem.getInfoAsync(downloadResult.uri)
        setQrcodeDest(file)
        setLoadingQrcodeDest(false)
      }
    })()
  }, [detail])


  useEffect(() => {
    (async () => {
      const perm = await MediaLibrary.requestPermissionsAsync()
      if (!perm.granted) return false
      if (detail.LETTE_ACCUSE_PAPH) {
        const splits = detail.LETTE_ACCUSE_PAPH.split('/')
        const fileName = splits[splits.length - 1]
        const downloadResult = await FileSystem.downloadAsync(
          detail.LETTE_ACCUSE_PAPH,
          `${FileSystem.documentDirectory}/${fileName}`
        )
        const file = await FileSystem.getInfoAsync(downloadResult.uri)
        setAccuse(file)
        setLoadingAccuse(false)
      }
    })()
  }, [detail])

  const openLink = async url => {
    const res = await WebBrowser.openBrowserAsync(url);
  }

  const getFileName = () => {
    if (detail.LETTRE_PAPH) {
      const splits = detail.LETTRE_PAPH.split('/')
      return splits[splits.length - 1]
    }
    return ""
  }
  const getFileNameQrcode = () => {
    if (detail.QRCODE_SOURCE) {
      const splits = detail.QRCODE_SOURCE.split('/')
      return splits[splits.length - 1]
    }
    return ""
  }
  const getFileNameQrcodeDest = () => {
    if (detail.QRCODE_DESTINATAIRE) {
      const splits = detail.QRCODE_DESTINATAIRE.split('/')
      return splits[splits.length - 1]
    }
    return ""
  }
  const getFileNameAccuse = () => {
    if (detail.LETTE_ACCUSE_PAPH) {
      const splits = detail.LETTE_ACCUSE_PAPH.split('/')
      return splits[splits.length - 1]
    }
    return ""
  }

  const openFile = async (url) => {
    try {
      const res = await WebBrowser.openBrowserAsync(document.uri);
    } catch (error) {
      console.log(error);
    }
  };
  const transfer = () => {
    navigation.navigate('TransferScreen', {
      ...route.params,
      courrier: detail
    })
  }
  const scanner = () => {
    navigation.navigate('CourrierScanSourceScreen', {
      courrier: detail
    })
  }
  const livrer = () => {
    navigation.navigate('LivrerScreen', {
      ...route.params,
      courrier: detail
    })
  }

  /**
 * fonction utilise lorsque un driver  veut signaler les problemes 
 * qu'il a eu  en cours de transmission d'un courrier
 * @author NDAYISABA  claudine <claudine@mediabox.bi>
 * @date 10/05/2023 à 11:48
 */
  const signaler = () => {
    navigation.navigate('SignaleScreen', {
      ...route.params,
    })
  }

  return (

    <>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <TouchableNativeFeedback
            style={{}}
            onPress={() => navigation.goBack()}
            background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
            <View style={styles.headerBtn}>
              <Ionicons name="arrow-back-sharp" size={24} color="#18678E" />
            </View>
          </TouchableNativeFeedback>
          <Text numberOfLines={2} style={styles.courrierCode} >
            {detail.OBJET_LETTRE}
          </Text>
        </View>
        {
          user.ID_PROFIL != 3 ?
            <View style={styles.courrierActions}>
              <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#c9c5c5', true)} onPress={() => handleEdit(courrier)}>
                <View style={{ padding: 10 }}>
                  <AntDesign name="edit" size={24} color="#18678E" />
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#c9c5c5', true)} onPress={() => supprimer()}>
                <View style={{ padding: 10 }}>
                  <Feather name="trash" size={24} color="red" />
                </View>
              </TouchableNativeFeedback>
            </View> : null

        }

      </View>
      {loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator animating size="large" color={"#777"} />
      </View> :
        <ScrollView style={{ backgroundColor: "#E1EAF3", paddingHorizontal: 10 }}>
          <View style={styles.detailCard}>
            <View style={styles.detailCardHeader}>
              <View style={styles.iconContainer}>
                <Zocial name="statusnet" size={24} color="#071E43" />
              </View>
              <Text style={styles.cardTitle}>
                Statut
              </Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.detailTitle}>Statut actuel</Text>
              <Text style={styles.detailValue}>{
                courrier.ETAPE_ID == 1 ? "en attente du remettant" :
                  courrier.ETAPE_ID == 2 ? "en attente de transmission" :
                    courrier.ETAPE_ID == 4 ? "en cours" :
                      " Transmis"}</Text>
            </View>
          </View>
          {detail.LETTE_ACCUSE_PAPH ?
            <View style={styles.detailCard}>
              <View style={styles.detailCardHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="document-attach-outline" size={24} color="#071E43" />
                </View>
                <Text style={styles.cardTitle}>
                  Accusé de réception
                </Text>
              </View>
              {loadingAccuse ? <View style={styles.detail}>
                <ActivityIndicator animating size="large" color={"#777"} />
              </View> : accuse ? <TouchableOpacity style={styles.detail} onPress={() => Linking.openURL(detail.LETTE_ACCUSE_PAPH)}>
                <Text style={styles.detailTitle} numberOfLines={1}>
                  <Ionicons name="document-outline" size={20} color="#18678E" />{getFileNameAccuse()}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.detailValue}>{getFileNameAccuse().split(".")[1].toUpperCase()} - </Text>
                  <Text style={[styles.detailValue, { color: '#333' }]}>
                    {((accuse.size / 1000) / 1000).toFixed(2)} M
                  </Text>
                </View>
              </TouchableOpacity> : null}
            </View> : null}
          <View style={styles.detailCard}>
            <View style={styles.detailCardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="document-attach-outline" size={24} color="black" />
              </View>
              <Text style={styles.cardTitle}>
                Attachement
              </Text>
            </View>
            {loadingDocument ? <View style={styles.detail}>
              <ActivityIndicator animating size="large" color={"#777"} />
            </View> : document ? <TouchableOpacity style={styles.detail} onPress={() => Linking.openURL(detail.LETTRE_PAPH)}>
              <Text style={styles.detailTitle} numberOfLines={1}>
                <Ionicons name="document-outline" size={20} color="black" />{getFileName()}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.detailValue}>{getFileName().split(".")[1].toUpperCase()} - </Text>
                <Text style={[styles.detailValue, { color: '#333' }]}>
                  {((document.size / 1000) / 1000).toFixed(2)} M
                </Text>
              </View>
            </TouchableOpacity> : null}
            {loadingQrcode ? <View style={styles.detail}>
              <ActivityIndicator animating size="large" color={"#777"} />
            </View> : qrcode &&  user.ID_PROFIL!= 3  ? <TouchableOpacity style={styles.detail} onPress={() => Linking.openURL(detail.QRCODE_SOURCE)}>
              <Text style={styles.detailTitle} numberOfLines={1}>
                <AntDesign name="qrcode" size={20} color="black" />{getFileNameQrcode()}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.detailValue}>{getFileNameQrcode()?.split(".")[1].toUpperCase()} - </Text>
                <Text style={[styles.detailValue, { color: '#333' }]}>
                  {((qrcode.size / 1000) / 1000).toFixed(3)} M
                </Text>
              </View>
            </TouchableOpacity> : null}
            {loadingQrcodeDest ? <View style={styles.detail}>
              <ActivityIndicator animating size="large" color={"#777"} />
            </View> : qrcode &&  user.ID_PROFIL!= 3  ? <TouchableOpacity style={styles.detail} onPress={() => Linking.openURL(detail.QRCODE_SOURCE)}>
              <Text style={styles.detailTitle} numberOfLines={1}>
                <AntDesign name="qrcode" size={20} color="black" />{getFileNameQrcodeDest()}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.detailValue}>{getFileNameQrcode()?.split(".")[1].toUpperCase()} - </Text>
                <Text style={[styles.detailValue, { color: '#333' }]}>
                  {((qrcodeDest.size / 1000) / 1000).toFixed(3)} M
                </Text>
              </View>
            </TouchableOpacity> : null}
          </View>
          <View style={styles.detailCard}>
            <View style={styles.detailCardHeader}>
              <View style={styles.iconContainer}>
                <Feather name="mail" size={24} color="#071E43" />
              </View>
              <Text style={styles.cardTitle}>
                Courrier
              </Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.detailTitle}>catégorie</Text>
              <Text style={styles.detailValue}>{detail.CATEFORIE_COURRIER == 1 ? 'Courrier' : "colis"}</Text>
            </View>
            {detail.CATEFORIE_COURRIER == 1 ?<View style={styles.detail}>
              <Text style={styles.detailTitle}>Type du {detail.CATEFORIE_COURRIER == 1 ? 'Courrier' : "colis"}</Text>
              <Text style={styles.detailValue}>{detail.courriertype}</Text>
            </View>:null}
            <View style={styles.detail}>
              <Text style={styles.detailTitle}>Objet du {detail.CATEFORIE_COURRIER == 1 ? 'Courrier' : "colis"}</Text>
              <Text style={styles.detailValue}>{detail.OBJET_LETTRE}</Text>
            </View>
          </View>
          <View style={styles.detailCard}>
            <View style={styles.detailCardHeader}>
              <View style={styles.iconContainer}>
                <FontAwesome name="building-o" size={24} color="#071E43" />
              </View>
              <Text style={styles.cardTitle}>
                Destinataire
              </Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.detailTitle}>Type destinataire</Text>
              <Text style={styles.detailValue}>{detail.ID_EXPEDITEUR_TYPE == 1 ? 'Personne physique' : "Personne morale"}</Text>
            </View>
            <View style={styles.detail}>
              {detail.ID_EXPEDITEUR_TYPE == 1 ? <>
                <Text style={styles.detailTitle}>Nom destinataire</Text>
                <Text style={styles.detailValue}> {detail.destinataire}</Text>
              </> : <>
                <Text style={styles.detailTitle}>Societe</Text>
                <Text style={styles.detailValue}> {detail.societes}</Text>
              </>}
            </View>
            {detail.remettant ?
              <View style={styles.detail}>
                <Text style={styles.detailTitle}>Remettant</Text>
                <Text style={styles.detailValue}>{`${detail.remettant} `}</Text>
              </View> : null
            }
          </View>

        </ScrollView>}
      <View style={styles.courrierFooter}>

        {detail.ETAPE_ID == 4 && user.ID_PROFIL == 3 ?
          <>
            <TouchableNativeFeedback onPress={scanner}>
                <View style={styles.footeractionBtn}>
                  <AntDesign name="qrcode" size={24} color="#18678E" />
                  <Text style={styles.footeractionBtnText}>
                    Scanner
                  </Text>
                </View>
              </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={signaler}>
              <View style={styles.footeractionBtn}>
                <Entypo name="megaphone" size={24} color="#18678E" />
                <Text style={styles.footeractionBtnText}>
                  Signaler un incident
                </Text>
              </View>
            </TouchableNativeFeedback></> : detail.ETAPE_ID == 1 && user.ID_PROFIL != 3 ?
            <TouchableNativeFeedback onPress={transfer}>
              <View style={styles.footeractionBtn}>
                <MaterialCommunityIcons name="share" size={24} color="#18678E" />
                <Text style={styles.footeractionBtnText}>
                  Remise à un chauffeur
                </Text>
              </View>
            </TouchableNativeFeedback> : detail.ETAPE_ID == 2 && user.ID_PROFIL == 3 ?
              <TouchableNativeFeedback onPress={scanner}>
                <View style={styles.footeractionBtn}>
                  <AntDesign name="qrcode" size={24} color="#18678E" />
                  <Text style={styles.footeractionBtnText}>
                    Scanner
                  </Text>
                </View>
              </TouchableNativeFeedback> : <TouchableNativeFeedback >
                <View style={styles.footeractionBtn}>

                </View>
              </TouchableNativeFeedback>
        }

      </View>
    </>

  )
}
const styles = StyleSheet.create({
  availableServicesContainer: {
    flex: 1,
    backgroundColor: '#171717',
    padding: 10,

  },
  document: {

  },
  separator: {
    height: 2,
    width: "90%",
    backgroundColor: COLORS.handleColor,
    alignSelf: "center",
    marginTop: 5
  },
  contains: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: "green",
    marginLeft: 15,
    alignItems: "center"
  },
  headerBtn: {
    padding: 10
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: "#18678E",
    marginHorizontal: 20
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center"
  },
  statut: {
    fontWeight: "bold",
    fontSize: 15
  },
  detailCard: {
    borderRadius: 8,
    backgroundColor: '#FFF',
    elevation: 10,
    shadowColor: '#C4C4C4',
    marginTop: 10
  },
  detailCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
    padding: 10
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#F1F1F1',
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  cardTitle: {
    fontWeight: "bold",
    marginLeft: 10,
    opacity: 0.8
  },
  iconDeatil: {
    width: 25,
    height: 25,
    borderRadius: 30,
    marginLeft: 15,
    justifyContent: "center"
  },
  text: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "bold"
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: "#fff"
  },
  availableHeader: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20
  },
  traitement: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10
  },
  titles: {
    fontWeight: "bold",
    fontSize: 20,
    paddingHorizontal: 10,
    marginLeft: 10,
    marginBottom: 10

  },
  icon: {
    width: 25,
    height: 25,
    marginHorizontal: 5,
    borderRadius: 100,
    width: 40,
    height: 40,
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonRightSide: {
    flexDirection: "row",
    alignItems: "center"
  },
  buttonLabels: {
    marginLeft: 10
  },
  buttonTitle: {
    fontWeight: "bold"
  },
  buttonDescription: {
    color: '#777',
    fontSize: 12
  },
  icons: {
    marginHorizontal: -15,
    marginTop: 25
  },

  availableTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: "bold",
    opacity: 0.9,
    marginHorizontal: 5
  },
  item: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: "red",
    opacity: 0.9
  },
  detail: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1'
  },
  detailTitle: {
    fontWeight: "bold",
    color: '#333',
    opacity: 0.9
  },
  detailValue: {
    marginTop: 2,
    color: '#555',
    fontSize: 12
  },
  typeCourrier: {
    color: COLORS.primary
  },
  TitleDetail: {
    fontSize: 20,
    fontWeight: "bold",
  },
  itemligne: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginHorizontal: 10,
    marginLeft: 10
  },
  header: {
    // marginHorizontal: 15,
    // borderRadius: 15,
    // backgroundColor: "white",
    // maxWidth: 400,
    // height: 65,
    // marginBottom: 5,
    // marginTop: 10
    marginLeft: 10
  },
  evService: {
    height: 100,
    borderRadius: 15,
    backgroundColor: '#2e2d2d',
    flexDirection: 'row',
    alignItems: "center",
    marginTop: 10,
  },
  evServiceImageContainer: {
    height: '100%',
    width: '30%'
  },
  evServiceImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15
  },
  evServiceName: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: "bold",
    paddingHorizontal: 10,
    marginLeft: 15
  },
  cardDescription: {
    marginLeft: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    marginRight: 2
    //marginHorizontal: 7
  },
  cardEntete: {
    flexDirection: "row",
    marginHorizontal: 5,
    marginTop: 10
  },
  title: {
    flexDirection: "row"
  },
  contenu: {
    color: '#fff',
  },
  contain: {
    backgroundColor: '#f2f6f7',
  },
  courrierActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  courrierCode: {
    fontWeight: 'bold',
    fontSize: 15,
    maxWidth: 200,
    color: "#18678E"
  },
  courrierFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f1f1f1'
  },
  footeractionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    flex: 1
  },
  footeractionBtnText: {
    fontWeight: 'bold',
    color: "#18678E"

  }
})