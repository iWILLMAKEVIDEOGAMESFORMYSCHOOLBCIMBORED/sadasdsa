import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Image, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useMusic } from '../context/MusicContext';
import { JUICE_WRLD_SONGS, formatDuration } from '../data/songs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LikedScreen() {
  const { liked, toggleLike, playSong, currentSong, isPlaying } = useMusic();
  const insets = useSafeAreaInsets();

  const likedSongs = JUICE_WRLD_SONGS.filter(s => liked.includes(s.id));

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.row, currentSong?.id === item.id && styles.rowActive]}
      onPress={() => playSong(item, likedSongs)}
      activeOpacity={0.7}
    >
      <Text style={styles.num}>{index + 1}</Text>
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
        <Ionicons name="heart" size={18} color="#9B59B6" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#3D1066', '#1A0A2E', '#0A0A0F']} style={styles.header}>
        <Ionicons name="heart" size={52} color="#9B59B6" style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Liked Songs</Text>
        <Text style={styles.headerSub}>{likedSongs.length} song{likedSongs.length !== 1 ? 's' : ''}</Text>

        {likedSongs.length > 0 && (
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.playAllBtn}
              onPress={() => playSong(likedSongs[0], likedSongs)}
            >
              <LinearGradient colors={['#9B59B6', '#6C3483']} style={styles.playAllGrad}>
                <Ionicons name="play" size={20} color="#fff" style={{ marginLeft: 3 }} />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shuffleBtn}>
              <Ionicons name="shuffle" size={22} color="#aaa" />
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>

      {likedSongs.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>💜</Text>
          <Text style={styles.emptyTitle}>No liked songs yet</Text>
          <Text style={styles.emptySub}>Tap the heart icon on any song to save it here</Text>
        </View>
      ) : (
        <FlatList
          data={likedSongs}
          renderItem={renderItem}
          keyExtractor={i => i.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },

  header: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 28, alignItems: 'center' },
  headerIcon: { marginBottom: 12 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 4 },
  headerSub: { color: '#aaa', fontSize: 14, marginBottom: 20 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  playAllBtn: { shadowColor: '#9B59B6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 10 },
  playAllGrad: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  shuffleBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#1A1A24', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2A2A35' },

  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderRadius: 10, marginBottom: 2 },
  rowActive: { backgroundColor: 'rgba(155,89,182,0.1)' },
  num: { width: 24, textAlign: 'center', color: '#555', fontSize: 13 },
  art: { width: 46, height: 46, borderRadius: 8, marginHorizontal: 10 },
  info: { flex: 1 },
  title: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 2 },
  activeTitle: { color: '#9B59B6' },
  meta: { color: '#666', fontSize: 11 },
  likeBtn: { padding: 8 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 8 },
  emptySub: { color: '#666', fontSize: 14, textAlign: 'center', paddingHorizontal: 40 },
});
