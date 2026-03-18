import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Image, SectionList, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMusic } from '../context/MusicContext';
import { JUICE_WRLD_SONGS, ALBUMS, PLAYLISTS, formatDuration } from '../data/songs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TABS = ['Songs', 'Albums', 'Playlists', 'Unreleased'];

export default function LibraryScreen() {
  const { playSong, currentSong, isPlaying, toggleLike, isLiked } = useMusic();
  const [activeTab, setActiveTab] = useState('Songs');
  const [sortBy, setSortBy] = useState('title');
  const insets = useSafeAreaInsets();

  const getSortedSongs = (songs) => {
    return [...songs].sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'year') return a.year - b.year;
      if (sortBy === 'duration') return a.duration - b.duration;
      return 0;
    });
  };

  const renderSong = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.songRow, currentSong?.id === item.id && styles.songRowActive]}
      onPress={() => {
        const list = activeTab === 'Unreleased'
          ? JUICE_WRLD_SONGS.filter(s => s.type === 'unreleased')
          : JUICE_WRLD_SONGS;
        playSong(item, list);
      }}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.albumArt }} style={styles.art} />
      <View style={styles.info}>
        <Text
          style={[styles.title, currentSong?.id === item.id && styles.activeTitle]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text style={styles.meta}>{item.album} • {formatDuration(item.duration)}</Text>
      </View>
      <TouchableOpacity onPress={() => toggleLike(item.id)} style={styles.likeBtn}>
        <Ionicons
          name={isLiked(item.id) ? 'heart' : 'heart-outline'}
          size={18}
          color={isLiked(item.id) ? '#9B59B6' : '#555'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderAlbum = ({ item }) => {
    const albumSongs = JUICE_WRLD_SONGS.filter(s => s.album === item.title);
    return (
      <TouchableOpacity
        style={styles.albumRow}
        onPress={() => albumSongs.length && playSong(albumSongs[0], albumSongs)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.art }} style={styles.albumArt} />
        <View style={styles.albumInfo}>
          <Text style={styles.albumTitle}>{item.title}</Text>
          <Text style={styles.albumMeta}>{item.year} • {albumSongs.length} songs</Text>
          {item.type === 'unreleased' && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>VAULT</Text>
            </View>
          )}
        </View>
        <Ionicons name="play-circle" size={34} color="#9B59B6" />
      </TouchableOpacity>
    );
  };

  const renderPlaylist = ({ item }) => {
    const songs = item.songIds.map(id => JUICE_WRLD_SONGS.find(s => s.id === id)).filter(Boolean);
    return (
      <TouchableOpacity
        style={styles.playlistRow}
        onPress={() => songs.length && playSong(songs[0], songs)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.art }} style={styles.playlistArt} />
        <View style={styles.playlistInfo}>
          <Text style={styles.playlistTitle}>{item.title}</Text>
          <Text style={styles.playlistMeta}>{songs.length} songs • {item.description}</Text>
        </View>
        <Ionicons name="play-circle" size={34} color="#9B59B6" />
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (activeTab === 'Songs') {
      return (
        <FlatList
          data={getSortedSongs(JUICE_WRLD_SONGS)}
          renderItem={renderSong}
          keyExtractor={i => i.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.sortRow}>
              <Text style={styles.sortLabel}>Sort by:</Text>
              {['title', 'year', 'duration'].map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.sortChip, sortBy === s && styles.sortChipActive]}
                  onPress={() => setSortBy(s)}
                >
                  <Text style={[styles.sortChipText, sortBy === s && styles.sortChipTextActive]}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          }
        />
      );
    }

    if (activeTab === 'Albums') {
      return (
        <FlatList
          data={ALBUMS}
          renderItem={renderAlbum}
          keyExtractor={i => i.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    if (activeTab === 'Playlists') {
      return (
        <FlatList
          data={PLAYLISTS}
          renderItem={renderPlaylist}
          keyExtractor={i => i.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    if (activeTab === 'Unreleased') {
      const unreleased = getSortedSongs(JUICE_WRLD_SONGS.filter(s => s.type === 'unreleased'));
      return (
        <FlatList
          data={unreleased}
          renderItem={renderSong}
          keyExtractor={i => i.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.vaultHeader}>
              <Text style={styles.vaultEmoji}>🔒</Text>
              <Text style={styles.vaultTitle}>The Vault</Text>
              <Text style={styles.vaultSub}>{unreleased.length} unreleased & rare tracks</Text>
              <TouchableOpacity
                style={styles.playVaultBtn}
                onPress={() => unreleased.length && playSong(unreleased[0], unreleased)}
              >
                <Ionicons name="play" size={16} color="#fff" />
                <Text style={styles.playVaultText}>Play Vault</Text>
              </TouchableOpacity>
            </View>
          }
        />
      );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Library</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>{JUICE_WRLD_SONGS.length} songs total</Text>
          <Text style={styles.statsDot}>•</Text>
          <Text style={styles.statsText}>{JUICE_WRLD_SONGS.filter(s => s.type === 'unreleased').length} unreleased</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
            {tab === 'Unreleased' && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>🔒</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },

  header: { paddingHorizontal: 16, paddingBottom: 12, paddingTop: 8 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 4 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statsText: { color: '#888', fontSize: 12 },
  statsDot: { color: '#555', fontSize: 12 },

  tabs: { flexDirection: 'row', paddingHorizontal: 16, gap: 6, marginBottom: 12 },
  tab: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#1A1A24', borderWidth: 1, borderColor: '#2A2A35', flexDirection: 'row', alignItems: 'center', gap: 4 },
  tabActive: { backgroundColor: 'rgba(155,89,182,0.25)', borderColor: '#9B59B6' },
  tabText: { color: '#888', fontSize: 13, fontWeight: '500' },
  tabTextActive: { color: '#D7BDE2', fontWeight: '700' },
  tabBadge: {},
  tabBadgeText: { fontSize: 11 },

  sortRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, marginBottom: 4 },
  sortLabel: { color: '#666', fontSize: 12 },
  sortChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: '#1A1A24' },
  sortChipActive: { backgroundColor: 'rgba(155,89,182,0.2)' },
  sortChipText: { color: '#666', fontSize: 12 },
  sortChipTextActive: { color: '#9B59B6', fontWeight: '600' },

  songRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderRadius: 10, marginBottom: 2 },
  songRowActive: { backgroundColor: 'rgba(155,89,182,0.1)' },
  art: { width: 46, height: 46, borderRadius: 8, marginRight: 12 },
  info: { flex: 1 },
  title: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 2 },
  activeTitle: { color: '#9B59B6' },
  meta: { color: '#666', fontSize: 11 },
  likeBtn: { padding: 8 },

  albumRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderRadius: 12, marginBottom: 4 },
  albumArt: { width: 60, height: 60, borderRadius: 10, marginRight: 12 },
  albumInfo: { flex: 1 },
  albumTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 3 },
  albumMeta: { color: '#888', fontSize: 12 },
  badge: { backgroundColor: '#9B59B6', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 4 },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },

  playlistRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderRadius: 12, marginBottom: 4 },
  playlistArt: { width: 60, height: 60, borderRadius: 10, marginRight: 12 },
  playlistInfo: { flex: 1 },
  playlistTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 3 },
  playlistMeta: { color: '#888', fontSize: 12 },

  vaultHeader: { alignItems: 'center', paddingVertical: 24, marginBottom: 8 },
  vaultEmoji: { fontSize: 48, marginBottom: 8 },
  vaultTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  vaultSub: { color: '#888', fontSize: 14, marginBottom: 16 },
  playVaultBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#9B59B6', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 25 },
  playVaultText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
