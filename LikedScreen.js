import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, Image, StatusBar, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMusic } from '../context/MusicContext';
import { JUICE_WRLD_SONGS, ALBUMS, formatDuration } from '../data/songs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🎵' },
  { id: 'released', label: 'Released', icon: '✅' },
  { id: 'unreleased', label: 'Unreleased', icon: '🔒' },
  { id: 'album', label: 'Albums', icon: '💿' },
];

export default function SearchScreen() {
  const { playSong, currentSong, isPlaying } = useMusic();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const insets = useSafeAreaInsets();

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    let songs = JUICE_WRLD_SONGS;

    if (filter === 'released') songs = songs.filter(s => s.type === 'released');
    else if (filter === 'unreleased') songs = songs.filter(s => s.type === 'unreleased');

    if (!q) return songs;
    return songs.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.album.toLowerCase().includes(q) ||
      String(s.year).includes(q)
    );
  }, [query, filter]);

  const albumResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ALBUMS.filter(a => a.title.toLowerCase().includes(q));
  }, [query]);

  const renderSong = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.songRow, currentSong?.id === item.id && styles.songRowActive]}
      onPress={() => playSong(item, results)}
      activeOpacity={0.7}
    >
      <Text style={styles.songIndex}>{index + 1}</Text>
      <Image source={{ uri: item.albumArt }} style={styles.art} />
      <View style={styles.info}>
        <Text
          style={[styles.title, currentSong?.id === item.id && styles.activeTitle]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <View style={styles.metaRow}>
          {item.type === 'unreleased' && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>UNRELEASED</Text>
            </View>
          )}
          <Text style={styles.meta}>{item.album} • {formatDuration(item.duration)}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => playSong(item, results)} style={styles.playBtn}>
        <Ionicons
          name={currentSong?.id === item.id && isPlaying ? 'pause' : 'play'}
          size={18}
          color={currentSong?.id === item.id ? '#9B59B6' : '#666'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Search Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Songs, albums, years..."
            placeholderTextColor="#555"
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color="#555" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, filter === cat.id && styles.chipActive]}
            onPress={() => setFilter(cat.id)}
          >
            <Text style={styles.chipIcon}>{cat.icon}</Text>
            <Text style={[styles.chipLabel, filter === cat.id && styles.chipLabelActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {results.length} song{results.length !== 1 ? 's' : ''}
          {query ? ` for "${query}"` : ''}
        </Text>
        <TouchableOpacity onPress={() => playSong(results[0], results)}>
          <View style={styles.shuffleBtn}>
            <Ionicons name="shuffle" size={14} color="#9B59B6" />
            <Text style={styles.shuffleText}>Shuffle</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Album results (shown when searching) */}
      {albumResults.length > 0 && (
        <View style={styles.albumSection}>
          <Text style={styles.albumSectionTitle}>Albums</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {albumResults.map(album => {
              const albumSongs = JUICE_WRLD_SONGS.filter(s => s.album === album.title);
              return (
                <TouchableOpacity
                  key={album.id}
                  style={styles.albumCard}
                  onPress={() => albumSongs.length && playSong(albumSongs[0], albumSongs)}
                >
                  <Image source={{ uri: album.art }} style={styles.albumArt} />
                  <Text style={styles.albumTitle} numberOfLines={1}>{album.title}</Text>
                  <Text style={styles.albumYear}>{album.year}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Songs List */}
      <FlatList
        data={results}
        renderItem={renderSong}
        keyExtractor={i => i.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No songs found</Text>
            <Text style={styles.emptySubtitle}>Try a different search term</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },

  header: { paddingHorizontal: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 14 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1A1A24', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: '#2A2A35',
  },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '400' },

  filterScroll: { maxHeight: 48 },
  filterContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#1A1A24', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: '#2A2A35',
  },
  chipActive: { backgroundColor: 'rgba(155,89,182,0.25)', borderColor: '#9B59B6' },
  chipIcon: { fontSize: 12 },
  chipLabel: { color: '#888', fontSize: 13, fontWeight: '500' },
  chipLabelActive: { color: '#D7BDE2', fontWeight: '600' },

  resultsHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
  },
  resultsCount: { color: '#888', fontSize: 13 },
  shuffleBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(155,89,182,0.15)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  shuffleText: { color: '#9B59B6', fontSize: 13, fontWeight: '600' },

  albumSection: { paddingLeft: 16, marginBottom: 8 },
  albumSectionTitle: { color: '#aaa', fontSize: 13, fontWeight: '600', marginBottom: 8 },
  albumCard: { width: 100, marginRight: 12 },
  albumArt: { width: 100, height: 100, borderRadius: 8, marginBottom: 4 },
  albumTitle: { color: '#fff', fontSize: 11, fontWeight: '600' },
  albumYear: { color: '#888', fontSize: 10 },

  songRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 9,
    borderRadius: 10, marginBottom: 2,
  },
  songRowActive: { backgroundColor: 'rgba(155,89,182,0.1)' },
  songIndex: { width: 24, textAlign: 'center', color: '#555', fontSize: 13 },
  art: { width: 44, height: 44, borderRadius: 8, marginHorizontal: 10 },
  info: { flex: 1 },
  title: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 3 },
  activeTitle: { color: '#9B59B6' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badge: { backgroundColor: '#9B59B6', borderRadius: 3, paddingHorizontal: 4, paddingVertical: 1 },
  badgeText: { color: '#fff', fontSize: 8, fontWeight: '700' },
  meta: { color: '#666', fontSize: 11 },
  playBtn: { paddingHorizontal: 8 },

  empty: { alignItems: 'center', marginTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  emptySubtitle: { color: '#666', fontSize: 14 },
});
