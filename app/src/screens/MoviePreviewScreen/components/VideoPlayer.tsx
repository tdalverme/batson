import React from 'react';
import VideoPlayer from 'react-native-video-controls';
import { useSelector } from 'react-redux';
import { selectColorMode } from '../../../redux/reducers/colorModeReducer';

type TBatsonVideoPlayer = {
  path: string;
  navigation: () => void;
};
export const BatsonVideoPlayer = React.memo(
  ({ path, navigation }: TBatsonVideoPlayer) => {
    const { colors } = useSelector(selectColorMode);

    return (
      <VideoPlayer
        poster={path}
        playInBackground={false}
        playWhenInactive={false}
        resizeMode="contain"
        paused={true}
        controls={false}
        source={{
          uri: path,
        }}
        style={{ backgroundColor: 'black' }}
        videoStyle={{ backgroundColor: 'black' }}
        seekColor={colors.primary}
        disableBack={true}
        disableFullscreen={true}
        disableVolume={true}
        navigator={navigation}
      />
    );
  },
);
