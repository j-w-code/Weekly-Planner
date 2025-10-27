import React, { useState } from 'react';
import {
  SEQUENCE_COLORS,
  DAY_PATTERN_LABELS,
  validateSequenceName,
  validateSequenceDescription,
} from '../utils/sequenceUtils';
import './AddSequenceForm.css';

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function AddSequenceForm({ onClose, onAddSequence }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(SEQUENCE_COLORS[0]);
  const [dayPattern, setDayPattern] = useState('FULL_WEEK');
  const [customDays, setCustomDays] = useState([]);
  const [recurring, setRecurring] = useState(true);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    const newErrors = {};
    const nameError = validateSequenceName(name);
    const descError = validateSequenceDescription(description);
    
    if (nameError) newErrors.name = nameError;
    if (descError) newErrors.description = descError;
    
    if (dayPattern === 'CUSTOM' && customDays.length === 0) {
      newErrors.days = 'Please select at least one day';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Create sequence
    onAddSequence({
      name: name.trim(),
      description: description.trim(),
      color,
      dayPattern,
      customDays: dayPattern === 'CUSTOM' ? customDays : [],
      recurring,
    });
    
    onClose();
  };

  const handleDayPatternChange = (pattern) => {
    setDayPattern(pattern);
    if (pattern !== 'CUSTOM') {
      setCustomDays([]);
    }
    setErrors({ ...errors, days: null });
  };

  const toggleCustomDay = (dayIndex) => {
    setCustomDays(prev => {
      if (prev.includes(dayIndex)) {
        return prev.filter(d => d !== dayIndex);
      } else {
        return [...prev, dayIndex].sort((a, b) => a - b);
      }
    });
    setErrors({ ...errors, days: null });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content sequence-form" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Sequence</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="sequence-name">
              Sequence Name <span className="required">*</span>
            </label>
            <input
              id="sequence-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({ ...errors, name: null });
              }}
              placeholder="e.g., Morning Exercise, Study Time"
              maxLength={50}
              autoFocus
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="sequence-description">Description</label>
            <textarea
              id="sequence-description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors({ ...errors, description: null });
              }}
              placeholder="e.g., Hit goal of 3 miles walking per day"
              maxLength={200}
              rows={3}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
            <span className="char-count">{description.length}/200</span>
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-picker">
              {SEQUENCE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-option ${color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Days Pattern</label>
            <div className="radio-group">
              {Object.entries(DAY_PATTERN_LABELS).map(([pattern, label]) => (
                <label key={pattern} className="radio-label">
                  <input
                    type="radio"
                    name="dayPattern"
                    value={pattern}
                    checked={dayPattern === pattern}
                    onChange={(e) => handleDayPatternChange(e.target.value)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {dayPattern === 'CUSTOM' && (
            <div className="form-group">
              <label>Select Days</label>
              <div className="day-selector">
                {WEEKDAY_NAMES.map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`day-button ${customDays.includes(index) ? 'selected' : ''}`}
                    onClick={() => toggleCustomDay(index)}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {errors.days && <span className="error-message">{errors.days}</span>}
            </div>
          )}

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
              />
              <span>Recurring (continues weekly)</span>
            </label>
            <small className="help-text">
              {recurring 
                ? 'This sequence will continue every week' 
                : 'This sequence will run for one cycle only'}
            </small>
          </div>

          <div className="form-actions">
            <button type="button" className="button-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button-primary">
              Create Sequence
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSequenceForm;
