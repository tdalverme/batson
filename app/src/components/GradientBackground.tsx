import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type TGradientBackground = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};
export const GradientBackground = ({
  children,
  style,
}: TGradientBackground) => {
  return (
    <>
      <LinearGradient
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 1, y: 1 }}
        colors={['#F5DEB3', 'orange']}
        style={[styles.container, style]}>
        {children}
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
