import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import { useSelector } from "react-redux";
import DrawerContent from "../components/app/DrawerContent";
import AllVolumeScreen from "../screens/preparation/AllVolumeScreen";
import AgentPreparationFolioScreen from "../screens/preparation/AgentPreparationFolioScreen";
import FolioRetourScreen from "../screens/preparation/FolioRetourScreen";
import AgentSuperviseurScreen from "../screens/preparation/AgentSuperviseurScreen";
import ChefPlateauScreen from "../screens/preparation/ChefPlateauScreen";
import AgentSuperviseurAileScreen from "../screens/preparation/AgentSuperviseurAileScreen";
import AllVolumeDetaillerScreen from "../screens/preparation/AllVolumeDetaillerScreen";
import { userSelector } from "../store/selectors/userSelector";
import AgentChefPlateauRetourScreen from "../screens/retour/AgentChefPlateauRetourScreen";
import AgentSuperiveurAilleRetourScreen from "../screens/retour/AgentSuperiveurAilleRetourScreen";
import AgentDesarchivagesRetourScreen from "../screens/retour/AgentDesarchivagesRetourScreen";
import AgentSupArchiveRetourScreen from "../screens/retour/AgentSupArchiveRetourScreen";
import AgentDistributionRetourScreen from "../screens/retour/AgentDistributionRetourScreen";
import PROFILS from "../constants/PROFILS";
import IndexationChefEquipeFolioScreen from "../screens/indexation/chefEquipe/IndexationChefEquipeFolioScreen";
import ChefPlateauFlashScreen from "../screens/indexation/chefPlateau/ChefPlateauFlashScreen";
import ChefPlateauFlashRetourScreen from "../screens/indexation/chefPlateau/ChefPlateauFlashRetourScreen";
import ChefPlateauFlashValidesScreen from "../screens/indexation/chefPlateau/ChefPlateauFlashValidesScreen";
import SupFlashRetourScreen from "../screens/indexation/supAile/SupFlashRetourScreen";
import SupFlashScreen from "../screens/indexation/supAile/SupFlashScreen";
import SupFlashValidesScreen from "../screens/indexation/supAile/SupFlashValidesScreen";
import ChefEquipeFlashRetourScreen from "../screens/indexation/chefEquipe/ChefEquipeFlashRetourScreen";
import ChefEquipeFlashValidesScreen from "../screens/indexation/chefEquipe/ChefEquipeFlashValidesScreen";

export default function DrawerNavigator() {
        const drawr = true
        const user = useSelector(userSelector)
        const Drawer = createDrawerNavigator()
        return (
                <Drawer.Navigator screenOptions={{ headerShown: false, lazy: true, unmountOnBlur: true }} useLegacyImplementation={true} drawerContent={props => <DrawerContent {...props} />}>
                        {(user.ID_PROFIL == PROFILS.CHEF_DIVISION_ARCHIGES) ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == PROFILS.AGENTS_DESARCHIVAGES ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                </>
                                : null}

                        {user.ID_PROFIL == PROFILS.AGENTS_SUPERVISEUR_ARCHIVE ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="AllVolumeDetaillerScreen" component={AllVolumeDetaillerScreen} />
                                </>
                                : null}
                        {(user.ID_PROFIL == PROFILS.AGENTS_DISTRIBUTEUR) ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == PROFILS.CHEF_PLATEAU ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="AgentSuperviseurScreen" component={AgentSuperviseurScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == PROFILS.AGENTS_SUPERVISEUR_AILE ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="ChefPlateauScreen" component={ChefPlateauScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="AgentPreparationFolioScreen" component={AgentPreparationFolioScreen} />
                                        <Drawer.Screen name="FolioRetourScreen" component={FolioRetourScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == PROFILS.CHEF_EQUIPE ?
                                <>
                                        <Drawer.Screen name="AgentSuperviseurAileScreen" component={AgentSuperviseurAileScreen} />
                                </>
                                : null}
                                {user.ID_PROFIL == PROFILS.CHEF_EQUIPE_INDEXATION ?
                                <>
                                <Drawer.Screen name="IndexationChefEquipeFolioScreen" component={IndexationChefEquipeFolioScreen} />
                                <Drawer.Screen name="ChefEquipeFlashRetourScreen" component={ChefEquipeFlashRetourScreen} />
                                <Drawer.Screen name="ChefEquipeFlashValidesScreen" component={ChefEquipeFlashValidesScreen} />
                                </>
                                : null}
                                {user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR_AILE_INDEXATION ?
                                        <>
                                                <Drawer.Screen name="SupFlashScreen" component={SupFlashScreen} />
                                                <Drawer.Screen name="SupFlashRetourScreen" component={SupFlashRetourScreen} />
                                                <Drawer.Screen name="SupFlashValidesScreen" component={SupFlashValidesScreen} />
                                        </>
                              : null}
                              {user.ID_PROFIL == PROFILS.CHEF_PLATEAU_INDEXATION ?
                                      <>
                                              <Drawer.Screen name="ChefPlateauFlashScreen" component={ChefPlateauFlashScreen} />
                                              <Drawer.Screen name="ChefPlateauFlashRetourScreen" component={ChefPlateauFlashRetourScreen} />
                                              <Drawer.Screen name="ChefPlateauFlashValidesScreen" component={ChefPlateauFlashValidesScreen} />
                                      </>
                            : null}
                        <Drawer.Screen name="AllFolioSupAgentScreen" component={AllFolioSupAgentScreen} />
                        <Drawer.Screen name="AgentSupPhasePreparationRetourScreen" component={AgentSupPhasePreparationRetourScreen} />
                </Drawer.Navigator>
        )
}