import Counter from '../models/Counter.js';

export const generateIssueId = async () => {
  try {
    const counter = await Counter.findByIdAndUpdate(
      'issueId',
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    
    return `RMS${counter.sequence_value}`;
  } catch (error) {
    console.error('Error generating issue ID:', error);
    // Fallback to timestamp-based ID
    return `RMS${Date.now()}`;
  }
};