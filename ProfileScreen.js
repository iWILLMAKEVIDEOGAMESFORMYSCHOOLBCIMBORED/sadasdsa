import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Image, Dimensions, StatusBar, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useMusic } from '../context/MusicContext';
import { JUICE_WRLD_SONGS, ALBUMS, PLAYLISTS, formatDuration } from '../data/songs';

const { width } = Dimensions.get('window');

const FEATURED = JUICE_WRLD_SONGS.slice(0, 5);

export default function HomeScreen({ navigation }) {
  const { playSong, currentSong, isPlaying, togglePlay, isLiked, recentlyPlayed } = useMusic();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handlePlayAll = () => {
    playSong(JUICE_WRLD_SONGS[0], JUICE_WRLD_SONGS);
  };

  const renderFeaturedSong = ({ item, index }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => playSong(item, FEATURED)}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.albumArt }} style={styles.featuredArt} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.featuredOverlay}
      />
      <View style={styles.featuredInfo}>
        {item.type === 'unreleased' && (
          <View style={styles.unreleasedBadge}>
            <Text style={styles.unreleasedText}>UNRELEASED</Text>
          </View>
        )}
        <Text style={styles.featuredTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.featuredAlbum}>{item.album} • {item.year}</Text>
      </View>
      <View style={styles.featuredPlayBtn}>
        <Ionicons
          name={currentSong?.id === item.id && isPlaying ? 'pause-circle' : 'play-circle'}
          size={44}
          color="#9B59B6"
        />
      </View>
    </TouchableOpacity>
  );

  const renderSongRow = ({ item }) => (
    <TouchableOpacity
      style={[styles.songRow, currentSong?.id === item.id && styles.songRowActive]}
      onPress={() => playSong(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.albumArt }} style={styles.songRowArt} />
      <View style={styles.songRowInfo}>
        <Text style={[styles.songRowTitle, currentSong?.id === item.id && styles.activeText]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.songRowMeta}>{item.year} • {formatDuration(item.duration)}</Text>
      </View>
      {item.type === 'unreleased' && (
        <View style={styles.smallBadge}>
          <Text style={styles.smallBadgeText}>🔒</Text>
        </View>
      )}
      {currentSong?.id === item.id && (
        <View style={styles.playingIndicator}>
          <Ionicons name="musical-notes" size={16} color="#9B59B6" />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderAlbum = ({ item }) => (
    <TouchableOpacity
      style={styles.albumCard}
      onPress={() => navigation.navigate('Library', { album: item })}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.art }} style={styles.albumArt} />
      <Text style={styles.albumTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.albumYear}>{item.year}</Text>
    </TouchableOpacity>
  );

  const renderPlaylist = ({ item }) => (
    <TouchableOpacity
      style={styles.playlistCard}
      onPress={() => {
        const songs = item.songIds.map(id => JUICE_WRLD_SONGS.find(s => s.id === id)).filter(Boolean);
        if (songs.length) playSong(songs[0], songs);
      }}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.art }} style={styles.playlistArt} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.playlistOverlay} />
      <Text style={styles.playlistTitle} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}
        <LinearGradient
          colors={['#1A0A2E', '#0A0A0F']}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.headerTitle}>Juiceify 🍇</Text>
            </View>
            <TouchableOpacity style={styles.searchBtn} onPress={() => navigation.navigate('Search')}>
              <Ionicons name="search" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Quick play row */}
          <View style={styles.quickRow}>
            {['All Songs', 'Unreleased', 'Essentials'].map((label, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickChip}
                onPress={handlePlayAll}
              >
                <Text style={styles.quickChipText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>

        {/* Featured / Now Trending */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
          </View>
          <FlatList
            data={FEATURED}
            renderItem={renderFeaturedSong}
            keyExtractor={i => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          />
        </View>

        {/* Albums */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💿 Albums & Projects</Text>
          </View>
          <FlatList
            data={ALBUMS}
            renderItem={renderAlbum}
            keyExtractor={i => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
          />
        </View>

        {/* Curated Playlists */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎵 Curated for You</Text>
          </View>
          <FlatList
            data={PLAYLISTS}
            renderItem={renderPlaylist}
            keyExtractor={i => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          />
        </View>

        {/* Recently Played */}
        {recentlyPlayed.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⏱ Recently Played</Text>
            </View>
            <FlatList
              data={recentlyPlayed.slice(0, 10)}
              renderItem={renderSongRow}
              keyExtractor={i => i.id}
              scrollEnabled={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </View>
        )}

        {/* All Songs Quick Access */}
        <View style={[styles.section, { marginBottom: 100 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎶 All Songs</Text>
            <TouchableOpacity onPress={handlePlayAll}>
              <Text style={styles.seeAll}>Play All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={JUICE_WRLD_SONGS.slice(0, 15)}
            renderItem={renderSongRow}
            keyExtractor={i => i.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
          <TouchableOpacity
            style={styles.viewMoreBtn}
            onPress={() => navigation.navigate('Library')}
          >
            <Text style={styles.viewMoreText}>View All {JUICE_WRLD_SONGS.length} Songs</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  scroll: { paddingBottom: 20 },

  header: { paddingTop: 56, paddingBottom: 20, paddingHorizontal: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greeting: { fontSize: 13, color: '#aaa', fontWeight: '400' },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  searchBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(155,89,182,0.25)', alignItems: 'center', justifyContent: 'center' },

  quickRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  quickChip: { backgroundColor: 'rgba(155,89,182,0.2)', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14, borderWidth: 1, borderColor: 'rgba(155,89,182,0.4)' },
  quickChipText: { color: '#D7BDE2', fontSize: 12, fontWeight: '600' },

  section: { marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  seeAll: { fontSize: 13, color: '#9B59B6', fontWeight: '600' },

  featuredCard: { width: width * 0.72, height: 200, borderRadius: 16, overflow: 'hidden', position: 'relative' },
  featuredArt: { width: '100%', height: '100%' },
  featuredOverlay: { ...StyleSheet.absoluteFillObject },
  featuredInfo: { position: 'absolute', bottom: 12, left: 12, right: 60 },
  featuredTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 2 },
  featuredAlbum: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  featuredPlayBtn: { position: 'absolute', bottom: 8, right: 8 },
  unreleasedBadge: { backgroundColor: '#9B59B6', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start', marginBottom: 4 },
  unreleasedText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },

  albumCard: { width: 130 },
  albumArt: { width: 130, height: 130, borderRadius: 10, marginBottom: 6 },
  albumTitle: { fontSize: 12, fontWeight: '600', color: '#fff', lineHeight: 16 },
  albumYear: { fontSize: 11, color: '#888', marginTop: 2 },

  playlistCard: { width: 150, height: 150, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  playlistArt: { width: '100%', height: '100%' },
  playlistOverlay: { ...StyleSheet.absoluteFillObject },
  playlistTitle: { position: 'absolute', bottom: 8, left: 8, right: 8, fontSize: 13, fontWeight: '700', color: '#fff' },

  songRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderRadius: 10, marginBottom: 2 },
  songRowActive: { backgroundColor: 'rgba(155,89,182,0.1)' },
  songRowArt: { width: 46, height: 46, borderRadius: 8, marginRight: 12 },
  songRowInfo: { flex: 1 },
  songRowTitle: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 2 },
  songRowMeta: { fontSize: 11, color: '#888' },
  activeText: { color: '#9B59B6' },
  smallBadge: { marginRight: 4 },
  smallBadgeText: { fontSize: 14 },
  playingIndicator: { marginLeft: 4 },

  viewMoreBtn: { marginHorizontal: 16, marginTop: 12, backgroundColor: 'rgba(155,89,182,0.2)', borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(155,89,182,0.3)' },
  viewMoreText: { color: '#D7BDE2', fontWeight: '600', fontSize: 14 },
});
