import React, { ReactElement } from 'react';
import * as Animatable from 'react-native-animatable';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import Text from 'components/Text';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './styles';

interface Props {
  canReport: boolean;
  onReport: () => void;
  onCopy: () => void;
}

const ContextActions = ({
  canReport,
  onReport,
  onCopy,
}: Props): ReactElement => {
  const { t } = useTranslation('conversations');

  return (
    <Animatable.View
      style={styles.modal}
      animation="slideInUp"
      easing="ease-in-out-quint"
      duration={700}
      delay={400}
      useNativeDriver={process.env.JEST_WORKER_ID ? false : true}
    >
      <View style={styles.actionsPanel}>
        <SafeAreaView
          edges={['bottom', 'right', 'left']}
          style={{ width: '100%', flexDirection: 'row' }}
        >
          <Pressable
            style={styles.actionButton}
            onPress={onReport}
            testID="report"
          >
            <Text
              style={[
                { opacity: canReport ? 1 : 0.5 },
                styles.actionButtonLabel,
              ]}
            >
              {t('report')}
            </Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={onCopy} testID="copy">
            <Text style={styles.actionButtonLabel}>{t('copy')}</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    </Animatable.View>
  );
};

export default ContextActions;
