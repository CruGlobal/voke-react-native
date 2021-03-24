import Message from 'domain/Chat/Message';

import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { TMessage } from 'utils/types';

interface Props {
  messages: TMessage[];
  adventureId: string;
  stepId: string;
  skipMessages?: string[];
  onFocus: (answerPosY: number) => void;
}

const Conversation = (props: Props): React.ReactElement => {
  const { messages, adventureId, stepId, skipMessages = [], onFocus } = props;
  const [contextActive, setContextActive] = useState<string | null>(null);

  return (
    <>
      {!!contextActive && (
        <Pressable
          style={{
            position: 'absolute',
            top: -1000,
            bottom: -1000,
            left: -1000,
            right: -1000,
            zIndex: 1,
          }}
          testID="contextOffAndroid"
          onPressIn={(): void => {
            setContextActive(null);
          }}
        />
      )}

      {messages.map((item, index) => {
        if (item && !skipMessages.includes(item?.id)) {
          return (
            <Message
              key={item.id}
              adventureId={adventureId}
              stepId={stepId}
              item={item}
              next={messages[index + 1] ? messages[index + 1] : null}
              previous={messages[index - 1] ? messages[index - 1] : null}
              onFocus={(posY): void => {
                onFocus(posY);
              }}
              contextActive={contextActive}
              setContextActive={(newVal): void => {
                setContextActive(newVal);
              }}
            />
          );
        }
      })}
    </>
  );
};

export default Conversation;
