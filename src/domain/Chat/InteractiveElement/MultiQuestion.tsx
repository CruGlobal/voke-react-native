import Options from 'domain/Chat/Options';

import React, { ReactElement } from 'react';
import { View } from 'react-native';
import theme from 'utils/theme';
import { TAnswer } from 'utils/types';

interface Props {
  answers: TAnswer[] | undefined;
  selected: string | null;
  isComplete: boolean;
  isLocked: boolean;
  onItemSelected: (item: { value: string; label?: string | undefined }) => void;
}

const MultiQuestion = ({
  answers,
  isComplete,
  isLocked,
  selected,
  onItemSelected,
}: Props): ReactElement => {
  if (!answers || answers.length === 0) {
    // No options available for rendering.
    return <></>;
  } else {
    let formattedAnswers = answers.map(a => ({
      value: a.value,
      label: a.key,
    }));
    if (isComplete) {
      formattedAnswers = formattedAnswers.map(a => ({
        ...a,
        disabled: true,
      }));
    }

    return (
      <View
        style={{
          overflow: 'hidden',
          backgroundColor: theme.colors.white,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <Options
          options={formattedAnswers}
          selectedValue={selected}
          onUpdate={(item): void => {
            onItemSelected(item);
          }}
          isDisabled={isLocked}
        />
      </View>
    );
  }
};

export default MultiQuestion;
