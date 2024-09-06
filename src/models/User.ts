import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  avatarUrl: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  resetToken?: string;
  resetTokenExpiry?: Date;
  lastPasswordReset?: Date;
}

interface IUserModel extends Model<IUser> {
  // 如果需要,可以添加静态方法
}

const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatarUrl: { type: String, default: '/default-avatar.png' },
  resetToken: String,
  resetTokenExpiry: Date,
  lastPasswordReset: Date,
});

UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) {
    console.log('Password not modified, skipping hashing');
    return next();
  }

  try {
    console.log('Pre-save hook: Hashing password for user:', this.username);
    console.log('Pre-save hook: Original password:', this.password);
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Pre-save hook: New hashed password:', this.password);
    next();
  } catch (error) {
    console.error('Pre-save hook: Error hashing password:', error);
    next(error as Error);
  }
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    console.log('Comparing passwords for user:', this.username);
    console.log('Stored hashed password:', this.password);
    console.log('Candidate password:', candidatePassword);
    
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('bcrypt.compare result:', isMatch);
    
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
};

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;