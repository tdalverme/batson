import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Screen } from '../../components/Screen';
import { SearchBar } from './components/SearchBar';
import { useRef } from 'react';
import { useSearch } from './hooks/useSearch';
import { useSelector } from 'react-redux';
import { selectColorMode } from '../../redux/reducers/colorModeReducer';
import { BatsonIcon } from './components/BatsonIcon';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useDebounce } from '../../hooks/useDebounce';
import Results from './components/Results';

export const HomeScreen = ({ navigation }: any) => {
  const { colors } = useSelector(selectColorMode);

  const inputRef = useRef<TextInput>(null);
  const openingSearchInput = useRef(false);
  const closingSearchInput = useRef(false);

  const [searchEnabled, setSearchEnabled] = useState(false);

  const {
    search,
    loading,
    searchResponse,
    hasError,
    openingSearchAnimation,
    closingSearchAnimation,
    searchAnimationProgress,
    resetSearch,
  } = useSearch();

  const [searchText, setSearchText] = useState('');
  const debouncedValue = useDebounce<string>(searchText, 600);

  useEffect(() => {
    if (debouncedValue) {
      search(debouncedValue);
    } else if (searchResponse && searchResponse?.data.length > 0) {
      resetSearch();
    }
  }, [debouncedValue]);

  const handlePressSearchButton = () => {
    const finishOpeningAnimation = () => {
      inputRef.current?.focus();
      openingSearchInput.current = false;
    };
    if (!openingSearchInput.current) {
      if (!searchEnabled) {
        openingSearchInput.current = true;
        setSearchEnabled(true);
        openingSearchAnimation(finishOpeningAnimation);
      } else {
        handleCloseSearch();
      }
    }
  };

  const handleCloseSearch = () => {
    const finishClosingAnimation = () => {
      closingSearchInput.current = false;
    };
    if (!closingSearchInput.current && searchEnabled) {
      closingSearchInput.current = true;
      setSearchEnabled(false);
      inputRef.current?.blur();
      closingSearchAnimation(finishClosingAnimation);
    }
  };

  const onBatsonPress = () => {
    navigation.navigate('Camera');
  };

  useEffect(() => {
    return navigation.addListener('blur', () => {
      handleCloseSearch();
    });
  }, []);

  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        searchAnimationProgress.value,
        [0, 0.8, 1],
        [0, 0.1, 1],
      ),
    };
  });

  const batsonIconAnimation = useAnimatedStyle(() => {
    return {
      opacity: 1 - searchAnimationProgress.value,
      height: 170 - searchAnimationProgress.value * 170,
    };
  }, []);

  return (
    <Screen style={[styles.container, { backgroundColor: colors.background }]}>
      <BatsonIcon
        disabled={searchEnabled}
        styleContainer={batsonIconAnimation}
        onBatsonPress={onBatsonPress}
      />

      {searchEnabled && (
        <Animated.View style={[styles.searchContainer, textStyle]}>
          <Results
            loading={loading}
            data={searchResponse?.data || null}
            hasError={hasError}
          />
        </Animated.View>
      )}
      <SearchBar
        ref={inputRef}
        onChange={text => {
          setSearchText(text);
        }}
        iconName={searchEnabled ? 'close' : 'search'}
        animationProgress={searchAnimationProgress}
        onSearchPress={handlePressSearchButton}
        onSubmit={search}
        onBlur={() => {
          inputRef.current?.blur();
        }}
        value={searchText}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    alignItems: 'center',
  },
  searchContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
