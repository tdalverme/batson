import React from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Linking,
} from 'react-native';
import { useSelector } from 'react-redux';
import { selectColorMode } from '../../../../redux/reducers/colorModeReducer';

const STREAMING_IMAGES = {
  netflix: require('../../../../../assets/images/netflix-logo.png'),
  prime: require('../../../../../assets/images/amazon-logo.png'),
  disney: require('../../../../../assets/images/disney-logo.png'),
  star: require('../../../../../assets/images/star-logo.jpg'),
  hbo: require('../../../../../assets/images/hbo-logo.png'),
};

type TStreamingIcon = {
  streamingName: keyof typeof STREAMING_IMAGES;
  style?: StyleProp<ViewStyle>;
  movieLink: string;
};

const StreamingIcon = ({ streamingName, style, movieLink }: TStreamingIcon) => {
  const { colors } = useSelector(selectColorMode);

  const handleOpenLink = () => {
    Linking.openURL(movieLink);
  };

  return (
    <TouchableOpacity
      style={[styles.container, style, { backgroundColor: colors.background }]}
      onPress={handleOpenLink}>
      <Image
        source={STREAMING_IMAGES[streamingName]}
        style={styles.image}
        resizeMode={'contain'}
      />
    </TouchableOpacity>
  );
};

export default StreamingIcon;

const styles = StyleSheet.create({
  container: {
    height: 54,
    width: 54,
    borderRadius: 35,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 30,
    width: 30,
  },
});
