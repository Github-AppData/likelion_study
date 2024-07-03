import React from 'react';
import Modal from "react-modal";

function LoginModal({showLoginModal, idInputChange, pwInputChange, login}) {
  return <Modal
  isOpen={showLoginModal}
  contentLabel="Minimal Modal Example"
  style={{
    overlay: {
      //backgroundColor: 'papayawhip'
    },
    content: {
      //color: "lightsteelblue",
      width: "300px",
      height: "350px",
      top: "150px",
      left: "350px",
    },
  }}
>
  <button
    onClick={(e) => {
      e.preventDefault();
      handleCloseLoginModal();
    }}
  >
    Close Modal
  </button>
  <div>
    <div className="mb-3 mt-3">
      <label className="form-label">ID:</label>
      <input
        type="text"
        className="form-control"
        placeholder="Enter id"
        onChange={idInputChange}
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Password:</label>
      <input
        type="password"
        className="form-control"
        placeholder="Enter password"
        onChange={pwInputChange}
      />
    </div>          
    <button
      type="button"
      className="btn btn-primary"
      onClick={() => {
        login();
      }}
    >
      로그인
    </button>
  </div>
</Modal>
}

export default LoginModal;