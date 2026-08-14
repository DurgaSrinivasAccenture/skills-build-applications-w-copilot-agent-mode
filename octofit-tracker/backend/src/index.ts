import express, { Express } from 'express';
import db from './config/database'; // Ensure DB connection is established
import { API_BASE_URL } from './config/api';
import { Activity, LeaderboardEntry, Team, User, Workout, seedCollections } from './models';

export const createApp = (): Express => {
  const app = express();
  const PORT = Number(process.env.PORT || 8000);

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'Server is running', port: PORT, apiBaseUrl: API_BASE_URL });
  });

  app.get('/api', (_req, res) => {
    res.json({
      message: 'Octofit Tracker API',
      baseUrl: API_BASE_URL,
      endpoints: ['/api/users/', '/api/teams/', '/api/activities/', '/api/leaderboard/', '/api/workouts/'],
    });
  });

  const ensureSeedData = async () => {
    // Wait for database connection to be ready
    if (db.readyState !== 1) {
      await new Promise((resolve) => {
        if (db.readyState === 1) {
          resolve(null);
        } else {
          const checkConnection = setInterval(() => {
            if (db.readyState === 1) {
              clearInterval(checkConnection);
              resolve(null);
            }
          }, 100);
        }
      });
    }

    const [userCount, teamCount, activityCount, leaderboardCount, workoutCount] = await Promise.all([
      User.countDocuments(),
      Team.countDocuments(),
      Activity.countDocuments(),
      LeaderboardEntry.countDocuments(),
      Workout.countDocuments(),
    ]);

    if ([userCount, teamCount, activityCount, leaderboardCount, workoutCount].some((count) => count === 0)) {
      await seedCollections();
    }
  };

  app.get('/api/users/', async (_req, res) => {
    await ensureSeedData();
    const users = await User.find().sort({ createdAt: 1 }).lean();
    res.json(users);
  });

  app.post('/api/users/', async (req, res) => {
    const payload = req.body as Partial<{ name: string; email: string; team: string }>;
    const nextUser = await User.create({
      name: payload.name || 'New User',
      email: payload.email || 'newuser@example.com',
      team: payload.team || 'Unassigned',
    });

    res.status(201).json(nextUser);
  });

  app.get('/api/teams/', async (_req, res) => {
    await ensureSeedData();
    const teams = await Team.find().sort({ createdAt: 1 }).lean();
    res.json(teams);
  });

  app.post('/api/teams/', async (req, res) => {
    const payload = req.body as Partial<{ name: string; members: string[]; points: number }>;
    const nextTeam = await Team.create({
      name: payload.name || 'New Team',
      members: payload.members || [],
      points: payload.points || 0,
    });

    res.status(201).json(nextTeam);
  });

  app.get('/api/activities/', async (_req, res) => {
    await ensureSeedData();
    const activities = await Activity.find().sort({ createdAt: 1 }).lean();
    res.json(activities);
  });

  app.post('/api/activities/', async (req, res) => {
    const payload = req.body as Partial<{ user: string; type: string; minutes: number; date: string }>;
    const nextActivity = await Activity.create({
      user: payload.user || 'Unknown User',
      type: payload.type || 'Workout',
      minutes: payload.minutes || 0,
      date: payload.date || new Date().toISOString().slice(0, 10),
    });

    res.status(201).json(nextActivity);
  });

  app.get('/api/leaderboard/', async (_req, res) => {
    await ensureSeedData();
    const leaderboard = await LeaderboardEntry.find().sort({ points: -1, createdAt: 1 }).lean();
    res.json(leaderboard);
  });

  app.post('/api/leaderboard/', async (req, res) => {
    const payload = req.body as Partial<{ name: string; team: string; points: number }>;
    const nextEntry = await LeaderboardEntry.create({
      name: payload.name || 'New Athlete',
      team: payload.team || 'Unassigned',
      points: payload.points || 0,
    });

    res.status(201).json(nextEntry);
  });

  app.get('/api/workouts/', async (_req, res) => {
    await ensureSeedData();
    const workouts = await Workout.find().sort({ createdAt: 1 }).lean();
    res.json(workouts);
  });

  app.post('/api/workouts/', async (req, res) => {
    const payload = req.body as Partial<{ title: string; difficulty: string; duration: number; focus: string }>;
    const nextWorkout = await Workout.create({
      title: payload.title || 'New Workout',
      difficulty: payload.difficulty || 'Beginner',
      duration: payload.duration || 15,
      focus: payload.focus || 'General Fitness',
    });

    res.status(201).json(nextWorkout);
  });

  return app;
};
