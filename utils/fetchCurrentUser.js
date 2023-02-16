import { doc, getDoc } from "firebase/firestore";
import { useContext } from "react";
import { auth, db } from "../lib/firebase";
import {
  GlobalContext,
  GlobalDispatchContext,
} from "../state/context/GlobalContext";

const useFetchCurrentUser = () => {
  const dispatch = useContext(GlobalDispatchContext);
  const { isAuthenticated, isOnboarded, isLoading } = useContext(GlobalContext);

  const fetchUser = async () => {
    if (!auth?.currentUser?.email) return;
    // Find user Info with the help of ID or eMail
    const currentUserRef = doc(db, "users", auth?.currentUser?.email);
    const currentUserSnap = await getDoc(currentUserRef);

    if (currentUserSnap.exists()) {
      return currentUserSnap.data();
    } else {
      return null;
    }
  };
  return { fetchUser };
};

export default useFetchCurrentUser;
