import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { FONTS, FONT_SIZE } from '../../../../assets/fonts/fonts';
import { selectColorMode } from '../../../redux/reducers/colorModeReducer';

type TSettingsSection = {
  children: React.ReactNode;
  text: string;
};

export const SettingsSection = ({ children, text }: TSettingsSection) => {
  const { colors } = useSelector(selectColorMode);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.buttonContainer,
          { borderColor: colors.onSurfaceDisabled },
        ]}>
        <Text
          style={[
            styles.buttonText,
            { color: colors.onSurfaceMediumEmphasis },
          ]}>
          {text}
        </Text>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    paddingVertical: 12,
    marginHorizontal: 20,
  },
  buttonText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.semi_small,
  },
});
