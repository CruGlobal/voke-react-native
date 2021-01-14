import React, { RefObject, useRef } from 'react';
import i18next from 'i18next';
import Menu, { MenuItem } from 'react-native-material-menu';
import languageCodes from 'i18n/languageCodes';
import Text from 'components/Text';
import Touchable from 'components/Touchable';
import VokeIcon from 'components/VokeIcon';

import styles from './styles';

interface Props { }

const LanguageSwitch = (props: Props) => {
  const languageMenuRef: RefObject<Menu> = useRef(null);
  const lang = languageCodes[i18next.language.substr(0, 2).toLowerCase()];
  const availableTranslations = i18next.languages;
  // To change language use:
  // https://www.i18next.com/overview/api#changelanguage
  // change the language
  // i18next.changeLanguage("en-US-xx");
  return (
    <>
      <Menu
        ref={languageMenuRef}
        button={
          <Text
            style={styles.settingOption}
            onPress={() => {
              languageMenuRef.current?.show();
            }}
          >
            {lang.name}{' '}
            {lang.name !== 'English' ? '(' + lang.nativeName + ')' : ''}{' '}
            <VokeIcon
              name="down-arrow"
              size={12}
              style={styles.actionReportIcon}
            />
          </Text>
        }
      >
        {availableTranslations.map(language => {
          const isCurrent =
            i18next.language === language.toUpperCase() ||
            (i18next.language === 'en-US' && language.toUpperCase() === 'EN');
          return language.toUpperCase() !== 'EN-US' ? (
            <Touchable
              onPress={(): void => {
                /* dispatch(
                setComplain({
                  messageId: item?.id,
                  adventureId: adventure.id,
                }),
              ); */
                languageMenuRef.current?.hide();
              }}
              style={[
                styles.langOption,
                {
                  backgroundColor: isCurrent
                    ? 'rgba(0,0,0,.07)'
                    : 'transparent',
                },
              ]}
            >
              <Text style={styles.langOptionText}>
                {language.toUpperCase()}
              </Text>
              {!!isCurrent && (
                <VokeIcon
                  name="checkmark-outline"
                  size={10}
                  style={styles.langOptionCheckmark}
                />
              )}
            </Touchable>
          ) : null;
        })}
      </Menu>
    </>
  );
};

export default LanguageSwitch;
