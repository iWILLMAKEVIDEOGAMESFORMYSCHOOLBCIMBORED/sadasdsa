import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Dimensions, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { JUICE_WRLD_SONGS } from '../data/songs';

const { width, height } = Dimensions.get('window');

const FEATURES = [
  { icon: '🎵', title: `${JUICE_WRLD_SONGS.length}+ Songs`, sub: 'Every released track in one place' },
  { icon: '🔒', title: 'The Vault', sub: `${JUICE_WRLD_SONGS.filter(s=>s.type==='unreleased').length} unreleased & rare tracks` },
  { icon: '🔍', title: 'Smart Search', sub: 'Find any song instantly' },
];

export default function OnboardingScreen({ onDone }) {
  const insets = useSafeAreaInsets();
  const glow = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideUp, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  return (
    <LinearGradient colors={['#1A0A2E', '#0D0720', '#0A0A0F']} style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" />

      {/* Animated glow */}
      <Animated.View style={[styles.glowCircle, { opacity: glowOpacity }]} />

      <Animated.View style={[styles.content, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🍇</Text>
          </View>
        </View>

        <Text style={styles.appName}>Juiceify</Text>
        <Text style={styles.tagline}>All Juice WRLD.{'\n'}All the time.</Text>

        {/* Feature pills */}
        <View style={styles.features}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>{f.icon}</Text>
              </View>
              <View>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureSub}>{f.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.ctaBtn} onPress={onDone} activeOpacity={0.85}>
          <LinearGradient colors={['#9B59B6', '#6C3483']} style={styles.ctaGrad} start={{x:0,y:0}} end={{x:1,y:0}}>
            <Text style={styles.ctaText}>Start Listening</Text>
            <Ionicons name="play" size={18} color="#fff" style={{ marginLeft: 8 }} />
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>Streams via YouTube • Personal use only</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  glowCircle: {
    position: 'absolute', width: 400, height: 400,
    borderRadius: 200, backgroundColor: 'rgba(155,89,182,0.15)',
    top: '20%', alignSelf: 'center',
  },
  content: { width: '100%', alignItems: 'center', paddingHorizontal: 28 },

  logoWrap: { marginBottom: 20 },
  logoCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(155,89,182,0.2)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(155,89,182,0.5)',
    shadowColor: '#9B59B6', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 20,
  },
  logoEmoji: { fontSize: 50 },

  appName: { fontSize: 44, fontWeight: '900', color: '#fff', letterSpacing: -1, marginBottom: 10 },
  tagline: { fontSize: 20, color: '#D7BDE2', textAlign: 'center', lineHeight: 28, marginBottom: 36 },

  features: { width: '100%', gap: 14, marginBottom: 40 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(155,89,182,0.2)' },
  featureIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: 'rgba(155,89,182,0.2)', alignItems: 'center', justifyContent: 'center' },
  featureIconText: { fontSize: 20 },
  featureTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 2 },
  featureSub: { color: '#888', fontSize: 12 },

  ctaBtn: { width: '100%', borderRadius: 16, overflow: 'hidden', shadowColor: '#9B59B6', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 14, marginBottom: 16 },
  ctaGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18 },
  ctaText: { color: '#fff', fontSize: 18, fontWeight: '800' },

  disclaimer: { color: '#444', fontSize: 11, textAlign: 'center' },
});
