import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import DrawerContent from "../components/app/DrawerContent";
import AllVolumeScreen from "../screens/volume/AllVolumeScreen";
import VolumePrepareScreen from "../screens/volume/VolumePrepareScreen";
import AllDossierArchivageScreen from "../screens/agentArchivages/AllDossierArchivageScreen";
import AllFolioNatureSupScreen from "../screens/agentSuperviseurArchivage/AllFolioNatureSupScreen";

export default function DrawerNavigator() {
          const drawr= true
          const Drawer = createDrawerNavigator()
          return (
                    <Drawer.Navigator screenOptions={{ headerShown: false ,lazy:true,unmountOnBlur:true}} useLegacyImplementation={true} drawerContent={props => <DrawerContent {...props} />}>
                              <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen}/>
                              <Drawer.Screen name='VolumePrepareScreen' component={VolumePrepareScreen} />
                              <Drawer.Screen name="AllDossierArchivageScreen" component={AllDossierArchivageScreen}/>
                              <Drawer.Screen name="AllFolioNatureSupScreen" component={AllFolioNatureSupScreen}/>
                    </Drawer.Navigator>
          )
}