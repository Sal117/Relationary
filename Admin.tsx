import React, { useEffect, useState } from "react";
import { getTherapists, getAvailableSlots, registerUser, getUserAppointments } from "../services/firebaseService";
import "../Styles/Admin.css"; 

const Admin = () => {
  // State to store therapist data
  const [therapists, setTherapists] = useState<any[]>([]);
  // State to store available slots for selected therapist
  const [slots, setSlots] = useState<any[]>([]);
  // State to store user appointment data
  const [users, setUsers] = useState<any[]>([]);
  // State for adding a new therapist
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Fetch therapist data when component mounts
  useEffect(() => {
    fetchTherapists();
  }, []);

  /**
   * Fetches the list of therapists from Firestore and updates state
   */
  const fetchTherapists = async () => {
    const data = await getTherapists();
    setTherapists(data);
  };

  /**
   * Fetches available slots for a specific therapist
   * @param therapistId - The ID of the selected therapist
   */
  const fetchSlots = async (therapistId: string) => {
    const slotsData = await getAvailableSlots(therapistId);
    setSlots(slotsData);
  };

  /**
   * Fetches users and their appointments (to be replaced with actual user fetching logic)
   */
  const fetchUsers = async () => {
    const appointments = await getUserAppointments("dummyUserId"); // Replace with actual user fetching logic
    setUsers(appointments);
  };

  /**
   * Registers a new therapist using email and password
   * Calls Firebase Authentication to create a user account
   */
  const handleAddTherapist = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    try {
      await registerUser(email, password);
      alert("Therapist added successfully!");
      fetchTherapists(); // Refresh therapist list
    } catch (error) {
      console.error("Error adding therapist:", error);
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Dashboard</h2>

      {/* Section to add a new therapist */}
      <div className="section">
        <h3>Add New Therapist</h3>
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
        <button onClick={handleAddTherapist} className="button">
          Add Therapist
        </button>
      </div>

      {/* Section to display the list of therapists */}
      <div className="section">
        <h3>Therapists List</h3>
        <ul>
          {therapists.map((therapist) => (
            <li key={therapist.therapistId}>
              {therapist.name} - {therapist.therapistId}
              <button onClick={() => fetchSlots(therapist.therapistId)} className="small-button">
                Get Slots
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Section to display available slots */}
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

      {/* Section to display user appointment information */}
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
