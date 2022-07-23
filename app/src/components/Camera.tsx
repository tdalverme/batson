import { useIsFocused } from '@react-navigation/core';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { RNCamera, RNCameraProps } from 'react-native-camera';

type TCamera = {
  children?: React.ReactNode;
  style: StyleProp<ViewStyle>;
};

type TRNCameraForwardRef = TCamera & RNCameraProps;

//TODO: agregar mensaje de que no tiene acceso a la camara para ios

export const Camera = React.forwardRef<RNCamera, TRNCameraForwardRef>(
  (props: TRNCameraForwardRef, ref) => {
    const isFocused = useIsFocused();
    return (
      <View style={props.style}>
        {isFocused ? (
          <RNCamera
            useNativeZoom
            focusable
            ref={ref}
            defaultVideoQuality={'288p'}
            type={RNCamera.Constants.Type.back}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            androidRecordAudioPermissionOptions={{
              title: 'Permission to use audio recording',
              message: 'We need your permission to use your audio',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            {...props}
          />
        ) : null}
      </View>
    );
  },
);
