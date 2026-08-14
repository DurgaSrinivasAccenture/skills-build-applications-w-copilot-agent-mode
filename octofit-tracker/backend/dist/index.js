"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./config/database"));
const api_1 = require("./config/api");
const users = [
    { id: 1, name: 'Maya Chen', email: 'maya@example.com', team: 'Red Falcons' },
    { id: 2, name: 'Leo Martinez', email: 'leo@example.com', team: 'Blue Sharks' },
    { id: 3, name: 'Ava Johnson', email: 'ava@example.com', team: 'Red Falcons' },
];
const teams = [
    { id: 1, name: 'Red Falcons', members: ['Maya Chen', 'Ava Johnson'], points: 420 },
    { id: 2, name: 'Blue Sharks', members: ['Leo Martinez'], points: 360 },
];
const activities = [
    { id: 1, user: 'Maya Chen', type: 'Running', minutes: 35, date: '2026-08-11' },
    { id: 2, user: 'Leo Martinez', type: 'Strength', minutes: 40, date: '2026-08-12' },
    { id: 3, user: 'Ava Johnson', type: 'Cycling', minutes: 30, date: '2026-08-10' },
];
const leaderboard = [
    { id: 1, name: 'Maya Chen', team: 'Red Falcons', points: 420 },
    { id: 2, name: 'Ava Johnson', team: 'Red Falcons', points: 390 },
    { id: 3, name: 'Leo Martinez', team: 'Blue Sharks', points: 360 },
];
const workouts = [
    { id: 1, title: 'Cardio Blast', difficulty: 'Moderate', duration: 25, focus: 'Endurance' },
    { id: 2, title: 'Core Circuit', difficulty: 'Intermediate', duration: 20, focus: 'Strength' },
    { id: 3, title: 'Sprint Intervals', difficulty: 'Advanced', duration: 18, focus: 'Speed' },
];
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
    app.get('/api/users/', (_req, res) => {
        res.json(users);
    });
    app.post('/api/users/', (req, res) => {
        const payload = req.body;
        const nextUser = {
            id: users.length ? Math.max(...users.map((user) => user.id)) + 1 : 1,
            name: payload.name || 'New User',
            email: payload.email || 'newuser@example.com',
            team: payload.team || 'Unassigned',
        };
        users.push(nextUser);
        res.status(201).json(nextUser);
    });
    app.get('/api/teams/', (_req, res) => {
        res.json(teams);
    });
    app.post('/api/teams/', (req, res) => {
        const payload = req.body;
        const nextTeam = {
            id: teams.length ? Math.max(...teams.map((team) => team.id)) + 1 : 1,
            name: payload.name || 'New Team',
            members: payload.members || [],
            points: payload.points || 0,
        };
        teams.push(nextTeam);
        res.status(201).json(nextTeam);
    });
    app.get('/api/activities/', (_req, res) => {
        res.json(activities);
    });
    app.post('/api/activities/', (req, res) => {
        const payload = req.body;
        const nextActivity = {
            id: activities.length ? Math.max(...activities.map((activity) => activity.id)) + 1 : 1,
            user: payload.user || 'Unknown User',
            type: payload.type || 'Workout',
            minutes: payload.minutes || 0,
            date: payload.date || new Date().toISOString().slice(0, 10),
        };
        activities.push(nextActivity);
        res.status(201).json(nextActivity);
    });
    app.get('/api/leaderboard/', (_req, res) => {
        res.json(leaderboard);
    });
    app.post('/api/leaderboard/', (req, res) => {
        const payload = req.body;
        const nextEntry = {
            id: leaderboard.length ? Math.max(...leaderboard.map((entry) => entry.id)) + 1 : 1,
            name: payload.name || 'New Athlete',
            team: payload.team || 'Unassigned',
            points: payload.points || 0,
        };
        leaderboard.push(nextEntry);
        res.status(201).json(nextEntry);
    });
    app.get('/api/workouts/', (_req, res) => {
        res.json(workouts);
    });
    app.post('/api/workouts/', (req, res) => {
        const payload = req.body;
        const nextWorkout = {
            id: workouts.length ? Math.max(...workouts.map((workout) => workout.id)) + 1 : 1,
            title: payload.title || 'New Workout',
            difficulty: payload.difficulty || 'Beginner',
            duration: payload.duration || 15,
            focus: payload.focus || 'General Fitness',
        };
        workouts.push(nextWorkout);
        res.status(201).json(nextWorkout);
    });
    return app;
};
exports.createApp = createApp;
if (require.main === module) {
    const app = (0, exports.createApp)();
    const port = Number(process.env.PORT || 8000);
    app.listen(port, () => {
        console.log(`Octofit Tracker API running on http://localhost:${port}`);
        console.log(`Codespaces API URL: ${api_1.API_BASE_URL}`);
    });
    database_1.default.on('error', console.error.bind(console, 'MongoDB connection error:'));
}
//# sourceMappingURL=index.js.map