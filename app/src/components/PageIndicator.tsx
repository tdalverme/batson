import React from 'react';
import { useWindowDimensions } from 'react-native';
import { StyleSheet, View, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { selectColorMode } from '../redux/reducers/colorModeReducer';

type TPageIndicator = {
  data: unknown[];
  scrollX: Animated.Value;
};

const PageIndicator = ({ scrollX, data }: TPageIndicator) => {
  const { width } = useWindowDimensions();
  const { colors } = useSelector(selectColorMode);

  return (
    <View style={styles.container}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: 'clamp',
        });

        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: [
            colors.onSurfaceDisabled,
            colors.primary,
            colors.onSurfaceDisabled,
          ],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            style={[styles.indicator, { width: dotWidth, backgroundColor }]}
            key={i.toString()}
          />
        );
      })}
    </View>
  );
};

export default PageIndicator;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  indicator: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
  },
});
