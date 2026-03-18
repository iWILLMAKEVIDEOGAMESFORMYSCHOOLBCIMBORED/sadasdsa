import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
  Modal, Image, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useMusic } from '../context/MusicContext';
import { formatDuration } from '../data/songs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function FullPlayer() {
  const {
    currentSong, isPlaying, togglePlay, playNext, playPrev,
    playerExpanded, setPlayerExpanded, queue, playSong,
    toggleLike, isLiked, progress,
  } = useMusic();

  const [showQueue, setShowQueue] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const insets = useSafeAreaInsets();

  if (!currentSong || !playerExpanded) return null;

  const likedSong = isLiked(currentSong.id);
  const isDrive = currentSong.source === 'googledrive';
  const prog = Math.min(Math.max(progress || 0, 0), 1);
  const elapsed = currentSong.duration > 0 ? Math.round(prog * currentSong.duration) : 0;
  const remaining = currentSong.duration > 0 ? currentSong.duration - elapsed : 0;

  return (
    <Modal visible={playerExpanded} animationType="slide" presentationStyle="fullScreen" statusBarTranslucent>
      <LinearGradient
        colors={['#1A0A2E', '#0D0D1A', '#0A0A0F']}
        style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setPlayerExpanded(false)} style={styles.iconBtn}>
            <Ionicons name="chevron-down" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.nowPlaying}>NOW PLAYING</Text>
            <View style={styles.badgeRow}>
              {isDrive && (
                <View style={styles.badge}>
                  <Ionicons name="cloud" size={10} color="#D7BDE2" />
                  <Text style={styles.badgeText}> DRIVE</Text>
                </View>
              )}
              {currentSong.type === 'unreleased' && (
                <View style={[styles.badge, styles.badgePurple]}>
                  <Text style={styles.badgeText}>🔒 VAULT</Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity onPress={() => setShowQueue(!showQueue)} style={styles.iconBtn}>
            <Ionicons name="list" size={22} color={showQueue ? '#9B59B6' : '#888'} />
          </TouchableOpacity>
        </View>

        {!showQueue ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

            {/* Album Art */}
            <View style={styles.artWrap}>
              <Image source={{ uri: currentSong.albumArt }} style={styles.art} />
            </View>

            {/* Source label */}
            <View style={styles.sourceRow}>
              <Ionicons
                name={isDrive ? 'cloud-done-outline' : 'musical-note-outline'}
                size={13}
                color="#9B59B6"
              />
              <Text style={styles.sourceText}>
                {isDrive ? 'Streaming from Google Drive' : 'Juiceify Library'}
              </Text>
            </View>

            {/* Song Info */}
            <View style={styles.songInfo}>
              <View style={styles.songInfoLeft}>
                <Text style={styles.songTitle} numberOfLines={1}>{currentSong.title}</Text>
                <Text style={styles.songArtist}>Juice WRLD</Text>
                <Text style={styles.songAlbum}>{currentSong.album} • {currentSong.year}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleLike(currentSong.id)} style={styles.iconBtn}>
                <Ionicons
                  name={likedSong ? 'heart' : 'heart-outline'}
                  size={26}
                  color={likedSong ? '#9B59B6' : '#555'}
                />
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressWrap}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${prog * 100}%` }]} />
                <View style={[styles.progressThumb, { left: `${prog * 100}%` }]} />
              </View>
              <View style={styles.progressTimes}>
                <Text style={styles.timeText}>{formatDuration(elapsed)}</Text>
                <Text style={styles.timeText}>
                  {remaining > 0 ? `-${formatDuration(remaining)}` : '--:--'}
                </Text>
              </View>
            </View>

            {/* Main Controls */}
            <View style={styles.controls}>
              <TouchableOpacity onPress={playPrev} style={styles.iconBtn}>
                <Ionicons name="play-skip-back" size={28} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePlay} style={styles.playBtn}>
                <LinearGradient colors={['#9B59B6', '#6C3483']} style={styles.playBtnGrad}>
                  <Ionicons
                    name={isPlaying ? 'pause' : 'play'}
                    size={34}
                    color="#fff"
                    style={isPlaying ? {} : { marginLeft: 4 }}
                  />
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={playNext} style={styles.iconBtn}>
                <Ionicons name="play-skip-forward" size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Secondary Controls */}
            <View style={styles.secondaryControls}>
              <TouchableOpacity
                style={[styles.secondaryBtn, shuffle && styles.secondaryBtnActive]}
                onPress={() => setShuffle(p => !p)}
              >
                <Ionicons name="shuffle" size={20} color={shuffle ? '#9B59B6' : '#555'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.secondaryBtn, repeat && styles.secondaryBtnActive]}
                onPress={() => setRepeat(p => !p)}
              >
                <Ionicons name="repeat" size={20} color={repeat ? '#9B59B6' : '#555'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn}>
                <Ionicons name="share-outline" size={20} color="#555" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn}>
                <Ionicons name="ellipsis-horizontal" size={20} color="#555" />
              </TouchableOpacity>
            </View>

          </ScrollView>
        ) : (
          /* Queue */
          <View style={styles.queueWrap}>
            <View style={styles.queueHeader}>
              <Text style={styles.queueTitle}>Up Next</Text>
              <Text style={styles.queueCount}>{queue.length} songs</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              {queue.map((song) => (
                <TouchableOpacity
                  key={song.id}
                  style={[styles.queueRow, currentSong.id === song.id && styles.queueRowActive]}
                  onPress={() => playSong(song, queue)}
                >
                  <Image source={{ uri: song.albumArt }} style={styles.queueArt} />
                  <View style={styles.queueInfo}>
                    <Text
                      style={[styles.queueSongTitle, currentSong.id === song.id && styles.queueSongActive]}
                      numberOfLines={1}
                    >
                      {song.title}
                    </Text>
                    <Text style={styles.queueMeta}>
                      {song.year}{song.duration > 0 ? ` • ${formatDuration(song.duration)}` : ''}
                    </Text>
                  </View>
                  {currentSong.id === song.id && (
                    <Ionicons name="musical-notes" size={16} color="#9B59B6" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 20 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { alignItems: 'center', flex: 1 },
  nowPlaying: { color: '#555', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 4 },
  badgeRow: { flexDirection: 'row', gap: 6 },
  badge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(155,89,182,0.2)', borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  badgePurple: { backgroundColor: 'rgba(155,89,182,0.3)' },
  badgeText: { color: '#D7BDE2', fontSize: 9, fontWeight: '700' },

  artWrap: { alignItems: 'center', marginVertical: 28 },
  art: {
    width: width - 72, height: width - 72, borderRadius: 20,
    shadowColor: '#9B59B6', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4, shadowRadius: 24,
  },

  sourceRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, marginBottom: 16,
  },
  sourceText: { color: '#9B59B6', fontSize: 11, fontWeight: '500' },

  songInfo: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 24, marginBottom: 24 },
  songInfoLeft: { flex: 1 },
  songTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  songArtist: { fontSize: 15, color: '#9B59B6', fontWeight: '600', marginBottom: 2 },
  songAlbum: { fontSize: 12, color: '#555' },

  progressWrap: { paddingHorizontal: 24, marginBottom: 36 },
  progressTrack: {
    height: 4, backgroundColor: '#2A2A35', borderRadius: 2,
    marginBottom: 8, position: 'relative',
  },
  progressFill: { height: '100%', backgroundColor: '#9B59B6', borderRadius: 2 },
  progressThumb: {
    position: 'absolute', top: -5, marginLeft: -7,
    width: 14, height: 14, borderRadius: 7, backgroundColor: '#fff',
  },
  progressTimes: { flexDirection: 'row', justifyContent: 'space-between' },
  timeText: { color: '#555', fontSize: 11 },

  controls: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 32, marginBottom: 28,
  },
  playBtn: {
    shadowColor: '#9B59B6', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5, shadowRadius: 14,
  },
  playBtnGrad: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },

  secondaryControls: { flexDirection: 'row', justifyContent: 'center', gap: 20, paddingBottom: 12 },
  secondaryBtn: {
    width: 44, height: 44, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#111118', borderRadius: 12,
  },
  secondaryBtnActive: { backgroundColor: 'rgba(155,89,182,0.2)' },

  queueWrap: { flex: 1, paddingHorizontal: 16 },
  queueHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12, marginTop: 4,
  },
  queueTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  queueCount: { color: '#555', fontSize: 13 },
  queueRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 8, borderRadius: 10, marginBottom: 2,
  },
  queueRowActive: { backgroundColor: 'rgba(155,89,182,0.12)' },
  queueArt: { width: 44, height: 44, borderRadius: 8, marginRight: 12 },
  queueInfo: { flex: 1 },
  queueSongTitle: { color: '#888', fontSize: 14, fontWeight: '500', marginBottom: 2 },
  queueSongActive: { color: '#D7BDE2', fontWeight: '700' },
  queueMeta: { color: '#444', fontSize: 11 },
});
