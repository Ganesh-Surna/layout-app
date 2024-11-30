import { useState } from "react";

const useUUID = () => {
  const [uuid, setUUID] = useState(() => crypto.randomUUID()); //uuidv4());

  const regenerateUUID = (prefix = '') => {
    var newUUid = crypto.randomUUID();
    setUUID(prefix + newUUid);
    return prefix + newUUid;
  };

  const getUUID = (prefix = '') => {
    var newUUid = crypto.randomUUID();
    return prefix + newUUid;
  }

    // Generate a six-digit unique ID
    const generateSixDigitID = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };

  return { uuid, regenerateUUID, getUUID , generateSixDigitID};
};

export default useUUID;
