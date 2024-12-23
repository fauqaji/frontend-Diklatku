import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/UpdateClass.css";

const UpdateClass = ({ selectedRooms, rooms, onClose }) => {
  const [statusId, setStatusId] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);

  const statusOptions = [
    { id: 1, label: "Tersedia" },
    { id: 2, label: "Tidak Tersedia" },
    { id: 3, label: "Pesan" },
  ];

  // Fetch tanggal yang sudah dibooking saat room_id tersedia
  useEffect(() => {
    const fetchBookingRoom = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Ambil room_id dari selectedRooms
        const roomIds = selectedRooms.map((room) => room);
        // console.log("Selected Room IDs:", roomIds);

        const allBookedDates = []; // Untuk menampung semua tanggal yang dibooking

        // Loop untuk setiap room_id yang dipilih dan ambil tanggal bookingnya
        for (const roomId of roomIds) {
          const response = await axios.get(
            `/api/booking-rooms/cektanggal/${roomId}`,
            { headers }
          );
          // console.log(`Response for Room ID ${roomId}:`, response.data.data);

          if (response.data.data.length > 0) {
            const bookedDatesData = response.data.data.map(
              ({ start_date, end_date }) => ({
                start: new Date(start_date),
                end: new Date(end_date),
              })
            );
            allBookedDates.push(...bookedDatesData); // Gabungkan semua tanggal yang dibooking
          }
        }

        // Filter untuk tanggal yang unik
        const seenDates = new Set();
        const uniqueBookedDates = allBookedDates.filter(({ start, end }) => {
          const key = `${start.getTime()}-${end.getTime()}`;
          if (seenDates.has(key)) {
            return false;
          }
          seenDates.add(key);
          return true;
        });

        // console.log("Unique Booked Dates:", uniqueBookedDates);
        setBookedDates(uniqueBookedDates); // Simpan tanggal yang unik
      } catch (error) {
        console.error("Gagal mengambil tanggal booking.", error);
      }
    };

    fetchBookingRoom();
  }, [selectedRooms]); // Memanggil efek setiap kali selectedRooms berubah

  // Fungsi untuk menampilkan hanya tanggal yang tidak memiliki start_date dan end_date
  const filterDates = (date) => {
    const targetDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

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

  const handleStatusChange = (id) => {
    if (rooms.length === 0) {
      toast.warning("Data ruangan belum dimuat. Silakan coba lagi.");
      return;
    }

    // Mencari ruangan berdasarkan ID yang ada dalam selectedRooms
    const room = rooms.find((room) => room.room_id === selectedRooms[0]);

    if (room) {
      const statusName = room.status_name; // Mengambil status_name dari data ruangan

      if (
        (statusName === "available" && id === 1) ||
        (statusName === "not_available" && id === 2)
      ) {
        toast.warning("Status Ruangan Saat Ini.");
        return;
      }
    } else {
      console.log("Room tidak ditemukan untuk room_id:", selectedRooms[0]);
    }

    // Jika status berubah, update status dan reset tanggal jika perlu
    if (id !== statusId) {
      setStatusId(id);
      if (id !== 3) {
        setStartDate(null);
        setEndDate(null);
      }
    }
  };

  const handleSave = async () => {
    if (!selectedRooms || selectedRooms.length === 0) {
      toast.error("Tidak ada kamar yang dipilih.");
      return;
    }

    // Mencari ruangan berdasarkan ID yang ada dalam selectedRooms
    const room = rooms.find((room) => room.room_id === selectedRooms[0]);

    if (room) {
      const statusName = room.status_name; // Mengambil status_name dari data ruangan

      // Memeriksa kondisi status ruangan berdasarkan statusName dan statusId
      const isStatusRestricted =
        (statusName === "available" && statusId === 1) ||
        (statusName === "not_available" && statusId === 2);

      if (isStatusRestricted) {
        toast.warning("Status Ruangan Saat Ini.");
        return;
      }
    } else {
      toast.error("Room tidak ditemukan untuk room_id:", selectedRooms[0]);
    }

    if (statusId === 3) {
      if (!startDate || !endDate) {
        toast.error("Tanggal tidak boleh kosong saat ruangan terpakai.");
        return;
      }

      // Periksa apakah rentang tanggal bertabrakan dengan tanggal yang sudah dibooking
      const hasConflict = bookedDates.some(({ start, end }) => {
        return (
          (startDate >= start && startDate <= end) ||
          (endDate >= start && endDate <= end) ||
          (startDate <= start && endDate >= end)
        );
      });

      if (hasConflict) {
        toast.warning("Tanggal tertentu sudah dipesan. Pilih tanggal lain.");
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (statusId === 1 || statusId === 2) {
        const roomIds = selectedRooms.map((room) => room);
        const roomData = { status_id: statusId };

        await axios.put(
          "/api/rooms/multruang",
          { roomIds, roomData },
          { headers }
        );
        toast.success("Status ruangan berhasil diubah");
      } else if (statusId === 3) {
        const roomIds = selectedRooms.filter((id) => id !== undefined);
        const bookingData = {
          rooms: roomIds,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        };

        await axios.post(
          "/api/booking-rooms/multruang",
          bookingData,
          { headers }
        );
        toast.success("Pesanan berhasil dibuat");
      }

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      toast.error(
        `Gagal menyimpan data: ${
          error.response ? error.response.data.message : error.message
        }`
      );
    }
  };

  return (
    <div>
      <h2>{selectedRooms.length} Kamar yang dipilih</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Status Kelas</Form.Label>
          <div className="d-flex justify-content-between">
            {statusOptions.map((status) => (
              <div
                key={status.id}
                className={`status-option ${
                  status.id === statusId ? "active" : ""
                }`}
                onClick={() => handleStatusChange(status.id)}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  flex: 1,
                  textAlign: "center",
                  margin: "0 5px",
                  backgroundColor:
                    status.id === statusId ? "#bf252b" : "transparent",
                  color: status.id === statusId ? "#fff" : "#000",
                  transition: "background-color 0.3s ease", // Animasi
                  "&:hover": {
                    backgroundColor:
                      status.id === statusId ? "#0056b3" : "#e9ecef", // Warna saat hover
                  },
                }}
              >
                {status.label}
              </div>
            ))}
          </div>
        </Form.Group>

        {statusId === 3 && (
          <Form.Group>
            <Form.Label>Pilih Rentang Tanggal</Form.Label>
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
          </Form.Group>
        )}

        <div className="d-flex justify-content-center mt-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="mx-1 upd-cls-bat"
          >
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            className="mx-1 upd-cls-sim"
          >
            Simpan
          </Button>
        </div>
      </Form>
      <ToastContainer
        position="top-right"
        autoClose={2400}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default UpdateClass;
