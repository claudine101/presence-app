import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import { useSelector } from "react-redux";
import DrawerContent from "../components/app/DrawerContent";
import AllVolumeScreen from "../screens/preparation/AllVolumeScreen";
import AgentPreparationFolioScreen from "../screens/preparation/AgentPreparationFolioScreen";
import FolioRetourScreen from "../screens/preparation/FolioRetourScreen";
import AgentSuperviseurScreen from "../screens/preparation/AgentSuperviseurScreen";
import AgentSuperviseurValideScreen from "../screens/preparation/AgentSuperviseurValideScreen";
import ChefPlateauScreen from "../screens/preparation/ChefPlateauScreen";
import AgentSuperviseurAileScreen from "../screens/preparation/AgentSuperviseurAileScreen";
import AllVolumeDetaillerScreen from "../screens/preparation/AllVolumeDetaillerScreen";
import FolioRetouPrepareScreen from "../screens/preparation/FolioRetouPrepareScreen";
import AllVolumeChefPlateauValidesScreen from "../screens/preparation/AllVolumeChefPlateauValidesScreen";
import AllVolumeDesarchiveSreen from "../screens/preparation/AllVolumeDesarchiveSreen";





import { userSelector } from "../store/selectors/userSelector";
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

import AllFolioRecusScanScreen from "../screens/scanning/agentSuperviseur/AllFolioRecusScanScreen";
import AllFolioEquipeRetourScreen from "../screens/scanning/agentSuperviseur/retour/AllFolioEquipeRetourScreen";
import AllFoliosSuperviseurPvScreen from "../screens/scanning/agentSuperviseur/retour/AllFoliosSuperviseurPvScreen";
import AllVolumeFolioRetourSupAilleScreen from "../screens/scanning/agentSuperviseur/retourAgSupAille/AllVolumeFolioRetourSupAilleScreen";
import AllVolumeRecusChefEquiScreen from "../screens/scanning/chefEquipe/AllVolumeRecusChefEquiScreen";
import VolumeEnEttenteChefEquipeScreen from "../screens/scanning/chefEquipe/VolumeEnEttenteChefEquipeScreen";

// phase uploadEDMS
import ChefEquipeFlashValideScreen from "../screens/uploadEDRMS/chefEquipe/ChefEquipeFlashValideScreen";
import ChefEquipeFlashsRetourScreen from "../screens/uploadEDRMS/chefEquipe/ChefEquipeFlashsRetourScreen";
import AgentFlashScreen from "../screens/uploadEDRMS/agentUpload/AgentFlashScreen";
import FolioUploadScreen from "../screens/uploadEDRMS/agentUpload/FolioUploadScreen";
import VerificateurFlashScreen from "../screens/uploadEDRMS/verificateur/VerificateurFlashScreen";
import FolioEnregistreScreen from "../screens/uploadEDRMS/verificateur/FolioEnregistreScreen";
import FolioNoEnregistreScreen from "../screens/uploadEDRMS/verificateur/FolioNoEnregistreScreen";
import ChefEquipeFlashUploadScreen from "../screens/uploadEDRMS/chefEquipe/ChefEquipeFlashUploadScreen";
import FolioInvalideScreen from "../screens/uploadEDRMS/agentUpload/FolioInvalideScreen";
import AllVolumeSuperviseScreen from "../screens/preparation/AllVolumeSuperviseScreen";
import AllVolumeDistribueSreen from "../screens/preparation/AllVolumeDistribueSreen";
import AllIncidentsDeclarerScreen from "../incidents/AllIncidentsDeclarerScreen";
import AgentSupAileScreen from "../screens/preparation/retourPreparation/AgentSupAileScreen";
import VolumeRetourneScreen from "../screens/preparation/retourPreparation/VolumeRetourneScreen";
import ChefPlateauRetourneScreen from "../screens/preparation/retourPreparation/ChefPlateauRetourneScreen";
import AgentSuperviseurRetourPhaseScreen from "../screens/preparation/AgentSuperviseurRetourPhaseScreen";
import AgentPreparationFolioRetourneScreen from "../screens/preparation/AgentPreparationFolioRetourneScreen";
import FolioRetourneScreen from "../screens/preparation/FolioRetourneScreen";
import AgentSuperviseurReValideScreen from "../screens/preparation/AgentSuperviseurReValideScreen";
import ChefPlateauValideRetourneScreen from "../screens/preparation/ChefPlateauValideRetourneScreen";
import AgentSupRetourneScreen from "../screens/preparation/AgentSupRetourneScreen";
import AgentSupRetraiteScreen from "../screens/preparation/AgentSupRetraiteScreen";
import FoliosNonScanNonReconcilierScreen from "../screens/scanning/agentSuperviseur/retour/FoliosNonScanNonReconcilierScreen";
import VolumeFoliosNonInvalidePlatoScreen from "../screens/scanning/chefEquipe/VolumeFoliosNonInvalidePlatoScreen";
import AllSuperviseurAileScanVolumeScreen from "../screens/scanning/agentSuperviseur/retourAgSupAille/AllSuperviseurAileScanVolumeScreen";
import AllVolumeReenvoyerRecusScreen from "../screens/scanning/reenvoyerVolumeFolios/AllVolumeReenvoyerRecusScreen";
import AllVolumeReenvoyezRetournerScreen from "../screens/scanning/reenvoyerVolumeFolios/AllVolumeReenvoyezRetournerScreen";
import AllRetourFoliosReenvoyezSupScreen from "../screens/scanning/reenvoyerVolumeFolios/retourSupScanning/AllRetourFoliosReenvoyezSupScreen";
import FoliosReenvoyezTraitesScreen from "../screens/scanning/reenvoyerVolumeFolios/retourSupScanning/FoliosReenvoyezTraitesScreen";
import ChePlateauVolReenvoyerTraitesScreen from "../screens/scanning/reenvoyerVolumeFolios/retourSupScanning/ChePlateauVolReenvoyerTraitesScreen";


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
                                        <Drawer.Screen name="AllVolumeDesarchiveSreen" component={AllVolumeDesarchiveSreen} />
                                        <Drawer.Screen name="AllVolumeFolioRetourSupAilleScreen" component={AllVolumeFolioRetourSupAilleScreen} />
                                        <Drawer.Screen name="VolumeEnEttenteChefEquipeScreen" component={VolumeEnEttenteChefEquipeScreen} />
                                        <Drawer.Screen name="AllVolumeReenvoyezRetournerScreen" component={AllVolumeReenvoyezRetournerScreen} />
                                        <Drawer.Screen name="ChePlateauVolReenvoyerTraitesScreen" component={ChePlateauVolReenvoyerTraitesScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == PROFILS.AGENTS_SUPERVISEUR_ARCHIVE ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="AllVolumeDetaillerScreen" component={AllVolumeDetaillerScreen} />
                                        <Drawer.Screen name="AllVolumeSuperviseScreen" component={AllVolumeSuperviseScreen} />
                                        <Drawer.Screen name="AllVolumeFolioRetourSupAilleScreen" component={AllVolumeFolioRetourSupAilleScreen} />
                                        <Drawer.Screen name="VolumeEnEttenteChefEquipeScreen" component={VolumeEnEttenteChefEquipeScreen} />
                                        <Drawer.Screen name="AllVolumeReenvoyezRetournerScreen" component={AllVolumeReenvoyezRetournerScreen} />
                                        <Drawer.Screen name="ChePlateauVolReenvoyerTraitesScreen" component={ChePlateauVolReenvoyerTraitesScreen} />
                                </>
                                : null}
                        {(user.ID_PROFIL == PROFILS.AGENTS_DISTRIBUTEUR) ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="AllVolumeDistribueSreen" component={AllVolumeDistribueSreen} />
                                        <Drawer.Screen name="AllVolumeFolioRetourSupAilleScreen" component={AllVolumeFolioRetourSupAilleScreen} />
                                        <Drawer.Screen name="VolumeEnEttenteChefEquipeScreen" component={VolumeEnEttenteChefEquipeScreen} />
                                        <Drawer.Screen name="AllVolumeReenvoyezRetournerScreen" component={AllVolumeReenvoyezRetournerScreen} />
                                        <Drawer.Screen name="ChePlateauVolReenvoyerTraitesScreen" component={ChePlateauVolReenvoyerTraitesScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == PROFILS.CHEF_PLATEAU ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="AgentSuperviseurScreen" component={AgentSuperviseurScreen} />
                                        <Drawer.Screen name="AgentSuperviseurValideScreen" component={AgentSuperviseurValideScreen} />
                                        <Drawer.Screen name="VolumeRetourneScreen" component={VolumeRetourneScreen} />
                                        <Drawer.Screen name="AgentSuperviseurRetourPhaseScreen" component={AgentSuperviseurRetourPhaseScreen} />
                                        <Drawer.Screen name="AgentSuperviseurReValideScreen" component={AgentSuperviseurReValideScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == PROFILS.AGENTS_SUPERVISEUR_AILE ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="VolumeRetourneScreen" component={VolumeRetourneScreen} />
                                        <Drawer.Screen name="ChefPlateauScreen" component={ChefPlateauScreen} />
                                        <Drawer.Screen name="AllVolumeChefPlateauValidesScreen" component={AllVolumeChefPlateauValidesScreen} />
                                        <Drawer.Screen name="ChefPlateauRetourneScreen" component={ChefPlateauRetourneScreen} />
                                        <Drawer.Screen name="ChefPlateauValideRetourneScreen" component={ChefPlateauValideRetourneScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="AgentPreparationFolioScreen" component={AgentPreparationFolioScreen} />
                                        <Drawer.Screen name="FolioRetourScreen" component={FolioRetourScreen} />
                                        <Drawer.Screen name="FolioRetouPrepareScreen" component={FolioRetouPrepareScreen} />
                                        <Drawer.Screen name="VolumeRetourneScreen" component={VolumeRetourneScreen} />
                                        <Drawer.Screen name="AgentPreparationFolioRetourneScreen" component={AgentPreparationFolioRetourneScreen} />
                                        <Drawer.Screen name="FolioRetourneScreen" component={FolioRetourneScreen} />
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
                        {user.ID_PROFIL == PROFILS.CHEF_EQUIPE ?
                                <>
                                        <Drawer.Screen name="AgentSuperviseurAileScreen" component={AgentSuperviseurAileScreen} />
                                        <Drawer.Screen name="AllVolumeRecusChefEquiScreen" component={AllVolumeRecusChefEquiScreen} />
                                        <Drawer.Screen name="VolumeEnEttenteChefEquipeScreen" component={VolumeEnEttenteChefEquipeScreen} />
                                        <Drawer.Screen name="AgentSupAileScreen" component={AgentSupAileScreen} />
                                        <Drawer.Screen name="AgentSupRetourneScreen" component={AgentSupRetourneScreen} />
                                        <Drawer.Screen name="AgentSupRetraiteScreen" component={AgentSupRetraiteScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR_AILE_SCANNING ?
                                <>
                                        <Drawer.Screen name="AllVolumeRecusChefEquiScreen" component={AllVolumeRecusChefEquiScreen} />
                                        <Drawer.Screen name="AllVolumeReenvoyerRecusScreen" component={AllVolumeReenvoyerRecusScreen} />
                                        <Drawer.Screen name="AllVolumeFolioRetourSupAilleScreen" component={AllVolumeFolioRetourSupAilleScreen} />
                                        <Drawer.Screen name="AllVolumeReenvoyezRetournerScreen" component={AllVolumeReenvoyezRetournerScreen} />
                                        <Drawer.Screen name="VolumeEnEttenteChefEquipeScreen" component={VolumeEnEttenteChefEquipeScreen} />
                                        <Drawer.Screen name="ChePlateauVolReenvoyerTraitesScreen" component={ChePlateauVolReenvoyerTraitesScreen} />
                                </> : null}
                        {
                                user.ID_PROFIL == PROFILS.CHEF_PLATEAU_SCANNING ?
                                        <>
                                                <Drawer.Screen name="AllVolumeRecusChefEquiScreen" component={AllVolumeRecusChefEquiScreen} />
                                                <Drawer.Screen name="AllVolumeReenvoyerRecusScreen" component={AllVolumeReenvoyerRecusScreen} />
                                                <Drawer.Screen name="AllFolioEquipeRetourScreen" component={AllFolioEquipeRetourScreen} />
                                                <Drawer.Screen name="AllVolumeReenvoyezRetournerScreen" component={AllVolumeReenvoyezRetournerScreen} />
                                                <Drawer.Screen name="VolumeEnEttenteChefEquipeScreen" component={VolumeEnEttenteChefEquipeScreen} />
                                                <Drawer.Screen name="ChePlateauVolReenvoyerTraitesScreen" component={ChePlateauVolReenvoyerTraitesScreen} />
                                                <Drawer.Screen name="VolumeFoliosNonInvalidePlatoScreen" component={VolumeFoliosNonInvalidePlatoScreen} />      
                                        </>
                                        : null}

                        {user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR_SCANNING ?
                                <>
                                        <Drawer.Screen name="AllFolioRecusScanScreen" component={AllFolioRecusScanScreen} />
                                        <Drawer.Screen name="AllVolumeReenvoyerRecusScreen" component={AllVolumeReenvoyerRecusScreen} />
                                        <Drawer.Screen name="AllFolioEquipeRetourScreen" component={AllFolioEquipeRetourScreen} />
                                        <Drawer.Screen name="AllRetourFoliosReenvoyezSupScreen" component={AllRetourFoliosReenvoyezSupScreen} />
                                        <Drawer.Screen name="AllFoliosSuperviseurPvScreen" component={AllFoliosSuperviseurPvScreen} />
                                        <Drawer.Screen name="FoliosReenvoyezTraitesScreen" component={FoliosReenvoyezTraitesScreen} />
                                        <Drawer.Screen name="VolumeFoliosNonInvalidePlatoScreen" component={VolumeFoliosNonInvalidePlatoScreen} />
                                </>
                                : null}
                        {(user.ID_PROFIL == PROFILS.CHEF_EQUIPE_SCANNING) ?
                                <>
                                        <Drawer.Screen name="AllSuperviseurAileScanVolumeScreen" component={AllSuperviseurAileScanVolumeScreen} />
                                        <Drawer.Screen name="AllVolumeReenvoyezRetournerScreen" component={AllVolumeReenvoyezRetournerScreen} />
                                        <Drawer.Screen name="AllVolumeFolioRetourSupAilleScreen" component={AllVolumeFolioRetourSupAilleScreen} />
                                        <Drawer.Screen name="ChePlateauVolReenvoyerTraitesScreen" component={ChePlateauVolReenvoyerTraitesScreen} />
                                        <Drawer.Screen name="VolumeEnEttenteChefEquipeScreen" component={VolumeEnEttenteChefEquipeScreen} />  
                                </>
                                : null}

                        {/*phase uplad EDMS*/}
                        {user.ID_PROFIL == PROFILS.CHEF_EQUIPE_PHASE_UPLOAD ?
                                <>
                                        <Drawer.Screen name="ChefEquipeFlashValideScreen" component={ChefEquipeFlashValideScreen} />
                                        <Drawer.Screen name="ChefEquipeFlashsRetourScreen" component={ChefEquipeFlashsRetourScreen} />
                                        <Drawer.Screen name="ChefEquipeFlashUploadScreen" component={ChefEquipeFlashUploadScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == PROFILS.AGENT_UPLOAD_EDRMS ?
                                <>
                                        <Drawer.Screen name="AgentFlashScreen" component={AgentFlashScreen} />
                                        <Drawer.Screen name="FolioUploadScreen" component={FolioUploadScreen} />
                                        <Drawer.Screen name="FolioInvalideScreen" component={FolioInvalideScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == PROFILS.VERIFICATEUR_UPLOAD ?
                                <>
                                        <Drawer.Screen name="VerificateurFlashScreen" component={VerificateurFlashScreen} />
                                        <Drawer.Screen name="FolioEnregistreScreen" component={FolioEnregistreScreen} />
                                        <Drawer.Screen name="FolioNoEnregistreScreen" component={FolioNoEnregistreScreen} />

                                </>
                                : null}
                         <Drawer.Screen name="AllIncidentsDeclarerScreen" component={AllIncidentsDeclarerScreen} />
                </Drawer.Navigator>
        )
}