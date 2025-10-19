import { addNewUserService,updateScoreService ,topNService,aroundUserService,bottomNService} from '../services/leaderboardService.js';

export async function addUserController(req, res) {
  try {
    const user = await addNewUserService(req.body);
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function updateScoreController(req, res) {
  try {
    const { id } = req.params;
    const { score, delta } = req.body; 
    const user = await updateScoreService({ id, score, delta });
    res.json(user);
  } catch (e) {
    const status = e.message === 'User not found' ? 404 : 400;
    res.status(status).json({ error: e.message });
  }
}

export async function topController(req, res) {
  try {
    const users = await topNService(req.query.limit);
    res.json(users);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function aroundController(req, res) {
  try {
    const { userId } = req.params;
    const windowSize = req.query.window ? Number(req.query.window) : 5;
    const result = await aroundUserService(userId, windowSize);
    res.json(result);
  } catch (e) {
    const status = e.message === 'User not found' ? 404 : 400;
    res.status(status).json({ error: e.message });
  }
}

export async function bottomController(req, res) {
  try {
    const limit = req.query.limit || 3;
    const users = await bottomNService(limit);
    res.json(users);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}