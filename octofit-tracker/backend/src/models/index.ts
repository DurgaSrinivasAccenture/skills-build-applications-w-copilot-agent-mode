import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    team: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

const teamSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    members: [{ type: String, trim: true }],
    points: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const activitySchema = new Schema(
  {
    user: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    minutes: { type: Number, required: true, min: 0 },
    date: { type: String, required: true },
  },
  { timestamps: true },
);

const leaderboardEntrySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    team: { type: String, required: true, trim: true },
    points: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

const workoutSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    difficulty: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, min: 0 },
    focus: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema>;
export type TeamDocument = InferSchemaType<typeof teamSchema>;
export type ActivityDocument = InferSchemaType<typeof activitySchema>;
export type LeaderboardEntryDocument = InferSchemaType<typeof leaderboardEntrySchema>;
export type WorkoutDocument = InferSchemaType<typeof workoutSchema>;

export const User = mongoose.model('User', userSchema);
export const Team = mongoose.model('Team', teamSchema);
export const Activity = mongoose.model('Activity', activitySchema);
export const LeaderboardEntry = mongoose.model('LeaderboardEntry', leaderboardEntrySchema);
export const Workout = mongoose.model('Workout', workoutSchema);

export async function seedCollections() {
  await Promise.all([
    User.deleteMany({}),
    Team.deleteMany({}),
    Activity.deleteMany({}),
    LeaderboardEntry.deleteMany({}),
    Workout.deleteMany({}),
  ]);

  const seededUsers = await User.insertMany([
    { name: 'Maya Chen', email: 'maya@example.com', team: 'Red Falcons' },
    { name: 'Leo Martinez', email: 'leo@example.com', team: 'Blue Sharks' },
    { name: 'Ava Johnson', email: 'ava@example.com', team: 'Red Falcons' },
  ]);

  await Team.insertMany([
    { name: 'Red Falcons', members: ['Maya Chen', 'Ava Johnson'], points: 420 },
    { name: 'Blue Sharks', members: ['Leo Martinez'], points: 360 },
  ]);

  await Activity.insertMany([
    { user: 'Maya Chen', type: 'Running', minutes: 35, date: '2026-08-11' },
    { user: 'Leo Martinez', type: 'Strength', minutes: 40, date: '2026-08-12' },
    { user: 'Ava Johnson', type: 'Cycling', minutes: 30, date: '2026-08-10' },
  ]);

  await LeaderboardEntry.insertMany([
    { name: 'Maya Chen', team: 'Red Falcons', points: 420 },
    { name: 'Ava Johnson', team: 'Red Falcons', points: 390 },
    { name: 'Leo Martinez', team: 'Blue Sharks', points: 360 },
  ]);

  await Workout.insertMany([
    { title: 'Cardio Blast', difficulty: 'Moderate', duration: 25, focus: 'Endurance' },
    { title: 'Core Circuit', difficulty: 'Intermediate', duration: 20, focus: 'Strength' },
    { title: 'Sprint Intervals', difficulty: 'Advanced', duration: 18, focus: 'Speed' },
  ]);

  return { users: seededUsers };
}
