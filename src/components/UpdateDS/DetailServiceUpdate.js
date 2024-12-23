import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/UpdateDS.css";

const DetailServiceUpdate = ({ show, handleClose, id }) => {
  const [service, setService] = useState({
    nama: "",
    deskripsi: "",
    harga: "",
    rating: "",
    foto: [],
    jumlah_kamar: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewPhotos, setPreviewPhotos] = useState([]);

  useEffect(() => {
    const fetchService = async () => {
      if (!id) {
        setError("ID service tidak ditemukan.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `/api/detailService/${id}`
        );
        setService(response.data.data);

        if (Array.isArray(response.data.data.foto)) {
          setPreviewPhotos(response.data.data.foto);
        }
      } catch (error) {
        setError("Gagal mengambil detail service");
        console.error("Gagal mengambil detail service", error);
      } finally {
        setLoading(false);
      }
    };

    if (show && id) {
      fetchService();
    }
  }, [id, show]);

  // Handle input changes
  const handleChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  // Handle file input changes with a maximum limit of 6 photos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 6) {
      toast.error("Maksimal 6 gambar yang dapat diunggah");
      return;
    }

    // Replace existing photos with new selections
    setService({ ...service, foto: files });
    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewPhotos(objectUrls);
  };

  // Cleanup URL object previews on unmount
  useEffect(() => {
    return () => {
      previewPhotos.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewPhotos]);

  const handleRemoveLastPhoto = () => {
    const updatedPhotos = previewPhotos.slice(0, -1);
    const updatedFiles = service.foto.slice(0, -1);
    setPreviewPhotos(updatedPhotos);
    setService({ ...service, foto: updatedFiles });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (service.rating < 0 || service.rating > 5) {
      toast.error("Rating tidak bisa melebihi 5 atau kurang dari 0");
      return;
    }

    const formData = new FormData();
    formData.append("nama", service.nama);
    formData.append("deskripsi", service.deskripsi);
    formData.append("harga", service.harga);
    formData.append("rating", service.rating);
    formData.append("jumlah_kamar", service.jumlah_kamar);

    // Cek jika foto adalah array sebelum melakukan iterasi
    if (Array.isArray(service.foto)) {
      service.foto.forEach((file) => {
        formData.append("foto", file);
      });
    } else {
      console.warn("service.foto bukan array, foto tidak ditambahkan");
    }

    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `/api/detailService/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleClose();
      window.location.reload();
    } catch (error) {
      setError("Gagal memperbarui detail service: " + error.message);
      console.error("Gagal memperbarui detail service", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <Modal
      dialogClassName="modal-lg modal-detail-r"
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title className="jud-up-det">
          Edit <span className="jud-up-detDR"> Detail Ruang</span>
        </Modal.Title>
      </Modal.Header>
      <hr className="modal-title-hr" />
      <Modal.Body className="modal-body-ds">
        <form onSubmit={handleSubmit}>
          <div className="form-row form-row-ds">
            <div className="form-group form-group-ds half-width half-width-ds">
              <label>Nama Ruang</label>
              <input
                type="text"
                name="nama"
                value={service.nama}
                onChange={handleChange}
                required
                className="form-control form-control-ds"
              />
            </div>
            <div className="form-group form-group-ds half-width half-width-ds">
              <label>Harga</label>
              <input
                type="number"
                name="harga"
                value={service.harga}
                onChange={handleChange}
                required
                className="form-control form-control-ds"
              />
            </div>
          </div>

          <div className="form-row form-row-ds">
            <div className="form-group form-group-ds half-width half-width-ds">
              <label>Jumlah Unit</label>
              <input
                type="number"
                name="jumlah_kamar"
                value={service.jumlah_kamar}
                onChange={handleChange}
                required
                className="form-control form-control-ds"
              />
            </div>
            <div className="form-group form-group-ds half-width half-width-ds">
              <label>Rating</label>
              <input
                type="number"
                step="0.1"
                name="rating"
                value={service.rating}
                onChange={handleChange}
                required
                className="form-control form-control-ds"
              />
            </div>
          </div>

          <div className=" form-group-ds full-width-ds">
            <label>Deskripsi</label>
            <textarea
              name="deskripsi"
              value={service.deskripsi}
              onChange={handleChange}
              required
              className="form-control form-control-ds"
            />
          </div>

          <div className="form-group-ds full-width-ds image-up-ds">
            <label>Foto</label>
            <div className="photo-preview-ds">
              {previewPhotos.map((photo, index) => (
                <div key={index} className="photo-wrapper-ds">
                  <img
                    src={photo}
                    alt={`Preview ${index}`}
                    className="preview-image-ds"
                  />
                  {previewPhotos.length === 6 &&
                    index === previewPhotos.length - 1 && (
                      <button
                        className="remove-photo-button"
                        onClick={handleRemoveLastPhoto}
                      >
                        &times;
                      </button>
                    )}
                </div>
              ))}
              {previewPhotos.length < 6 && (
                <label className="custom-file-input-ds">
                  <input
                    type="file"
                    name="foto"
                    onChange={handleFileChange}
                    multiple
                    className="file-input-ds"
                    style={{ display: "none" }}
                  />
                  <span>+ Tambah Foto</span>
                </label>
              )}
            </div>
          </div>

          <Button
            className="text-center button-upd"
            variant="primary"
            type="submit"
          >
            Update
          </Button>
        </form>
      </Modal.Body>
      <ToastContainer />
    </Modal>
  );
};

export default DetailServiceUpdate;
