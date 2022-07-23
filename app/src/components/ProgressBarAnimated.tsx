import React from 'react';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import { Animated } from 'react-native';
import { COLORS } from '../redux/reducers/colorModeReducer';

type TypeProgressBarAnimated = {
  step: number;
  steps: number;
  duration: number;
  height: number;
};

export const ProgressBarAnimated = React.memo(
  ({ step, steps, duration, height }: TypeProgressBarAnimated) => {
    const [width, setWidth] = useState(0);
    const animatedValue = useRef(new Animated.Value(-1000)).current;
    const [configToDo, setConfigToDo] = useState(true);

    useEffect(() => {
      if (width && configToDo) {
        //se setea el progress bar en -width antes de comenzar la animación (por única vez)
        setConfigToDo(false);
        Animated.timing(animatedValue, {
          toValue: -width,
          duration: 0,
          useNativeDriver: false,
        }).start();
      }
    }, [width]);

    useEffect(() => {
      if (!configToDo) {
        Animated.timing(animatedValue, {
          toValue: -width + (width * step) / steps,
          duration: duration,
          useNativeDriver: false,
        }).start();
      }
    }, [configToDo, step, duration]);

    return (
      <View
        onLayout={e => {
          const newWidth = e.nativeEvent.layout.width;
          setWidth(newWidth);
        }}
        style={[
          styles.container,
          {
            height,
            borderRadius: height,
            backgroundColor: COLORS.DARK.background,
          },
        ]}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              height,
              backgroundColor: COLORS.DARK.primary,
              borderRadius: height,
              transform: [
                {
                  translateX: animatedValue,
                },
              ],
            },
          ]}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: '100%',
  },
  progressBar: {
    width: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
