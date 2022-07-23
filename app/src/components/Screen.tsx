import React from 'react';
import {
  View,
  ActivityIndicator,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useSelector } from 'react-redux';
import { selectColorMode } from '../redux/reducers/colorModeReducer';

type TScreen = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
};
export const Screen = ({ children, style, loading = false }: TScreen) => {
  const { colors } = useSelector(selectColorMode);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }, style]}>
      {loading ? (
        <View style={styles.fullScreen}>
          <ActivityIndicator
            style={styles.indicator}
            size={'small'}
            color={colors.primary}
          />
        </View>
      ) : (
        children
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreen: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    alignSelf: 'center',
  },
});
