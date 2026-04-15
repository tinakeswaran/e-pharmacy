// Database module - updated to reflect latest medicines
import fs from 'fs';
import path from 'path';

export type Role = 'Admin' | 'User';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  description: string;
  requiresPrescription: boolean;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  items: { medicineId: string; name: string; quantity: number; price: number }[];
  date: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Paid' | 'Unpaid';
  estimatedDelivery?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'Info' | 'Promotion' | 'Alert' | 'System' | 'Refill';
  target: 'All' | string; 
  createdAt: string;
  readBy: string[]; 
}

export interface Review {
  id: string;
  medicineId: string; // 'general' for service feedback
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const DB_FILE = path.join(process.cwd(), 'db.json');

class MockDB {
  public users: User[] = [];
  public medicines: Medicine[] = [];
  public orders: Order[] = [];
  public notifications: Notification[] = [];
  public reviews: Review[] = [];

  constructor() {
    this.load();
  }

  public load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        this.users = data.users || [];
        this.medicines = data.medicines || [];
        this.orders = data.orders || [];
        this.notifications = data.notifications || [];
        this.reviews = data.reviews || [];
      } else {
        this.initializeDefaultData();
      }
    } catch (error) {
      this.initializeDefaultData();
    }
  }

  private initializeDefaultData() {
    this.users = [
      { id: '1', username: 'admin', email: 'admin@pharma.com', passwordHash: 'password', role: 'Admin', createdAt: new Date().toISOString() },
      { id: '2', username: 'johndoe', email: 'john@gmail.com', passwordHash: 'password', role: 'User', createdAt: new Date().toISOString() }
    ];
    this.medicines = [
      { id: '1', name: 'Paracetamol 500mg', category: 'Tablets', brand: 'Panadol', price: 25.00, stock: 120, description: 'Effective pain relief and fever reducer for adults.', requiresPrescription: false },
      { id: '3', name: 'Benadryl Cough Syrup', category: 'Syrups', brand: 'Johnson & Johnson', price: 95.00, stock: 85, description: 'Fast-acting relief for dry and irritating coughs.', requiresPrescription: false },
      { id: '9', name: 'Ventolin Inhaler', category: 'Inhalers', brand: 'GSK', price: 1250.00, stock: 30, description: 'Relieves symptoms of asthma and COPD.', requiresPrescription: true },
      { id: '10', name: 'Visine Eye Drops', category: 'Eye Drops', brand: 'Johnson & Johnson', price: 110.00, stock: 70, description: 'Relieves redness and irritation in the eyes.', requiresPrescription: false },
      { id: '13', name: 'Betadine Ointment', category: 'Ointments', brand: 'Mundipharma', price: 60.00, stock: 120, description: 'Antiseptic for minor cuts, scrapes, and burns.', requiresPrescription: false }
    ];
    this.orders = [
      { id: 'ORD001', userId: '2', customerName: 'John Doe', items: [{ medicineId: '1', name: 'Paracetamol', quantity: 2, price: 5.99 }], date: '2026-04-12', total: 11.98, status: 'Processing', paymentStatus: 'Paid', estimatedDelivery: '2026-04-15' }
    ];
    this.notifications = [
      { id: '1', title: 'Welcome!', message: 'Welcome to the E-Pharmacy system.', type: 'System', target: 'All', createdAt: new Date().toISOString(), readBy: [] },
      { id: 'refill1', title: 'Refill Reminder', message: 'Your Paracetamol supply might be running low. Order a refill now!', type: 'Refill', target: '2', createdAt: new Date().toISOString(), readBy: [] }
    ];
    this.reviews = [
      { id: 'r1', medicineId: '1', userId: '2', username: 'johndoe', rating: 5, comment: 'Very effective and fast delivery!', createdAt: new Date().toISOString() }
    ];
    this.save();
  }

  public save() {
    try {
      const data = {
        users: this.users,
        medicines: this.medicines,
        orders: this.orders,
        notifications: this.notifications,
        reviews: this.reviews
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Failed to save DB:', error);
    }
  }
}

const globalForDb = global as unknown as { db: MockDB };
export const db = globalForDb.db || new MockDB();
if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
