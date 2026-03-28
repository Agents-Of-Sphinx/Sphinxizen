
import {
  ref,
  listAll,
  getDownloadURL,
  getMetadata,
  uploadBytesResumable,
  deleteObject,
} from 'firebase/storage';
import { storage } from '@/lib/firebase';

const VIDEOS_FOLDER = 'videos';
const THUMBNAILS_FOLDER = 'thumbnails';

function safeJsonParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeTags(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(',')
    .map((tag) => tag.replace(/^#/, '').trim())
    .filter(Boolean);
}

function extensionOf(name = '') {
  const parts = name.split('.');
  return parts.length > 1 ? '.' + parts.pop() : '';
}

function fileNameBase(name = '') {
  return name.replace(/\.[^.]+$/, '');
}

function buildId(item) {
  return item.fullPath.replace(/[^a-zA-Z0-9_-]/g, '_');
}

function toVideoRecord(item, url, metadata) {
  const custom = metadata?.customMetadata || {};
  const tags = normalizeTags(custom.tags || safeJsonParse(custom.tagsJson, []));
  const uploader_name = custom.uploaderName || custom.uploader_name || 'Anonymous';
  const uploader_email = custom.uploaderEmail || custom.uploader_email || '';
  const createdRaw = custom.createdAt || metadata?.timeCreated || new Date().toISOString();
  const title = custom.title || fileNameBase(metadata?.name || item.name);
  const thumbnail_url = custom.thumbnailUrl || '';
  const thumbnail_path = custom.thumbnailPath || '';

  return {
    id: buildId(item),
    fullPath: item.fullPath,
    name: metadata?.name || item.name,
    title,
    description: custom.description || '',
    tags,
    video_url: url,
    thumbnail_url,
    thumbnail_path,
    uploader_name,
    uploader_email,
    created_date: createdRaw,
    likes: Number(custom.likes || 0),
    views: Number(custom.views || 0),
    comments_count: 0,
  };
}

export async function listVideos() {
  const folderRef = ref(storage, VIDEOS_FOLDER);
  const result = await listAll(folderRef);
  const videos = await Promise.all(
    result.items.map(async (item) => {
      const [url, metadata] = await Promise.all([getDownloadURL(item), getMetadata(item)]);
      return toVideoRecord(item, url, metadata);
    })
  );
  return videos.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
}

export async function getVideoById(id) {
  const videos = await listVideos();
  return videos.find((video) => video.id === id) || null;
}

export async function uploadVideoWithMetadata({ file, thumbnailFile, title, description, tags, user, onProgress }) {
  if (!file) throw new Error('Video file is required.');
  const createdAt = new Date().toISOString();
  const uid = user?.uid || 'anonymous';
  const cleanTags = normalizeTags(tags);
  let thumbnailUrl = '';
  let thumbnailPath = '';

  if (thumbnailFile) {
    const thumbExt = extensionOf(thumbnailFile.name) || '.jpg';
    thumbnailPath = `${THUMBNAILS_FOLDER}/${uid}_${Date.now()}${thumbExt}`;
    const thumbRef = ref(storage, thumbnailPath);
    await uploadBytesResumable(thumbRef, thumbnailFile);
    thumbnailUrl = await getDownloadURL(thumbRef);
  }

  const videoExt = extensionOf(file.name) || '.mp4';
  const videoPath = `${VIDEOS_FOLDER}/${uid}_${Date.now()}${videoExt}`;
  const videoRef = ref(storage, videoPath);

  const metadata = {
    contentType: file.type || 'video/mp4',
    customMetadata: {
      title: title?.trim() || fileNameBase(file.name),
      description: description?.trim() || '',
      tagsJson: JSON.stringify(cleanTags),
      uploaderName: user?.displayName || user?.email?.split('@')[0] || 'Anonymous',
      uploaderEmail: user?.email || '',
      createdAt,
      thumbnailUrl,
      thumbnailPath,
      likes: '0',
      views: '0',
    },
  };

  await new Promise((resolve, reject) => {
    const task = uploadBytesResumable(videoRef, file, metadata);
    task.on('state_changed', (snapshot) => {
      if (typeof onProgress === 'function') {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        onProgress(pct);
      }
    }, reject, resolve);
  });

  return buildId({ fullPath: videoPath });
}

export async function deleteVideo(video) {
  await deleteObject(ref(storage, video.fullPath));
  if (video.thumbnail_path) {
    try {
      await deleteObject(ref(storage, video.thumbnail_path));
    } catch {
      // ignore missing thumbnail
    }
  }
}
