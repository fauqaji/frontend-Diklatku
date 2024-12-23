import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // Importing Toast components
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import "../css/UpdateBR.css";

const UpdateBR = ({ bookingRoomId, onClose }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    const fetchBookingRoom = async () => {
      if (bookingRoomId) {
        try {
          const token = localStorage.getItem("token");
          const headers = { Authorization: `Bearer ${token}` };

          const response = await axios.get(
            `/api/booking-rooms/tanggalbr/${bookingRoomId}`,
            { headers }
          );

          const bookedRanges = response.data.data.map((dateRange) => ({
            start: new Date(dateRange.start_date),
            end: new Date(dateRange.end_date),
          }));

          setBookedDates(bookedRanges);
        } catch (error) {
          console.error("Gagal mengambil tanggal booking.", error);
        }
      }
    };

    fetchBookingRoom();
  }, [bookingRoomId]);

  // Filter dates that are already booked
  const filterDates = (date) => {
    // Ambil tanggal dari date
    const targetDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    // Periksa apakah tanggal tersebut ada dalam daftar bookedDates
    return bookedDates.every(({ start, end }) => {
      const startDate = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate()
      );
      const endDate = new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate()
      );
      return (
        targetDate.getTime() !== startDate.getTime() &&
        targetDate.getTime() !== endDate.getTime() &&
        (targetDate < startDate || targetDate > endDate)
      );
    });
  };

  const isDateRangeBooked = (start, end) => {
    return bookedDates.some(({ start: bookedStart, end: bookedEnd }) => {
      return (
        (start >= bookedStart && start <= bookedEnd) ||
        (end >= bookedStart && end <= bookedEnd) ||
        (start <= bookedStart && end >= bookedEnd)
      );
    });
  };

  // Save the updated booking
  const handleSave = async () => {
    if (!startDate || !endDate) {
      toast.warning("Silakan pilih rentang tanggal sebelum menyimpan.");
      return;
    }

    if (isDateRangeBooked(startDate, endDate)) {
      toast.error("Tanggal yang dipilih sudah dipesan.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const bookingData = {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      };

      await axios.put(
        `/api/booking-rooms/${bookingRoomId}`,
        bookingData,
        { headers }
      );

      toast.success("Pesanan Berhasil Diperbarui!");

      // Close the modal after 1.5 seconds
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 2100);
    } catch (error) {
      console.error("Gagal memperbarui booking:", error);
      toast.error("Gagal memperbarui booking.");
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="d-flex justify-content-center">
        <DatePicker
          selected={startDate}
          onChange={(dates) => {
            const [start, end] = dates;
            setStartDate(start);
            setEndDate(end);
          }}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          dateFormat="dd/MM/yyyy"
          filterDate={filterDates}
          minDate={new Date()}
        />
      </div>
      <div className="d-flex justify-content-center mt-3">
        <Button variant="primary" onClick={handleSave} className="mx-1 btn-sim-br">
          Simpan
        </Button>
      </div>
    </div>
  );
};

export default UpdateBR;
