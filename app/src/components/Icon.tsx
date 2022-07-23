import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { selectColorMode } from '../redux/reducers/colorModeReducer';
import { preventDoubleClick } from '../utils/preventDoubleClick';

type TIcon = {
  disabled?: boolean;
  onPress?: () => void;
  uri: string;
};

export const Icon = ({ disabled, onPress, uri }: TIcon) => {
  const { colors } = useSelector(selectColorMode);

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.attachButton,
        { backgroundColor: colors.onSurfaceHighEmphasis },
      ]}
      onPress={() => onPress && preventDoubleClick(onPress)}>
      <Image source={{ uri }} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  attachButton: {
    borderRadius: 100,
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 35,
    height: 30,
    resizeMode: 'contain',
  },
});
