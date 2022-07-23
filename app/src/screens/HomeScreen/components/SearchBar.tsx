import React from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { selectColorMode } from '../../../redux/reducers/colorModeReducer';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

const { height, width } = Dimensions.get('screen');

type TSearchBar = {
  animationProgress: Animated.SharedValue<number>;
  onSearchPress: () => void;
  onSubmit: (query: string) => void;
  onChange: (text: string) => void;
  onBlur: () => void;
  value?: string;
  iconName: 'search' | 'close';
};

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export const SearchBar = React.forwardRef(
  (
    {
      animationProgress,
      onSearchPress,
      onSubmit,
      onChange,
      value,
      iconName,
      onBlur,
    }: TSearchBar,
    ref: React.Ref<TextInput>,
  ) => {
    const { colors } = useSelector(selectColorMode);
    const animatedStylesContainer = useAnimatedStyle(() => {
      return {
        top: interpolate(animationProgress.value, [0, 1], [height * 0.6, 25]),
      };
    });

    const animatedStylesBar = useAnimatedStyle(() => {
      return {
        width: interpolate(
          animationProgress.value,
          [0, 0.3, 1],
          [60, width / 2, width - 20],
        ),
      };
    });

    return (
      <Animated.View style={[styles.container, animatedStylesContainer]}>
        <Animated.View
          style={[
            styles.animatedContainer,
            styles.backgroundShared,
            animatedStylesBar,
            { backgroundColor: colors.surface_dp2 },
          ]}>
          <TextInput
            ref={ref}
            style={[styles.input, { color: colors.onSurfaceMediumEmphasis }]}
            clearButtonMode="always"
            value={value}
            blurOnSubmit={true}
            onChangeText={onChange}
            onBlur={onBlur}
            onSubmitEditing={e => {
              onSubmit(e.nativeEvent.text);
            }}
          />

          <TouchableOpacity
            onPress={() => {
              onSearchPress();
            }}
            style={[
              styles.backgroundShared,
              styles.iconContainer,
              { backgroundColor: colors.surface_dp2 },
            ]}>
            <AnimatedIcon
              name={iconName}
              size={32}
              color={colors.onSurfaceMediumEmphasis}
            />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
  },
  animatedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingRight: 60,
  },
  iconContainer: {
    width: 60,
    position: 'absolute',
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundShared: {
    height: 60,
    borderRadius: 30,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 1.5,
    elevation: 1,
  },
  input: {
    width: '100%',
    paddingLeft: 20,
  },
});
