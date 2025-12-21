import React from 'react';
import './FormCard.css';

const FormCard = ({ title, children, footer }) => {
  return (
    <div className="form-card">
      <div className="form-card-header">
        <h2>{title}</h2>
      </div>
      <div className="form-card-body">
        {children}
      </div>
      {footer && (
        <div className="form-card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default FormCard;

