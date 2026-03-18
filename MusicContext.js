import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Switch,
  ScrollView, StatusBar, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useMusic } from '../context/MusicContext';
import { JUICE_WRLD_SONGS } from '../data/songs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { liked, recentlyPlayed } = useMusic();
  const insets = useSafeAreaInsets();
  const [autoplay, setAutoplay] = useState(true);
  const [highQuality, setHighQuality] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const stats = [
    { label: 'Songs', value: JUICE_WRLD_SONGS.length, icon: '🎵' },
    { label: 'Unreleased', value: JUICE_WRLD_SONGS.filter(s => s.type === 'unreleased').length, icon: '🔒' },
    { label: 'Liked', value: liked.length, icon: '💜' },
    { label: 'Played', value: recentlyPlayed.length, icon: '▶️' },
  ];

  const renderToggle = (label, value, setter, subtitle) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={setter}
        trackColor={{ false: '#2A2A35', true: 'rgba(155,89,182,0.5)' }}
        thumbColor={value ? '#9B59B6' : '#555'}
        ios_backgroundColor="#2A2A35"
      />
    </View>
  );

  const renderLink = (icon, label, color = '#fff', onPress) => (
    <TouchableOpacity style={styles.linkRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.linkIcon, { backgroundColor: `${color}22` }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.linkLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color="#444" />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Profile Header */}
        <LinearGradient colors={['#1A0A2E', '#0A0A0F']} style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🍇</Text>
          </View>
          <Text style={styles.username}>999 Club Member</Text>
          <Text style={styles.tagline}>Juice WRLD Forever</Text>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Playback</Text>
          {renderToggle('Autoplay', autoplay, setAutoplay, 'Automatically play next song')}
          {renderToggle('High Quality', highQuality, setHighQuality, 'Use more data for better audio')}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          {renderToggle('Notifications', notifications, setNotifications, 'New song alerts')}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          {renderLink('musical-notes-outline', 'Song Database Info', '#9B59B6', () =>
            Alert.alert('Song Database', `Juiceify has ${JUICE_WRLD_SONGS.length} Juice WRLD tracks including ${JUICE_WRLD_SONGS.filter(s=>s.type==='unreleased').length} unreleased songs. Songs are streamed via YouTube.`)
          )}
          {renderLink('musical-notes-outline', 'Powered by Google Drive', '#9B59B6', () => {})}
          {renderLink('heart-outline', 'Made for the 999 Club', '#9B59B6', () => {})}
          {renderLink('information-circle-outline', 'Version 1.0.0', '#888', () => {})}
        </View>

        {/* 999 Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>999 🍇 Forever</Text>
          <Text style={styles.bannerSub}>Jarad Higgins — Dec 2, 1998 – Dec 8, 2019</Text>
          <Text style={styles.bannerSub2}>Legends Never Die ♾️</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },

  header: { alignItems: 'center', paddingTop: 24, paddingBottom: 32 },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(155,89,182,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(155,89,182,0.5)', marginBottom: 14 },
  avatarEmoji: { fontSize: 42 },
  username: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  tagline: { fontSize: 13, color: '#9B59B6', fontWeight: '500' },

  statsGrid: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 8, gap: 10 },
  statCard: { flex: 1, backgroundColor: '#1A1A24', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#2A2A35' },
  statIcon: { fontSize: 20, marginBottom: 6 },
  statValue: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 2 },
  statLabel: { fontSize: 10, color: '#888', fontWeight: '500' },

  section: { marginHorizontal: 16, marginTop: 20, backgroundColor: '#111118', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#1E1E28' },
  sectionTitle: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8, fontSize: 12, fontWeight: '700', color: '#666', letterSpacing: 0.8 },

  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#1E1E28' },
  settingInfo: { flex: 1 },
  settingLabel: { color: '#fff', fontSize: 15, fontWeight: '500' },
  settingSubtitle: { color: '#555', fontSize: 12, marginTop: 2 },

  linkRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, borderTopWidth: 1, borderTopColor: '#1E1E28', gap: 12 },
  linkIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  linkLabel: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '500' },

  banner: { margin: 16, marginTop: 24, backgroundColor: 'rgba(155,89,182,0.1)', borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(155,89,182,0.25)' },
  bannerText: { fontSize: 22, fontWeight: '800', color: '#D7BDE2', marginBottom: 8 },
  bannerSub: { color: '#888', fontSize: 13, marginBottom: 4, textAlign: 'center' },
  bannerSub2: { color: '#9B59B6', fontSize: 13, fontWeight: '600' },
});
