import { useState, useEffect } from 'react';
import VersionCheck from 'react-native-version-check';

const useStoreUrl = (appID: string): string => {
  const [storeUrl, setStoreUrl] = useState<string>('');

  const getStoreUrl = async (appID: string): Promise<void> => {
    const result = await VersionCheck.getStoreUrl({ appID }); // '1056168356'
    setStoreUrl(result);
  };

  useEffect(() => {
    getStoreUrl(appID);
  }, [appID]);

  return storeUrl;
};

export default useStoreUrl;
