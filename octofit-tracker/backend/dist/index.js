"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./config/database")); // Ensure DB connection is established
const api_1 = require("./config/api");
const models_1 = require("./models");
const createApp = () => {
    const app = (0, express_1.default)();
    const PORT = Number(process.env.PORT || 8000);
    app.use(express_1.default.json());
    app.get('/health', (_req, res) => {
        res.json({ status: 'Server is running', port: PORT, apiBaseUrl: api_1.API_BASE_URL });
    });
    app.get('/api', (_req, res) => {
        res.json({
            message: 'Octofit Tracker API',
            baseUrl: api_1.API_BASE_URL,
            endpoints: ['/api/users/', '/api/teams/', '/api/activities/', '/api/leaderboard/', '/api/workouts/'],
        });
    });
    const ensureSeedData = async () => {
        // Wait for database connection to be ready
        if (database_1.default.readyState !== 1) {
            await new Promise((resolve) => {
                if (database_1.default.readyState === 1) {
                    resolve(null);
                }
                else {
                    const checkConnection = setInterval(() => {
                        if (database_1.default.readyState === 1) {
                            clearInterval(checkConnection);
                            resolve(null);
                        }
                    }, 100);
                }
            });
        }
        const [userCount, teamCount, activityCount, leaderboardCount, workoutCount] = await Promise.all([
            models_1.User.countDocuments(),
            models_1.Team.countDocuments(),
            models_1.Activity.countDocuments(),
            models_1.LeaderboardEntry.countDocuments(),
            models_1.Workout.countDocuments(),
        ]);
        if ([userCount, teamCount, activityCount, leaderboardCount, workoutCount].some((count) => count === 0)) {
            await (0, models_1.seedCollections)();
        }
    };
    app.get('/api/users/', async (_req, res) => {
        await ensureSeedData();
        const users = await models_1.User.find().sort({ createdAt: 1 }).lean();
        res.json(users);
    });
    app.post('/api/users/', async (req, res) => {
        const payload = req.body;
        const nextUser = await models_1.User.create({
            name: payload.name || 'New User',
            email: payload.email || 'newuser@example.com',
            team: payload.team || 'Unassigned',
        });
        res.status(201).json(nextUser);
    });
    app.get('/api/teams/', async (_req, res) => {
        await ensureSeedData();
        const teams = await models_1.Team.find().sort({ createdAt: 1 }).lean();
        res.json(teams);
    });
    app.post('/api/teams/', async (req, res) => {
        const payload = req.body;
        const nextTeam = await models_1.Team.create({
            name: payload.name || 'New Team',
            members: payload.members || [],
            points: payload.points || 0,
        });
        res.status(201).json(nextTeam);
    });
    app.get('/api/activities/', async (_req, res) => {
        await ensureSeedData();
        const activities = await models_1.Activity.find().sort({ createdAt: 1 }).lean();
        res.json(activities);
    });
    app.post('/api/activities/', async (req, res) => {
        const payload = req.body;
        const nextActivity = await models_1.Activity.create({
            user: payload.user || 'Unknown User',
            type: payload.type || 'Workout',
            minutes: payload.minutes || 0,
            date: payload.date || new Date().toISOString().slice(0, 10),
        });
        res.status(201).json(nextActivity);
    });
    app.get('/api/leaderboard/', async (_req, res) => {
        await ensureSeedData();
        const leaderboard = await models_1.LeaderboardEntry.find().sort({ points: -1, createdAt: 1 }).lean();
        res.json(leaderboard);
    });
    app.post('/api/leaderboard/', async (req, res) => {
        const payload = req.body;
        const nextEntry = await models_1.LeaderboardEntry.create({
            name: payload.name || 'New Athlete',
            team: payload.team || 'Unassigned',
            points: payload.points || 0,
        });
        res.status(201).json(nextEntry);
    });
    app.get('/api/workouts/', async (_req, res) => {
        await ensureSeedData();
        const workouts = await models_1.Workout.find().sort({ createdAt: 1 }).lean();
        res.json(workouts);
    });
    app.post('/api/workouts/', async (req, res) => {
        const payload = req.body;
        const nextWorkout = await models_1.Workout.create({
            title: payload.title || 'New Workout',
            difficulty: payload.difficulty || 'Beginner',
            duration: payload.duration || 15,
            focus: payload.focus || 'General Fitness',
        });
        res.status(201).json(nextWorkout);
    });
    return app;
};
exports.createApp = createApp;
//# sourceMappingURL=index.js.map