import mongoose from 'mongoose';
import { getConfig } from './config';
import { getModuleLogger } from './logger';

export const connectDB = async (): Promise<void> => {
    const log = getModuleLogger('db');
    try {
        const { mongoUri } = getConfig();
        await mongoose.connect(mongoUri);
        log.info('MongoDB connected');
    } catch (err) {
        log.error('MongoDB connection failed', { err });
        throw err;
    }
};
