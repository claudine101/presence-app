import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import DrawerContent from "../components/app/DrawerContent";
import ScanPresenceScreen from "../screens/scan/ScanPresenceScreen";
import PresenceScreen from "../screens/presence/PresenceScreen";

export default function DrawerNavigator() {
          const drawr= true
          const Drawer = createDrawerNavigator()
          return (
                    <Drawer.Navigator screenOptions={{ headerShown: false ,lazy:true,unmountOnBlur:true}} useLegacyImplementation={true} drawerContent={props => <DrawerContent {...props} />}>
                              <Drawer.Screen name="PresenceScreen" component={PresenceScreen}/>
                              <Drawer.Screen name='ScanPresenceScreen' component={ScanPresenceScreen} />
                    </Drawer.Navigator>
          )
}