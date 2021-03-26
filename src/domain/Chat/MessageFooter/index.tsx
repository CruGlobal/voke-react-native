import ReactionPills from 'domain/Chat/ReactionPills';

import React from 'react';
import { Text, View } from 'react-native';
import DateComponent from 'components/DateComponent';

import styles from './styles';

interface Reactions {
  [emoji: string]: string[];
}

interface Props {
  date: string;
  isMyMessage: boolean;
  reactions: Reactions | undefined;
  onReaction: (newReaction: string) => void;
}

const MessageFooter = (props: Props): React.ReactElement => {
  const { date, isMyMessage, reactions, onReaction } = props;

  return (
    <View style={[styles.messageMeta]}>
      <DateComponent date={date} format="MMM D @ h:mm A" style={styles.date} />
      {reactions !== undefined && Object.keys(reactions).length !== 0 ? (
        <ReactionPills
          reactions={reactions}
          isMyMessage={isMyMessage}
          onReaction={(reaction): void => onReaction(reaction)}
        />
      ) : null}
    </View>
  );
};

export default MessageFooter;
