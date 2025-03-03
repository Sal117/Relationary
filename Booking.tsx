import React, { useEffect, useState } from "react";
import { 
  bookAppointment, 
  getUserAppointments, 
  getTherapists, 
  getAvailableSlots, 
  cancelAppointment 
} from "../services/firebaseService";
import { auth } from "../services/firebaseConfig";
import "../Styles/booking.css"; // Import CSS file

/**
 * Booking Component
 * Handles appointment booking, fetching available therapists, and displaying user's appointments.
 */
const Booking = () => {
  const [appointments, setAppointments] = useState<any[]>([]); // Stores user appointments
  const [therapists, setTherapists] = useState<any[]>([]); // Stores list of therapists
  const [selectedTherapist, setSelectedTherapist] = useState(""); // Selected therapist ID
  const [availableDates, setAvailableDates] = useState<string[]>([]); // Available dates for selected therapist
  const [selectedDate, setSelectedDate] = useState(""); // Selected date for booking
  const [availableTimes, setAvailableTimes] = useState<string[]>([]); // Available time slots for selected date
  const [selectedTime, setSelectedTime] = useState(""); // Selected time slot
  const user = auth.currentUser; // Get the logged-in user

  /**
   * Fetches user's appointments and therapist list when component mounts
   */
  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
    fetchTherapists();
  }, [user]);

  /**
   * Fetches all appointments for the logged-in user
   */
  const fetchAppointments = async () => {
    if (!user) return;
    const data = await getUserAppointments(user.uid);
    setAppointments(data);
  };

  /**
   * Fetches the list of available therapists from the database
   */
  const fetchTherapists = async () => {
    const data = await getTherapists();
    setTherapists(data);
  };

  /**
   * Handles therapist selection and fetches available slots
   * @param {string} therapistId - Selected therapist's ID
   */
  const handleTherapistChange = async (therapistId: string) => {
    setSelectedTherapist(therapistId);
    setSelectedDate("");
    setAvailableTimes([]);
    
    const slots = await getAvailableSlots(therapistId);
    setAvailableDates(slots.map((slot) => slot.day)); // Extract available dates
  };

  /**
   * Handles date selection and fetches available time slots
   * @param {string} date - Selected appointment date
   */
  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    const slots = await getAvailableSlots(selectedTherapist);
    const timeSlots = slots.find((slot) => slot.day === date)?.slots || [];
    setAvailableTimes(timeSlots);
  };

  /**
   * Handles appointment booking process
   */
  const handleBookAppointment = async () => {
    if (!user || !selectedTherapist || !selectedDate || !selectedTime) {
      alert("Please select all fields!");
      return;
    }

    const confirmBooking = window.confirm(
      `Confirm appointment with therapist on ${selectedDate} at ${selectedTime}?`
    );
    if (!confirmBooking) return;

    try {
      await bookAppointment(user.uid, selectedTherapist, selectedDate, selectedTime);
      alert("Appointment booked successfully!");
      fetchAppointments();
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  return (
    <div className="booking-container">
      <h2 className="booking-title">Book an Appointment</h2>

      {/* Therapist Selection */}
      <select onChange={(e) => handleTherapistChange(e.target.value)} className="input-field">
        <option value="">Select a Therapist</option>
        {therapists.map((therapist) => (
          <option key={therapist.therapistId} value={therapist.therapistId}>
            {therapist.name} - {therapist.specialization}
          </option>
        ))}
      </select>

      {/* Date Selection */}
      <select onChange={(e) => handleDateChange(e.target.value)} className="input-field" disabled={!selectedTherapist}>
        <option value="">Select a Date</option>
        {availableDates.map((date) => (
          <option key={date} value={date}>{date}</option>
        ))}
      </select>

      {/* Time Slot Selection */}
      <select onChange={(e) => setSelectedTime(e.target.value)} className="input-field" disabled={!selectedDate}>
        <option value="">Select a Time Slot</option>
        {availableTimes.map((time) => (
          <option key={time} value={time}>{time}</option>
        ))}
      </select>

      <button onClick={handleBookAppointment} className="button">Book Now</button>

      {/* User's Appointments */}
      <h2 className="booking-title">Your Appointments</h2>
      <div className="appointment-list">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="appointment-item">
            <div>
              <p><strong>Date:</strong> {appointment.date}</p>
              <p><strong>Time:</strong> {appointment.time}</p>
            </div>
            <button onClick={() => cancelAppointment(appointment.id)} className="cancel-button">Cancel</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Booking;