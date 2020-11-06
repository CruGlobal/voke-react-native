import React, { ReactElement, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Portal } from 'react-native-portalize';
import VersionCheck from 'react-native-version-check';
import { Modalize } from 'react-native-modalize';

import Text from '../Text';
import theme from '../../theme';

// import styles from './styles';

function ModalAppUpdate(): ReactElement {
  // Minor update;
  // 1.1.X => 1.2.X
  VersionCheck.needUpdate({
    depth: 2,
  }).then(res => {
    // res.isNeeded // true
    if (res.isNeeded) {
      // Request Minor Update.
    }
  });

  // Major update;
  // 1.X.X => 2.X.X
  VersionCheck.needUpdate({
    depth: 1,
  }).then(res => {
    // res.isNeeded // true
    if (res.isNeeded) {
      // Request Major Update.
    }
  });

  const modalizeRef = useRef<Modalize>(null);
  modalizeRef.current?.open();
  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        // modalTopOffset={height / 2}
        handlePosition={'inside'}
        /* openAnimationConfig={{
          timing: { duration: 300 },
        }} */
        onClose={(): void => {
          // Do nothing.
        }}
        rootStyle={{
          elevation: 5, // need it here to solve issue with button shadow.
        }}
        modalStyle={{
          backgroundColor: theme.colors.white,
        }}
      >
        <SafeAreaView edges={['bottom']}>
          <Text>Modal requesting app update.</Text>
          {/* <View style={styles.stepMembers}>
            <View style={styles.stepMembersHeader}>
              <Text numberOfLines={2} style={styles.modalTitle}>
                {step.name}
              </Text>
              {!!step.position && stepId !== 'graduated' && (
                <Text style={styles.modalSubTitle}>
                  {t('part')} {step.position}
                </Text>
              )}
            </View>
            <ScrollView
              style={{
                height: '100%',
              }}
              scrollIndicatorInsets={{ right: 1 }}
            >
              <FlatList
                data={step.active_messengers}
                renderItem={({ item }): React.ReactElement => (
                  <View style={styles.stepMemberItem}>
                    <Image
                      resizeMode="contain"
                      source={{ uri: item.avatar.medium }}
                      style={styles.avatar}
                    />
                    <Text style={styles.stepMemberItemText}>
                      {item.first_name} {item.last_name}
                    </Text>
                  </View>
                )}
              />
            </ScrollView>
          </View> */}
        </SafeAreaView>
      </Modalize>
    </Portal>
  );
}

export default ModalAppUpdate;
