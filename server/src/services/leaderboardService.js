import { createUser,updateUserScore ,getTopN ,getAroundUser,getBottomN} from '../models/userModel.js';

export async function addNewUserService({ name, image_url, score }) {
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    throw new Error('Name is required (min 2 chars)');
  }

  const safeScore = Number.isFinite(score) ? Number(score) : 0;

  const img = image_url && typeof image_url === 'string' ? image_url.trim() : null;

  return await createUser({ name: name.trim(), image_url: img, score: safeScore });
}

export async function updateScoreService({ id, score, delta }) {
  const userId = Number(id);
  if (!Number.isInteger(userId)) throw new Error('Invalid user id');

  if (typeof score === 'number' && typeof delta === 'number') {
    throw new Error('Provide either "score" or "delta", not both');
  }
  if (typeof score !== 'number' && typeof delta !== 'number') {
    throw new Error('Provide "score" (absolute) or "delta" (increment)');
  }

  if (typeof score === 'number' && score < 0) {
    throw new Error('Score cannot be negative');
  }

  const updated = await updateUserScore({ id: userId, score, delta });
  if (!updated) throw new Error('User not found');
  return updated;
}

export async function topNService(limit) {
  const lim = Number(limit ?? 10);
  if (!Number.isFinite(lim) || lim <= 0 || lim > 1000) {
    throw new Error('Invalid limit (1-1000)');
  }
  return await getTopN(lim);
}

export async function aroundUserService(userId, windowSize = 5) {
  const uid = Number(userId);
  const w = Number(windowSize);
  if (!Number.isInteger(uid) || uid <= 0) throw new Error('Invalid user id');
  if (!Number.isFinite(w) || w < 1 || w > 50) throw new Error('Invalid window size');

  const result = await getAroundUser(uid, w);
  if (!result) throw new Error('User not found');
  return result;
}

export async function bottomNService(limit = 3) {
  const lim = Number(limit);
  if (!Number.isFinite(lim) || lim <= 0 || lim > 50) {
    throw new Error('Invalid limit');
  }
  return await getBottomN(lim);
}
