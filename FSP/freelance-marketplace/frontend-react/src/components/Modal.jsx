// A lightweight Bootstrap-styled modal, fully controlled by React state
// (no bootstrap.Modal JS instance needed — visibility is just conditional rendering).
export default function Modal({ show, title, onClose, children, footer, size = "" }) {
  if (!show) return null;

  return (
    <>
      <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
        <div className={`modal-dialog ${size}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}
