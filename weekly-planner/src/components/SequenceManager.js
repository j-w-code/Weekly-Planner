import React, { useState, useEffect, useCallback } from 'react';
import SequenceCard from './SequenceCard';
import AddSequenceForm from './AddSequenceForm';
import EditSequenceForm from './EditSequenceForm';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcuts';
import {
  createSequence,
  toggleDayCompletion,
  pauseSequence,
  resumeSequence,
  clearCompletedDays,
} from '../utils/sequenceUtils';
import './SequenceManager.css';

const STORAGE_KEY = 'weekly-planner-sequences';

function SequenceManager({ weekStart, weekDays }) {
  const [sequences, setSequences] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSequences, setShowSequences] = useState(true);
  const [editingSequence, setEditingSequence] = useState(null);

  // Load sequences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSequences(parsed);
      }
    } catch (error) {
      console.error('Error loading sequences:', error);
    }
  }, []);

  // Save sequences to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sequences));
    } catch (error) {
      console.error('Error saving sequences:', error);
    }
  }, [sequences]);

  const handleAddSequence = useCallback((sequenceData) => {
    const newSequence = createSequence(sequenceData);
    setSequences(prev => [...prev, newSequence]);
  }, []);

  const handleToggleDay = useCallback((sequenceId, date) => {
    setSequences(prev => 
      prev.map(seq => 
        seq.id === sequenceId ? toggleDayCompletion(seq, date) : seq
      )
    );
  }, []);

  const handlePause = useCallback((sequenceId) => {
    setSequences(prev => 
      prev.map(seq => 
        seq.id === sequenceId ? pauseSequence(seq) : seq
      )
    );
  }, []);

  const handleResume = useCallback((sequenceId) => {
    setSequences(prev => 
      prev.map(seq => 
        seq.id === sequenceId ? resumeSequence(seq) : seq
      )
    );
  }, []);

  const handleDelete = useCallback((sequenceId) => {
    if (window.confirm('Are you sure you want to delete this sequence?')) {
      setSequences(prev => prev.filter(seq => seq.id !== sequenceId));
    }
  }, []);

  const handleClearCompleted = useCallback((sequenceId) => {
    setSequences(prev => 
      prev.map(seq => 
        seq.id === sequenceId ? clearCompletedDays(seq) : seq
      )
    );
  }, []);

  const handleEdit = useCallback((sequenceId) => {
    const sequence = sequences.find(seq => seq.id === sequenceId);
    if (sequence) {
      setEditingSequence(sequence);
    }
  }, [sequences]);

  const handleSaveEdit = useCallback((updatedSequence) => {
    setSequences(prev => 
      prev.map(seq => 
        seq.id === updatedSequence.id ? updatedSequence : seq
      )
    );
    setEditingSequence(null);
  }, []);

  // Keyboard shortcut for new sequence
  useKeyboardShortcut('s', () => setShowAddForm(true), !showAddForm && !editingSequence);

  return (
    <div className="sequence-manager">
      <div className="sequence-manager-header">
        <div className="header-content">
          <h2>
            Sequences
            <button
              className="toggle-button"
              onClick={() => setShowSequences(!showSequences)}
              aria-label={showSequences ? 'Hide sequences' : 'Show sequences'}
            >
              {showSequences ? '▼' : '▶'}
            </button>
          </h2>
          {sequences.length > 0 && (
            <span className="sequence-count">{sequences.length} sequence{sequences.length !== 1 ? 's' : ''}</span>
          )}
        </div>
        <button
          className="add-sequence-button"
          onClick={() => setShowAddForm(true)}
        >
          + New Sequence
        </button>
      </div>

      {showSequences && (
        <>
          {sequences.length === 0 ? (
            <div className="empty-state">
              <p>No sequences yet. Create your first sequence to track weekly goals and activities!</p>
              <button
                className="create-first-button"
                onClick={() => setShowAddForm(true)}
              >
                Create First Sequence
              </button>
            </div>
          ) : (
            <div className="sequences-list">
              {sequences.map(sequence => (
                <SequenceCard
                  key={sequence.id}
                  sequence={sequence}
                  weekStart={weekStart}
                  weekDays={weekDays}
                  onToggleDay={handleToggleDay}
                  onPause={handlePause}
                  onResume={handleResume}
                  onDelete={handleDelete}
                  onClearCompleted={handleClearCompleted}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </>
      )}

      {showAddForm && (
        <AddSequenceForm
          onClose={() => setShowAddForm(false)}
          onAddSequence={handleAddSequence}
        />
      )}

      {editingSequence && (
        <EditSequenceForm
          sequence={editingSequence}
          onClose={() => setEditingSequence(null)}
          onSaveSequence={handleSaveEdit}
        />
      )}
    </div>
  );
}

export default SequenceManager;
