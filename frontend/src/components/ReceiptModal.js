import React from 'react';
import ReactDOM from 'react-dom';

const ReceiptModal = ({ imageUrl, onClose }) => {
  return ReactDOM.createPortal(
    <div className="react-modal-overlay" onClick={onClose}>
      <div className="react-modal-card" onClick={(e)=>e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <h3 style={{ margin:0 }}>Receipt Preview</h3>
          <button className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center' }}>
          <img src={imageUrl} alt="receipt" style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 8 }} />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReceiptModal;
