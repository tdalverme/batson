import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Screen } from '../../../components/Screen';
import { MovieTabInfoContext } from '../../../context/MovieInfoTabContext';
import YoutubePlayer from 'react-native-youtube-iframe';

export const TrailerScreen = () => {
  const { movieTabInfo } = useContext(MovieTabInfoContext);
  
  return (
    <Screen style={styles.screenStyle}>
      {!!movieTabInfo?.videoYoutubeId && (
        <YoutubePlayer
          height={400}
          videoId={movieTabInfo.videoYoutubeId}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  screenStyle: {
    justifyContent: 'center',
    flex: 1,
  },
  youtube: {
    flex: 1,
  },
});
