import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
      accessible={false}>
      <ThemedView style={styles.titleContainer} accessible={false}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
          accessibilityRole="header">
          Explore
        </ThemedText>
      </ThemedView>
      <ThemedText accessibilityRole="text">This app includes example code to help you get started.</ThemedText>
      <Collapsible title="File-based routing">
        <ThemedText accessibilityRole="text">
          This app has two screens:{' '}
          <ThemedText type="defaultSemiBold" accessible={false}>app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold" accessible={false}>app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText accessibilityRole="text">
          The layout file in <ThemedText type="defaultSemiBold" accessible={false}>app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link" accessible={false}>Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText accessibilityRole="text">
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="defaultSemiBold" accessible={false}>w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText accessibilityRole="text">
          For static images, you can use the <ThemedText type="defaultSemiBold" accessible={false}>@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold" accessible={false}>@3x</ThemedText> suffixes to provide files for
          different screen densities
        </ThemedText>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
          accessible={true}
          accessibilityLabel="React logo"
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link" accessible={false}>Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText accessibilityRole="text">
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold" accessible={false}>useColorScheme()</ThemedText> hook lets you inspect
          what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link" accessible={false}>Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText accessibilityRole="text">
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold" accessible={false}>components/HelloWave.tsx</ThemedText> component uses
          the powerful{' '}
          <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }} accessible={false}>
            react-native-reanimated
          </ThemedText>{' '}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText accessibilityRole="text">
              The <ThemedText type="defaultSemiBold" accessible={false}>components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
