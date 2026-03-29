import type { PropsWithChildren, ReactElement } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";

const HEADER_HEIGHT = 200;
const MIN_HEADER_HEIGHT = Platform.OS === "ios" ? 88 : 64;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme() ?? "light";
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollOffset.value,
      [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
      [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      scrollOffset.value,
      [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
      [1.5, 1, 1],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      scrollOffset.value,
      [0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
      [1, 0.5, 0],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollOffset.value,
      [0, HEADER_HEIGHT - MIN_HEADER_HEIGHT],
      [HEADER_HEIGHT, MIN_HEADER_HEIGHT],
      Extrapolation.CLAMP,
    );

    return {
      height,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.headerOverlay,
          overlayStyle,
          { backgroundColor: headerBackgroundColor[colorScheme] },
        ]}
      >
        <Animated.View style={[styles.headerImage, headerAnimatedStyle]}>
          {headerImage}
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT,
          paddingBottom: bottom,
        }}
      >
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    zIndex: 10,
  },
  headerImage: {
    height: HEADER_HEIGHT,
    width: "100%",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
});
