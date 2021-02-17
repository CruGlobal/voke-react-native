import TextQuestion from 'domain/Chat/InteractiveElement/TextQuestion';

import React, { useState, useEffect } from 'react';
import { getCurrentUserId } from 'utils/get';
import { TAdventureSingle, TMessage, TStep } from 'utils/types';
import { createAdventureStepMessage } from 'actions/requests';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';

import MultiQuestion from './MultiQuestion';
import BinaryQuestion from './BinaryQuestion';

interface Props {
  kind: TStep['kind'];
  adventure: TAdventureSingle;
  step: TStep;
  internalMessage?: TMessage;
  defaultValue: string;
  onFocus: () => void;
}

const InteractiveElement = ({
  kind,
  adventure,
  step,
  internalMessage,
  defaultValue,
  onFocus,
}: Props): React.ReactElement => {
  const dispatch = useDispatch();
  const userId = getCurrentUserId();
  const [value, setValue] = useState(defaultValue || null);
  const [messageSent, setMesssageSent] = useState(false);
  const isLocked = step && step['completed_by_messenger?'];
  const isComplete = step?.status === 'completed';
  const isMultiQuestion = kind === 'multi';
  const isShareQuestion = kind === 'share';
  const isBinaryQuestion = kind === 'binary';

  const currentMessages = useSelector(
    ({ data }: RootState) => data.adventureStepMessages[step?.id] || [],
  );

  // In case component rendered before default/current value
  // fetched from the server.
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (!currentMessages.length) {
      setMesssageSent(false);
    } else if (isComplete || value) {
      setMesssageSent(true);
    } else {
      for (const [, msg] of Object.entries(currentMessages)) {
        if (
          msg.messenger_id === userId &&
          !msg?.metadata?.question &&
          msg?.kind !== 'answer'
        ) {
          setMesssageSent(true);
          break;
        }
      }
    }
  }, [currentMessages, currentMessages.length, isComplete, userId, value]);

  // When SEND message button clicked.
  const handleSendMessage = (newValue: string): void => {
    setMesssageSent(true);
    dispatch(
      createAdventureStepMessage({
        adventure,
        step,
        value: newValue,
        internalMessage: internalMessage ? internalMessage : null,
        kind,
        userId,
      }),
    );
  };

  // Question with multiply options.
  if (isMultiQuestion) {
    const answers = internalMessage
      ? internalMessage?.metadata?.answers
      : step?.metadata?.answers;
    return (
      <MultiQuestion
        answers={answers}
        isComplete={isComplete}
        isLocked={isLocked}
        selected={value}
        onItemSelected={(item): void => {
          setValue(item.label || '');
          handleSendMessage(item.value);
        }}
      />
    );
  }

  // Question with two options or request to share decision.
  if ((isBinaryQuestion && internalMessage?.metadata) || isShareQuestion) {
    return (
      <BinaryQuestion
        metadata={internalMessage?.metadata}
        onValueSelected={(val): void => {
          setValue(val);
          handleSendMessage(val);
        }}
        isShareRequest={isShareQuestion}
      />
    );
  }

  // Regular.
  return (
    <TextQuestion
      messageSent={messageSent}
      isComplete={isComplete}
      onFocus={onFocus}
      value={value}
      sendMessage={(val): void => handleSendMessage(val)}
    />
  );
};

export default InteractiveElement;
