import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Easing } from 'react-native-reanimated';

export type TRecordingButton = {
  onPress: () => void;
  onReady: () => void;
  onEnd: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
};

export const RecordingButton = React.memo(
  ({ onPress, onReady, onEnd, buttonStyle }: TRecordingButton) => {
    const [disabled, setDisabled] = useState(true);
    const circularProgressRef = useRef<AnimatedCircularProgress | null>(null);
    useEffect(() => {
      const animation = circularProgressRef.current?.animate(
        100,
        35000,
        Easing.linear,
      );
      const timer = setTimeout(() => {
        setDisabled(false);
        onReady?.();
      }, 5000);

      return () => {
        animation?.reset();
        clearTimeout(timer);
      };
    }, [onReady]);

    const backgroundColor = disabled ? 'grey' : 'red';

    return (
      <TouchableOpacity disabled={disabled} onPress={onPress}>
        <AnimatedCircularProgress
          ref={circularProgressRef}
          size={80}
          width={8}
          rotation={0}
          fill={100}
          tintColor="red"
          onAnimationComplete={animated => {
            animated.finished && onEnd?.();
          }}
          backgroundColor="grey"
          lineCap="round">
          {() => <View style={[buttonStyle, { backgroundColor }]} />}
        </AnimatedCircularProgress>
      </TouchableOpacity>
    );
  },
);
