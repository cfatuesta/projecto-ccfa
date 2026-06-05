import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default function TestimonialManager() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        quote: '',
        name: '',
        location: '',
        color: 'teal', // Default
        img: ''
    });
    const [isEditing, setIsEditing] = useState(null);

    const testimonialCollection = collection(db, 'testimonials');

    useEffect(() => {
        const fetchTestimonials = async () => {
            const data = await getDocs(testimonialCollection);
            setTestimonials(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
            setLoading(false);
        };
        fetchTestimonials();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                const testimonialDoc = doc(db, 'testimonials', isEditing);
                await updateDoc(testimonialDoc, form);
                setTestimonials(testimonials.map(t => t.id === isEditing ? { ...t, ...form } : t));
                setIsEditing(null);
            } else {
                const newDoc = await addDoc(testimonialCollection, form);
                setTestimonials([...testimonials, { ...form, id: newDoc.id }]);
            }
            setForm({ quote: '', name: '', location: '', color: 'teal', img: '' });
        } catch (error) {
            console.error("Error submitting testimonial:", error);
        }
    };

    const handleEdit = (testimonial) => {
        setForm(testimonial);
        setIsEditing(testimonial.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            await deleteDoc(doc(db, 'testimonials', id));
            setTestimonials(testimonials.filter(t => t.id !== id));
        }
    };

    return (
        <div className="manager-container">
            <h2>Manage Testimonials</h2>

            <form onSubmit={handleSubmit} className="admin-form">
                <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
                <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
                <textarea name="quote" value={form.quote} onChange={handleChange} placeholder="Quote" required />
                <input name="img" value={form.img} onChange={handleChange} placeholder="Image URL" required />
                <select name="color" value={form.color} onChange={handleChange}>
                    <option value="teal">Teal</option>
                    <option value="orange">Orange</option>
                    <option value="purple">Purple</option>
                    <option value="pink">Pink</option>
                    <option value="olive">Olive</option>
                </select>
                <button type="submit">{isEditing ? 'Update' : 'Add'} Testimonial</button>
                {isEditing && <button type="button" onClick={() => { setIsEditing(null); setForm({ quote: '', name: '', location: '', color: 'teal', img: '' }) }}>Cancel</button>}
            </form>

            <div className="list-container">
                {loading ? <p>Loading...</p> : (
                    <ul>
                        {testimonials.map(t => (
                            <li key={t.id} className="admin-item">
                                <img src={t.img} alt={t.name} style={{ width: 50, height: 50, objectFit: 'cover' }} />
                                <div>
                                    <strong>{t.name}</strong> ({t.location})
                                    <p>"{t.quote}"</p>
                                </div>
                                <div className="actions">
                                    <button onClick={() => handleEdit(t)}>Edit</button>
                                    <button onClick={() => handleDelete(t.id)} className="delete-btn">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
