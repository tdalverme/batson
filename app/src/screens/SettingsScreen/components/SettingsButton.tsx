import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { FONTS, FONT_SIZE } from '../../../../assets/fonts/fonts';
import { selectColorMode } from '../../../redux/reducers/colorModeReducer';

type TSettingsButton = {
  onPress: () => void;
  iconName: string;
  text: string;
  toggle?: boolean;
  toggleDefault?: boolean;
};

export const SettingsButton = ({
  onPress,
  iconName,
  text,
  toggle = false,
  toggleDefault = false,
}: TSettingsButton) => {
  const { colors } = useSelector(selectColorMode);
  const [isEnabled, setIsEnabled] = useState(toggleDefault);

  return (
    <TouchableOpacity
      onPress={toggle ? () => {} : onPress}
      style={[styles.buttonContainer]}>
      <View style={styles.descriptionContainer}>
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          color={colors.onSurfaceHighEmphasis}
        />
        <Text
          style={[styles.buttonText, { color: colors.onSurfaceHighEmphasis }]}>
          {text}
        </Text>
      </View>

      {toggle && (
        <Switch
          trackColor={{ false: '#767577', true: colors.primaryTransparent }}
          thumbColor={isEnabled ? colors.primary : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => {
            onPress();
            setIsEnabled(!isEnabled);
          }}
          value={isEnabled}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.medium,
    marginLeft: 15,
  },
});
