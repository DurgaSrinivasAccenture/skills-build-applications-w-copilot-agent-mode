"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workout = exports.LeaderboardEntry = exports.Activity = exports.Team = exports.User = void 0;
exports.seedCollections = seedCollections;
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    team: { type: String, required: true, trim: true },
}, { timestamps: true });
const teamSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    members: [{ type: String, trim: true }],
    points: { type: Number, default: 0 },
}, { timestamps: true });
const activitySchema = new mongoose_1.Schema({
    user: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    minutes: { type: Number, required: true, min: 0 },
    date: { type: String, required: true },
}, { timestamps: true });
const leaderboardEntrySchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    team: { type: String, required: true, trim: true },
    points: { type: Number, required: true, min: 0 },
}, { timestamps: true });
const workoutSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    difficulty: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, min: 0 },
    focus: { type: String, required: true, trim: true },
}, { timestamps: true });
exports.User = mongoose_1.default.model('User', userSchema);
exports.Team = mongoose_1.default.model('Team', teamSchema);
exports.Activity = mongoose_1.default.model('Activity', activitySchema);
exports.LeaderboardEntry = mongoose_1.default.model('LeaderboardEntry', leaderboardEntrySchema);
exports.Workout = mongoose_1.default.model('Workout', workoutSchema);
async function seedCollections() {
    await Promise.all([
        exports.User.deleteMany({}),
        exports.Team.deleteMany({}),
        exports.Activity.deleteMany({}),
        exports.LeaderboardEntry.deleteMany({}),
        exports.Workout.deleteMany({}),
    ]);
    const seededUsers = await exports.User.insertMany([
        { name: 'Maya Chen', email: 'maya@example.com', team: 'Red Falcons' },
        { name: 'Leo Martinez', email: 'leo@example.com', team: 'Blue Sharks' },
        { name: 'Ava Johnson', email: 'ava@example.com', team: 'Red Falcons' },
    ]);
    await exports.Team.insertMany([
        { name: 'Red Falcons', members: ['Maya Chen', 'Ava Johnson'], points: 420 },
        { name: 'Blue Sharks', members: ['Leo Martinez'], points: 360 },
    ]);
    await exports.Activity.insertMany([
        { user: 'Maya Chen', type: 'Running', minutes: 35, date: '2026-08-11' },
        { user: 'Leo Martinez', type: 'Strength', minutes: 40, date: '2026-08-12' },
        { user: 'Ava Johnson', type: 'Cycling', minutes: 30, date: '2026-08-10' },
    ]);
    await exports.LeaderboardEntry.insertMany([
        { name: 'Maya Chen', team: 'Red Falcons', points: 420 },
        { name: 'Ava Johnson', team: 'Red Falcons', points: 390 },
        { name: 'Leo Martinez', team: 'Blue Sharks', points: 360 },
    ]);
    await exports.Workout.insertMany([
        { title: 'Cardio Blast', difficulty: 'Moderate', duration: 25, focus: 'Endurance' },
        { title: 'Core Circuit', difficulty: 'Intermediate', duration: 20, focus: 'Strength' },
        { title: 'Sprint Intervals', difficulty: 'Advanced', duration: 18, focus: 'Speed' },
    ]);
    return { users: seededUsers };
}
//# sourceMappingURL=index.js.map