import fs from 'fs-extra';
import path from 'path';

// Define the reminder data structure
export interface ReminderData {
  id: string;
  email: string;
  date: string;
  time: string;
  sentConfirmation: boolean;
  sentReminder: boolean;
  createdAt: string;
}

// Path to the JSON file that will store our reminders
const DATA_FILE = path.join(process.cwd(), 'data', 'reminders.json');

// Ensure the data directory exists
const ensureDataFile = async (): Promise<void> => {
  try {
    await fs.ensureDir(path.dirname(DATA_FILE));
    
    // Create the file if it doesn't exist
    if (!(await fs.pathExists(DATA_FILE))) {
      await fs.writeJson(DATA_FILE, { reminders: [] });
    }
  } catch (error) {
    console.error('Error ensuring data file exists:', error);
    throw error;
  }
};

// Get all reminders
export const getAllReminders = async (): Promise<ReminderData[]> => {
  try {
    await ensureDataFile();
    const data = await fs.readJson(DATA_FILE);
    return data.reminders || [];
  } catch (error) {
    console.error('Error getting reminders:', error);
    return [];
  }
};

// Add a new reminder
export const addReminder = async (reminderData: Omit<ReminderData, 'id' | 'sentConfirmation' | 'sentReminder' | 'createdAt'>): Promise<ReminderData> => {
  try {
    await ensureDataFile();
    
    const reminders = await getAllReminders();
    
    // Create a new reminder with a unique ID
    const newReminder: ReminderData = {
      ...reminderData,
      id: Date.now().toString(),
      sentConfirmation: false,
      sentReminder: false,
      createdAt: new Date().toISOString(),
    };
    
    // Add the new reminder to the list
    reminders.push(newReminder);
    
    // Save the updated list
    await fs.writeJson(DATA_FILE, { reminders });
    
    return newReminder;
  } catch (error) {
    console.error('Error adding reminder:', error);
    throw error;
  }
};

// Update a reminder
export const updateReminder = async (id: string, updates: Partial<ReminderData>): Promise<ReminderData | null> => {
  try {
    await ensureDataFile();
    
    const reminders = await getAllReminders();
    
    // Find the reminder to update
    const index = reminders.findIndex(reminder => reminder.id === id);
    
    if (index === -1) {
      return null;
    }
    
    // Update the reminder
    reminders[index] = {
      ...reminders[index],
      ...updates,
    };
    
    // Save the updated list
    await fs.writeJson(DATA_FILE, { reminders });
    
    return reminders[index];
  } catch (error) {
    console.error('Error updating reminder:', error);
    throw error;
  }
};

// Get pending reminders that need to be sent
export const getPendingReminders = async (): Promise<ReminderData[]> => {
  try {
    const reminders = await getAllReminders();
    
    // Get the current time
    const now = new Date();
    
    // Filter reminders that are due and haven't been sent yet
    return reminders.filter(reminder => {
      // Parse the reminder date and time
      const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
      
      // Check if the reminder is due and hasn't been sent
      return !reminder.sentReminder && reminderDateTime <= now;
    });
  } catch (error) {
    console.error('Error getting pending reminders:', error);
    return [];
  }
};

// Get reminders that need confirmation emails
export const getUnconfirmedReminders = async (): Promise<ReminderData[]> => {
  try {
    const reminders = await getAllReminders();
    
    // Filter reminders that haven't had confirmation emails sent
    return reminders.filter(reminder => !reminder.sentConfirmation);
  } catch (error) {
    console.error('Error getting unconfirmed reminders:', error);
    return [];
  }
};