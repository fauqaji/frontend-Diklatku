import React from 'react';

const Modal = ({ isVisible, onConfirm, onCancel }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Konfirmasi Hapus</h2>
        <p>Apakah yakin ingin menghapus?</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="btn btn-danger">
            Ya, Hapus
          </button>
          <button onClick={onCancel} className="btn btn-secondary">
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
