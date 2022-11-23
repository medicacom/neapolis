import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./Redux/usersReduce";
import roleReducer from "./Redux/roleReduce";
import settingsReducer from "./Redux/settingsReduce";
import offlineReducer from "./Redux/offlineReduce";
import rootBaseReducer from "./Redux/rootBaseReduce";
import newsReducer from "./Redux/newsReduce";
import indicationReducer from "./Redux/indicationReduce";
import voix_administrationReducer from "./Redux/voix_administrationReduce";
import effet_indesirableReducer from "./Redux/effet_indesirableReduce";
import medicamentReducer from "./Redux/medicamentReduce";
import specialiteReducer from "./Redux/specialiteReduce";
import ageReducer from "./Redux/ageReduce";
export default configureStore({
  reducer: {
    users: usersReducer,
    role: roleReducer,
    settings: settingsReducer,
    offline: offlineReducer,
    rootBase: rootBaseReducer,
    news: newsReducer,
    indication: indicationReducer,
    voix_administration: voix_administrationReducer,
    effet_indesirable: effet_indesirableReducer,
    medicament: medicamentReducer,
    specialite: specialiteReducer,
    age: ageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
