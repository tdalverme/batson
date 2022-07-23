import React, { useEffect } from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withRepeat,
  interpolate,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { selectColorMode } from '../../../redux/reducers/colorModeReducer';

type TypeBatsonIcon = {
  disabled: boolean;
  styleContainer: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;
  onBatsonPress: () => void;
};

export const BatsonIcon = ({
  disabled,
  onBatsonPress,
  styleContainer,
}: TypeBatsonIcon) => {
  const { colors } = useSelector(selectColorMode);

  const mountProgress = useSharedValue(0);
  const size = useSharedValue(0);

  useEffect(() => {
    mountProgress.value = withTiming(1, {
      duration: 600,
    });
  }, [mountProgress]);

  useEffect(() => {
    size.value = withRepeat(
      withTiming(1, {
        duration: 1300,
      }),
      -1,
      true,
    );
  }, [size]);

  const animationOnMount = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: -600 + mountProgress.value * 600 },
        { scale: 1 + size.value * 0.05 },
        {
          rotate: `${
            interpolate(mountProgress.value, [0, 1], [0.5, 1]) * 2 * Math.PI
          }rad`,
        },
      ],
    };
  }, []);

  return (
    <Animated.View style={[animationOnMount, styleContainer]}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => onBatsonPress()}
        disabled={disabled}>
        <MaterialCommunityIcons
          name="lightning-bolt"
          size={120}
          color={colors.background}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 170,
    height: 170,
    width: 170,
  },
});
