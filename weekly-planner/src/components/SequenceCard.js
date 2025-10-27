import React from 'react';
import { format } from 'date-fns';
import {
  getSequenceStats,
  isSequenceActiveOnDate,
  isDayCompleted,
} from '../utils/sequenceUtils';
import './SequenceCard.css';

const WEEKDAY_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function SequenceCard({ 
  sequence, 
  weekStart,
  weekDays,
  onToggleDay, 
  onPause, 
  onResume, 
  onDelete,
  onClearCompleted,
  onEdit,
}) {
  const stats = getSequenceStats(sequence, weekStart);

  return (
    <div 
      className={`sequence-card ${sequence.paused ? 'paused' : ''}`}
      style={{ borderLeftColor: sequence.color }}
    >
      <div className="sequence-header">
        <div className="sequence-title-section">
          <h3 className="sequence-name" style={{ color: sequence.color }}>
            {sequence.name}
            {sequence.paused && <span className="paused-badge">Paused</span>}
            {!sequence.recurring && <span className="single-cycle-badge">Single Cycle</span>}
          </h3>
          {sequence.description && (
            <p className="sequence-description">{sequence.description}</p>
          )}
        </div>
        
        <div className="sequence-actions">
          <button
            className="action-button edit-button"
            onClick={() => onEdit(sequence.id)}
            title="Edit sequence"
          >
            ✏️
          </button>
          {sequence.paused ? (
            <button
              className="action-button resume-button"
              onClick={() => onResume(sequence.id)}
              title="Resume sequence"
            >
              ▶
            </button>
          ) : (
            <button
              className="action-button pause-button"
              onClick={() => onPause(sequence.id)}
              title="Pause sequence"
            >
              ⏸
            </button>
          )}
          <button
            className="action-button clear-button"
            onClick={() => onClearCompleted(sequence.id)}
            title="Clear completed days"
            disabled={stats.completed === 0}
          >
            ↻
          </button>
          <button
            className="action-button delete-button"
            onClick={() => onDelete(sequence.id)}
            title="Delete sequence"
          >
            🗑
          </button>
        </div>
      </div>

      <div className="sequence-progress">
        <div className="progress-info">
          <span className="progress-text">
            {stats.completed} / {stats.total} days
          </span>
          <span className="progress-percentage">{stats.percentage}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${stats.percentage}%`,
              backgroundColor: sequence.color,
            }}
          />
        </div>
      </div>

      <div className="sequence-days">
        {weekDays.map((day, index) => {
          const isActive = isSequenceActiveOnDate(sequence, day);
          const isCompleted = isDayCompleted(sequence, day);
          const dayOfWeek = day.getDay();
          
          return (
            <button
              key={day.toISOString()}
              className={`day-cell ${isActive ? 'active' : 'inactive'} ${isCompleted ? 'completed' : ''}`}
              onClick={() => isActive && !sequence.paused && onToggleDay(sequence.id, day)}
              disabled={!isActive || sequence.paused}
              title={`${format(day, 'MMM d')} - ${isCompleted ? 'Completed' : 'Not completed'}`}
              style={{
                borderColor: isActive ? sequence.color : '#e0e0e0',
                backgroundColor: isCompleted ? sequence.color : 'transparent',
              }}
            >
              <span className="day-letter">{WEEKDAY_SHORT[dayOfWeek]}</span>
              <span className="day-number">{format(day, 'd')}</span>
              {isCompleted && <span className="check-mark">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SequenceCard;
