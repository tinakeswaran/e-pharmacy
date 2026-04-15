'use client';

import { useState, useEffect } from 'react';
import { Pill, Search, ShoppingCart, Filter, X, Check, ShieldCheck, Loader2, Plus, Minus, ArrowRight, RefreshCcw, Bell, CreditCard, Lock, Star, MessageSquare, Trash2, CreditCard as CardIcon } from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  description: string;
  requiresPrescription: boolean;
}

interface Review {
  id: string;
  medicineId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface CartItem extends Medicine {
  quantity: number;
}

export default function UserDashboardPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); 
  const [reminders, setReminders] = useState<{id: string, message: string}[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  
  // Checkout Form State
  const [address, setAddress] = useState({
    name: '',
    street: '',
    city: '',
    zip: ''
  });
  const [payment, setPayment] = useState({
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    fetchMedicines();
    fetchReviews();
    setReminders([{ id: '1', message: 'Your Paracetamol supply might be running low. Order a refill now!' }]);
    
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('pharma-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pharma-cart', JSON.stringify(cart));
  }, [cart]);

  const fetchMedicines = async () => {
    setLoading(true);
    const res = await fetch('/api/medicines');
    const data = await res.json();
    setMedicines(data);
    setLoading(false);
  };

  const fetchReviews = async () => {
    const res = await fetch('/api/reviews');
    const data = await res.json();
    setReviews(data);
  };

  const addToCart = (medicine: Medicine) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        return prev.map(item => item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    setProcessing(true);
    // Simulate payment delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const orderData = {
      userId: 'bwc7d7y15', // Mocked user ID from db.json
      customerName: address.name || 'Current User',
      shippingAddress: `${address.street}, ${address.city}, ${address.zip}`,
      items: cart.map(item => ({
        medicineId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: cartTotal + 2.50, // Including shipping
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (res.ok) {
      setCheckoutStep(3);
      setCart([]);
      localStorage.removeItem('pharma-cart');
    }
    setProcessing(false);
  };

  const submitReview = async () => {
    if (!selectedMedicine) return;
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        medicineId: selectedMedicine.id,
        username: 'Current User',
        ...newReview
      })
    });
    if (res.ok) {
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    }
  };

  const filteredMedicines = medicines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getAvgRating = (medId: string) => {
    const medReviews = reviews.filter(r => r.medicineId === medId);
    if (!medReviews.length) return 0;
    return medReviews.reduce((a, b) => a + b.rating, 0) / medReviews.length;
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {reminders.length > 0 && (
        <div style={{ background: 'linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%)', padding: '1.25rem 2rem', borderRadius: '16px', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #bfdbfe' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)' }}>
                 <Bell size={20} />
              </div>
              <p style={{ color: '#1e40af', fontWeight: 700, fontSize: '0.95rem' }}>{reminders[0].message}</p>
           </div>
           <button style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCcw size={16} /> Refill Now
           </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input className="input-premium" style={{ paddingLeft: '3.5rem' }} placeholder="Search medicines..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select className="input-premium" style={{ width: '220px', fontWeight: 700 }} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Tablets">Tablets</option>
          <option value="Syrups">Syrups</option>
          <option value="Pain Relief">Pain Relief</option>
          <option value="Antibiotics">Antibiotics</option>
          <option value="Cold & Flu">Cold & Flu</option>
          <option value="Inhalers">Inhalers</option>
          <option value="Eye Drops">Eye Drops</option>
          <option value="Ointments">Ointments</option>
        </select>
        <button onClick={() => setIsCartOpen(true)} className="btn-premium" style={{ background: '#0f172a', position: 'relative' }}>
          <ShoppingCart size={20} /> Cart
          {cart.length > 0 && (
            <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#3b82f6', color: 'white', fontSize: '0.7rem', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white', fontWeight: 900 }}>
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {filteredMedicines.map((med) => (
          <div key={med.id} className="glass-panel med-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}><Pill size={24} /></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b' }}>
                   <Star size={16} fill={getAvgRating(med.id) > 0 ? "#f59e0b" : "none"} />
                   <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{getAvgRating(med.id) || 'New'}</span>
                </div>
             </div>
             <h3 style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '0.5rem' }}>{med.name}</h3>
             <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>{med.description}</p>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>₹{med.price.toFixed(2)}</span>
               {med.stock < 20 && <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 800 }}>Only {med.stock} left!</span>}
             </div>
             <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setSelectedMedicine(med)} className="btn-premium" style={{ flex: 1, background: '#f1f5f9', color: '#1e293b' }}>Details</button>
                <button onClick={() => addToCart(med)} className="btn-premium" style={{ flex: 1.5, background: '#3b82f6' }}>Add Cart +</button>
             </div>
          </div>
        ))}
      </div>

      {/* Medicine Details Modal */}
      {selectedMedicine && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
           <div onClick={() => setSelectedMedicine(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(10px)' }}></div>
           <div className="animate-fade-in glass-panel" style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', padding: '0' }}>
              <div style={{ padding: '2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                 <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{selectedMedicine.name}</h2>
                    <p style={{ color: '#3b82f6', fontWeight: 800 }}>{selectedMedicine.brand} • {selectedMedicine.category}</p>
                 </div>
                 <button onClick={() => setSelectedMedicine(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={32} /></button>
              </div>
              
              <div style={{ padding: '2rem' }}>
                 <p style={{ lineHeight: 1.8, color: '#475569', fontSize: '1.1rem', marginBottom: '2.5rem' }}>{selectedMedicine.description}</p>
                 
                 <h3 style={{ fontWeight: 900, fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <MessageSquare size={20} color="#3b82f6" /> Reviews & Feedback
                 </h3>

                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                    {reviews.filter(r => r.medicineId === selectedMedicine.id).map(r => (
                       <div key={r.id} style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                             <span style={{ fontWeight: 900 }}>{r.username}</span>
                             <div style={{ display: 'flex', gap: '2px' }}>
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < r.rating ? "#f59e0b" : "none"} color="#f59e0b" />)}
                             </div>
                          </div>
                          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{r.comment}</p>
                       </div>
                    ))}
                    {reviews.filter(r => r.medicineId === selectedMedicine.id).length === 0 && (
                       <p style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontStyle: 'italic' }}>No reviews yet. Be the first!</p>
                    )}
                 </div>

                 <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '20px' }}>
                    <h4 style={{ fontWeight: 900, fontSize: '0.9rem', marginBottom: '1rem' }}>Write a Review</h4>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                       {[1, 2, 3, 4, 5].map(nu => (
                          <button key={nu} onClick={() => setNewReview({...newReview, rating: nu})} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                             <Star size={24} fill={nu <= newReview.rating ? "#f59e0b" : "none"} color="#f59e0b" />
                          </button>
                       ))}
                    </div>
                    <textarea 
                      className="input-premium" 
                      style={{ background: 'white', minHeight: '80px', marginBottom: '1rem' }} 
                      placeholder="Share your experience..."
                      value={newReview.comment}
                      onChange={e => setNewReview({...newReview, comment: e.target.value})}
                    />
                    <button onClick={submitReview} className="btn-premium" style={{ width: '100%', background: '#0f172a' }}>Submit Review</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
          <div onClick={() => setIsCartOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(5px)' }}></div>
          <div className="animate-fade-in glass-panel" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '100%', maxWidth: '450px', borderRadius: '24px 0 0 24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h2 style={{ fontSize: '1.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><ShoppingCart /> Shopping Cart</h2>
               <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24} /></button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '64px', height: '64px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', color: '#3b82f6' }}>
                    <Pill size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 800, fontSize: '1rem' }}>{item.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>₹{item.price.toFixed(2)} each</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '0.4rem', borderRadius: '10px' }}>
                    <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><Minus size={16} /></button>
                    <span style={{ fontWeight: 900, width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><Plus size={16} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {cart.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                   <div style={{ width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#cbd5e1' }}><ShoppingCart size={40} /></div>
                   <h3 style={{ fontWeight: 800, color: '#94a3b8' }}>Your cart is empty</h3>
                   <button onClick={() => setIsCartOpen(false)} className="btn-premium" style={{ background: '#3b82f6', marginTop: '1.5rem', fontSize: '0.9rem' }}>Continue Shopping</button>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ padding: '2rem', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 600, color: '#64748b' }}>Subtotal</span>
                  <span style={{ fontWeight: 800 }}>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <span style={{ fontWeight: 600, color: '#64748b' }}>Shipping</span>
                  <span style={{ fontWeight: 800 }}>₹2.50</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                  <h3 style={{ fontWeight: 900 }}>Total</h3>
                  <h3 style={{ fontWeight: 900, color: '#3b82f6' }}>₹{(cartTotal + 2.50).toFixed(2)}</h3>
                </div>
                <button 
                  onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} 
                  className="btn-premium" 
                  style={{ width: '100%', background: '#0f172a', padding: '1.25rem' }}
                >
                  Checkout <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div onClick={() => !processing && setIsCheckoutOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(10px)' }}></div>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', borderRadius: '32px' }}>
            
            {/* Steps Indicator */}
            <div style={{ padding: '2rem 2rem 0', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
               {[1, 2, 3].map(step => (
                 <div key={step} style={{ 
                   width: '40px', height: '8px', borderRadius: '4px',
                   background: checkoutStep >= step ? '#3b82f6' : '#e2e8f0',
                   transition: 'all 0.3s'
                 }}></div>
               ))}
            </div>

            {/* Step 1: Shipping Details */}
            {checkoutStep === 1 && (
              <div style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Shipping Details</h2>
                <p style={{ color: '#64748b', fontWeight: 600, marginBottom: '2.5rem' }}>Where should we deliver your medicine?</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#475569' }}>Full Name</label>
                    <input className="input-premium" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} placeholder="e.g. John Doe" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#475569' }}>Street Address</label>
                    <input className="input-premium" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} placeholder="123 Pharma St" />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1.5 }}>
                      <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#475569' }}>City</label>
                      <input className="input-premium" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} placeholder="New York" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#475569' }}>ZIP Code</label>
                      <input className="input-premium" value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} placeholder="10001" />
                    </div>
                  </div>
                  <button 
                    onClick={() => address.name && address.street && setCheckoutStep(2)} 
                    disabled={!address.name || !address.street}
                    className="btn-premium" 
                    style={{ width: '100%', background: '#3b82f6', marginTop: '1.5rem', padding: '1.25rem', opacity: (!address.name || !address.street) ? 0.6 : 1 }}
                  >
                    Continue to Payment
                  </button>
                  <button onClick={() => setIsCheckoutOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Details */}
            {checkoutStep === 2 && (
              <div style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Secure Payment</h2>
                <p style={{ color: '#64748b', fontWeight: 600, marginBottom: '2.5rem' }}>Your transaction is encrypted and secure.</p>
                
                <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '2rem', borderRadius: '20px', color: 'white', marginBottom: '2.5rem', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.3)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
                      <ShieldCheck size={32} color="#3b82f6" />
                      <CardIcon size={32} />
                   </div>
                   <div style={{ fontSize: '1.5rem', letterSpacing: '2px', fontWeight: 600, marginBottom: '2rem' }}>
                      {payment.cardNumber || '•••• •••• •••• ••••'}
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.6, marginBottom: '0.25rem' }}>Card Holder</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{address.name.toUpperCase() || 'NAME SURNAME'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.6, marginBottom: '0.25rem' }}>Expiry</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{payment.expiry || 'MM/YY'}</div>
                      </div>
                   </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#475569' }}>Card Number</label>
                    <div style={{ position: 'relative' }}>
                       <input className="input-premium" value={payment.cardNumber} onChange={e => setPayment({...payment, cardNumber: e.target.value})} placeholder="0000 0000 0000 0000" maxLength={19} />
                       <Lock size={18} style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#475569' }}>Expiry</label>
                      <input className="input-premium" value={payment.expiry} onChange={e => setPayment({...payment, expiry: e.target.value})} placeholder="MM/YY" maxLength={5} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#475569' }}>CVV</label>
                      <input className="input-premium" value={payment.cvv} onChange={e => setPayment({...payment, cvv: e.target.value})} placeholder="123" maxLength={3} />
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleCheckout} 
                    disabled={processing || !payment.cardNumber}
                    className="btn-premium" 
                    style={{ width: '100%', background: '#0f172a', marginTop: '1.5rem', padding: '1.25rem', display: 'flex', justifyContent: 'center' }}
                  >
                    {processing ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : `Pay ₹${(cartTotal + 2.50).toFixed(2)}`}
                  </button>
                  <button onClick={() => setCheckoutStep(1)} disabled={processing} style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}>Back to Shipping</button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {checkoutStep === 3 && (
              <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                 <div style={{ width: '100px', height: '100px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: '#10b981' }}>
                    <Check size={64} strokeWidth={3} />
                 </div>
                 <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Success!</h2>
                 <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 600, marginBottom: '3rem', maxWidth: '350px', margin: '0 auto 3rem' }}>
                   Your order has been placed successfully and will be delivered in 3-5 business days.
                 </p>
                 <button 
                   onClick={() => { setIsCheckoutOpen(false); setCheckoutStep(1); }} 
                   className="btn-premium" 
                   style={{ background: '#3b82f6', padding: '1rem 3rem', margin: '0 auto' }}
                 >
                   Done
                 </button>
              </div>
            )}

          </div>
        </div>
      )}

      <style jsx>{`
        .med-card { transition: all 0.3s; }
        .med-card:hover { transform: translateY(-5px); border-color: #3b82f6; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
