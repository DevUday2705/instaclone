import React, { useContext } from "react";
import { GlobalDispatchContext } from "../../../state/context/GlobalContext";
const HeaderIcon = ({ Icon, name }) => {
  const dispatch = useContext(GlobalDispatchContext);
  const handleClickIcon = () => {
    if (name == "Add") {
      dispatch({
        type: "SET_IS_UPLOAD_POSTMODAL_OPEN",
        payload: {
          isUploadPostModalOpen: true,
        },
      });
    }
  };
  return (
    <div
      onClick={handleClickIcon}
      className="hover:bg-black hover:text-white transition rounded cursor-pointer p-4"
    >
      <Icon className="" size={25} />
    </div>
  );
};

export default HeaderIcon;
