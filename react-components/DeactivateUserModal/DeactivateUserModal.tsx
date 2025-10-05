import React, { useState } from 'react';
import './DeactivateUserModal.css';

interface DeactivateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (type: 'immediate' | 'scheduled', scheduledDate?: Date, reason?: string) => void;
  username: string;
  translations: {
    deactivateUser: string;
    deactivateUserTitle: string;
    deactivateImmediate: string;
    deactivateScheduled: string;
    selectDeactivationType: string;
    scheduledDate: string;
    reason: string;
    reasonPlaceholder: string;
    cancel: string;
    confirm: string;
    scheduledDateRequired: string;
    scheduledDateMustBeFuture: string;
  };
  preferredLanguage?: string;
}

export const DeactivateUserModal: React.FC<DeactivateUserModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  username,
  translations,
  preferredLanguage = 'he'
}) => {
  const [deactivationType, setDeactivationType] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string>('');

  const isRTL = preferredLanguage === 'he' || preferredLanguage === 'ar';

  const handleConfirm = () => {
    setError('');

    // Validate scheduled date if type is scheduled
    if (deactivationType === 'scheduled') {
      if (!scheduledDate) {
        setError(translations.scheduledDateRequired);
        return;
      }

      const selectedDate = new Date(scheduledDate);
      const now = new Date();

      if (selectedDate <= now) {
        setError(translations.scheduledDateMustBeFuture);
        return;
      }

      onConfirm('scheduled', selectedDate, reason || undefined);
    } else {
      onConfirm('immediate', undefined, reason || undefined);
    }

    // Reset form
    setDeactivationType('immediate');
    setScheduledDate('');
    setReason('');
    setError('');
  };

  const handleClose = () => {
    // Reset form
    setDeactivationType('immediate');
    setScheduledDate('');
    setReason('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  // Get minimum datetime for the input (now + 1 minute)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className={`modal-content deactivate-user-modal ${isRTL ? 'rtl' : 'ltr'}`}
        onClick={(e) => e.stopPropagation()}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="modal-header">
          <h2>{translations.deactivateUserTitle}</h2>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="deactivate-info">
            <p>
              <strong>{username}</strong>
            </p>
          </div>

          <div className="form-group">
            <label>{translations.selectDeactivationType}</label>
            <div className="deactivation-type-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name="deactivationType"
                  value="immediate"
                  checked={deactivationType === 'immediate'}
                  onChange={(e) => setDeactivationType(e.target.value as 'immediate')}
                />
                <span>{translations.deactivateImmediate}</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="deactivationType"
                  value="scheduled"
                  checked={deactivationType === 'scheduled'}
                  onChange={(e) => setDeactivationType(e.target.value as 'scheduled')}
                />
                <span>{translations.deactivateScheduled}</span>
              </label>
            </div>
          </div>

          {deactivationType === 'scheduled' && (
            <div className="form-group">
              <label htmlFor="scheduledDate">{translations.scheduledDate}</label>
              <input
                type="datetime-local"
                id="scheduledDate"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={getMinDateTime()}
                required
                className={isRTL ? 'rtl-datetime' : ''}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="reason">{translations.reason}</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={translations.reasonPlaceholder}
              rows={3}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleClose}>
            {translations.cancel}
          </button>
          <button className="btn btn-danger" onClick={handleConfirm}>
            {translations.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeactivateUserModal;

