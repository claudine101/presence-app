import { DrawerActions, useNavigation } from "@react-navigation/native";
import { React, useRef } from "react";
import { Image, TouchableNativeFeedback, View, Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { StyleSheet } from "react-native";
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from "../../styles/COLORS";
import { useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelector';
import { Modalize } from "react-native-modalize";
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';

export default function AppHeaderCourriersortant({ notification, modal }) {
      const user = useSelector(userSelector)
      const navigation = useNavigation()



      return (

            <>
                  <View style={styles.cardHeader}>
                        <TouchableNativeFeedback
                              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                              background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                              <View style={styles.menuOpener}>
                                    <View style={styles.menuOpenerLine} />
                                    <View style={[styles.menuOpenerLine, { width: 15 }]} />
                                    <View style={[styles.menuOpenerLine, { width: 25 }]} />
                              </View>
                        </TouchableNativeFeedback>
                        {user.ID_PROFIL == 3 ?
                              <Text style={styles.logo}>Nouveau courriers</Text> :
                              <Text style={styles.logo}>Courriers sortants</Text>
                        }
                        <TouchableOpacity  onPress={() => {
                              modal.current?.open()

                        }}>
                              <View style={{ padding: 10 }}>
                                    <Ionicons name="filter-sharp" size={25} color={COLORS.primary} />
                              </View>
                        </TouchableOpacity>
                        <TouchableNativeFeedback

                              onPress={() => navigation.navigate("NotificationScreen", { service: 1 })}
                              background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                              <View style={{padding: 5 }}>
                                    <Ionicons name="notifications-circle" size={30} color="#18678E" />
                                    {notification > 0 ? <View style={styles.badge}>
                                          <Text style={styles.badgeText} numberOfLines={1}>{notification}</Text>
                                    </View> : null}
                              </View>
                        </TouchableNativeFeedback>



                  </View >



            </>


      )
}

const styles = StyleSheet.create({
      cardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
            height: 88,
      },
      badge: {
            minWidth: 15,
            minHeight: 10,
            paddingHorizontal: 5,
            borderRadius: 10,
            backgroundColor: '#EF4255',
            position: 'absolute',
            top: 10,
            right: 5,
            justifyContent: "center",
            alignItems: "center",
      },
      badgeText: {
            textAlign: 'center',
            fontSize: 8,
            color: '#FFF',
            fontWeight: "bold"
      },
      inputCard: {
            marginHorizontal: 20,
            marginTop: 10
      },
      menuOpener: {
            padding: 10
      },
      menuOpenerLine: {
            height: 3,
            width: 30,
            backgroundColor: COLORS.primary,
            marginTop: 5,
            borderRadius: 10
      },
      imgBackground: {
            flex: 1,
            width: '100%',
            height: "100%"
      },
      logo: {
            fontSize: 16,
            fontWeight: 'bold'
      },

      selectContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            // marginHorizontal: 10,
            backgroundColor: "#fff",
            padding: 13,
            borderRadius: 5,
            borderWidth: 0.5,
            borderColor: "#777",
            marginVertical: 10
      },
      selectLabel: {
            // color: '#777',
            fontSize: 16,
            marginHorizontal: 10,
            marginBottom: 5
            // alignItems: "center",

      },
      Card1: {
            flexDirection: "row",
            justifyContent: "space-between"
      },
      button: {

            marginTop: 10,
            borderRadius: 8,
            paddingVertical: 14,
            paddingHorizontal: 8,
            backgroundColor: "#18678E",
            marginHorizontal: 2,

      },
      buttonText: {
            color: "#fff",
            fontWeight: "bold",
            // textTransform:"uppercase",
            fontSize: 16,
            textAlign: "center"
      },

})