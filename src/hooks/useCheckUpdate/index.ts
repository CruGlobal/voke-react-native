import { useState, useEffect } from 'react';
import VersionCheck from 'react-native-version-check';

const MAJOR_UPDATE = 'major';
const MINOR_UPDATE = 'minor';

type MajorMinor = typeof MAJOR_UPDATE | typeof MINOR_UPDATE;

const getLatestVersion = async (): Promise<string> => {
  return await VersionCheck.getLatestVersion();
};

const getCurrentVersion = (): string => {
  return VersionCheck.getCurrentVersion();
};

const getUpdateNeeded = async ({
  currentVersion,
  latestVersion,
}: {
  currentVersion: string;
  latestVersion: string;
}): Promise<MajorMinor | null> => {
  const isMajorUpdate = await VersionCheck.needUpdate({
    depth: 1,
    currentVersion,
    latestVersion,
  });

  if (isMajorUpdate.isNeeded) {
    // Major update;
    // 1.X.X => 2.X.X
    return MAJOR_UPDATE;
  }

  const isMinorUpdate = await VersionCheck.needUpdate({
    depth: 2,
    currentVersion,
    latestVersion,
  });

  if (isMinorUpdate.isNeeded) {
    // Minor update;
    // 1.1.X => 1.2.X
    return MINOR_UPDATE;
  }
  return null;
};

const useCheckUpdate = (): MajorMinor | null => {
  const [updateType, setUpdateType] = useState<MajorMinor | null>(null);

  const updateCheck = async (): Promise<void> => {
    const latestVersion = await getLatestVersion();
    const currentVersion = getCurrentVersion();
    const updateNeeded = await getUpdateNeeded({
      currentVersion,
      latestVersion,
    });
    setUpdateType(updateNeeded);
  };

  useEffect(() => {
    updateCheck();
  }, []);

  return updateType;
};

export default useCheckUpdate;
