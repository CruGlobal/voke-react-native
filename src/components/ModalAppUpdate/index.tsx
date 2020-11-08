import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';

import Text from '../Text';
import theme from '../../theme';
import { useCheckUpdate } from '../../hooks';

// import styles from './styles';

function ModalAppUpdate(): ReactElement {
  const modalizeRef = useRef<Modalize>(null);
  const updateNeeded = useCheckUpdate();

  useEffect(() => {
    if (updateNeeded) {
      modalizeRef.current?.open();
    }
  }, [updateNeeded]);

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
          <Text>
            {updateNeeded === 'minor'
              ? 'MINOR'
              : updateNeeded === 'major'
              ? 'MAJOR'
              : 'NOT NEEDED'}
          </Text>
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
