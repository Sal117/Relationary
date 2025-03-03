import React, { useEffect, useState } from "react";
import { 
  getTherapists, 
  getAvailableSlots, 
  registerUser, 
  addTherapistToFirestore, 
  getUserAppointments 
} from "../services/firebaseService";
import "../Styles/Admin.css"; 

const Admin = () => {
  const [therapists, setTherapists] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  // State for new therapist details
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  
  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    const data = await getTherapists();
    setTherapists(data);
  };

  const fetchSlots = async (therapistId: string) => {
    const slotsData = await getAvailableSlots(therapistId);
    setSlots(slotsData);
  };

  const fetchUsers = async () => {
    const appointments = await getUserAppointments("dummyUserId");
    setUsers(appointments);
  };

  const handleAddTherapist = async () => {
    if (!email || !password || !name || !specialization || availableDays.length === 0 || availableTimes.length === 0) {
      alert("Please fill all fields before adding a therapist.");
      return;
    }

    try {
      // Register therapist in Firebase Auth
      const userCredential = await registerUser(email, password);
      const therapistId = userCredential.uid;

      // Store therapist details in Firestore
      await addTherapistToFirestore(therapistId, { 
        name, 
        specialization, 
        availableDays, 
        availableTimes 
      });

      alert("Therapist added successfully!");
      fetchTherapists(); // Refresh therapist list
    } catch (error) {
      console.error("Error adding therapist:", error);
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Dashboard</h2>

      {/* Add New Therapist */}
      <div className="section">
        <h3>Add New Therapist</h3>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="input-field"
        />
        <input
          type="email"
          placeholder="Therapist Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        
        {/* Available Days Selection */}
        <label>Available Days:</label>
        <select onChange={(e) => setAvailableDays(Array.from(e.target.selectedOptions).map(o => o.value))}
        className="input-field">
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
        </select>

        {/* Available Time Slots */}
        <label>Available Time Slots:</label>
        <input
          type="text"
          placeholder="e.g., 10:00 AM, 2:00 PM"
          value={availableTimes.join(", ")}
          onChange={(e) => setAvailableTimes(e.target.value.split(", ").map(time => time.trim()))}
          className="input-field"
        />

        <button onClick={handleAddTherapist} className="button">
          Add Therapist
        </button>
      </div>

      {/* Therapists List */}
      <div className="section">
        <h3>Therapists List</h3>
        <ul>
          {therapists.map((therapist) => (
            <li key={therapist.therapistId}>
              {therapist.name} - {therapist.specialization}
              <button onClick={() => fetchSlots(therapist.therapistId)} className="small-button">
                Get Slots
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Available Slots */}
      <div className="section">
        <h3>Available Slots</h3>
        <ul>
          {slots.length > 0 ? (
            slots.map((slot, index) => <li key={index}>{slot}</li>)
          ) : (
            <p>No slots available</p>
          )}
        </ul>
      </div>

      {/* User Information */}
      <div className="section">
        <h3>Users Information</h3>
        <button onClick={fetchUsers} className="button">Get Users</button>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.userId} - {user.date} at {user.time}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Admin;
