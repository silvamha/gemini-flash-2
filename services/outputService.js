// outputService.js - Handles Harper's sound engineering outputs
import { db, queries } from '../data/db.js';

// Service to handle Harper's outputs
const outputService = {
    // Save a new output
    saveOutput: (type, content, metadata = {}) => {
        try {
            const timestamp = new Date().toISOString();
            queries.insertOutput.run(timestamp, type, content, JSON.stringify(metadata));
            return true;
        } catch (error) {
            console.error('Error saving output:', error);
            return false;
        }
    },

    // Get recent outputs
    getRecentOutputs: (limit = 10) => {
        try {
            return queries.getRecentOutputs.all(limit);
        } catch (error) {
            console.error('Error getting recent outputs:', error);
            return [];
        }
    },

    // Get outputs by type (e.g., 'sound_engineering', 'analysis')
    getOutputsByType: (type) => {
        try {
            return queries.getOutputsByType.all(type);
        } catch (error) {
            console.error('Error getting outputs by type:', error);
            return [];
        }
    }
};

export default outputService;

