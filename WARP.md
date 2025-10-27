# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a **Savings Goal Tracking System** designed for mobile banking applications. It provides a complete, enterprise-grade framework for users to set, track, and manage savings goals with sophisticated multi-factor status monitoring, transparent recurring payments, and comprehensive error handling.

The system is built entirely in Python 3 with no external dependencies for core functionality, making it lightweight and easy to integrate into existing banking systems.

## Common Development Commands

### Testing
```powershell
# Run all tests using the simple test runner (no dependencies required)
python run_tests.py

# Run tests with pytest (if available)
python -m pytest test_savings_goal_tracker.py -v

# Run a single test function with pytest
python -m pytest test_savings_goal_tracker.py::TestSavingsGoal::test_goal_creation -v
```

### Demo and Development
```powershell
# Run the complete demo showing all system features
python demo_savings_tracker.py

# Run individual example scripts
python hello_world.py
python variables.py
python input.py
python example.py
```

### Code Quality
```powershell
# Python's built-in syntax check
python -m py_compile savings_goal_tracker.py

# Check all Python files for syntax errors
Get-ChildItem -Filter "*.py" | ForEach-Object { python -m py_compile $_.Name }

# Manual code review using evaluation script
python evaluate.py
```

## Architecture Overview

### Core Components

**Data Models**
- `SavingsGoal`: Core entity representing a single savings goal with automatic progress calculation and status management
- `User`: Represents banking system users with notification preferences
- `Notification`: Handles multi-channel notification delivery (SMS → Email → Push → In-App)

**Main System Class**
- `SavingsGoalTracker`: Central orchestrator managing goals, users, and notifications with in-memory storage

**Enumerations**
- `GoalStatus`: ACTIVE, COMPLETED, OVERDUE, CANCELLED
- `NotificationType`: DEADLINE_APPROACHING, GOAL_ACHIEVED, OVERDUE_REMINDER, PROGRESS_MILESTONE

### Key Design Patterns

**Financial Safety First**
- All monetary calculations use Python's `Decimal` for precision
- Automatic rounding to 2 decimal places
- Comprehensive input validation

**Status-Driven Logic**
- Goals automatically transition between states based on progress and time
- Overdue detection with automatic status updates
- Completion triggers and achievement notifications

**Analytics-Ready Architecture**
- Real-time progress calculations
- Time-based analytics (days elapsed, remaining, required daily savings)
- Export functionality for data analysis and reporting

### Integration Points

The system is designed for easy integration with:
- **REST APIs**: Clear method signatures map to standard banking endpoints
- **Database Systems**: In-memory storage can be replaced with database persistence
- **Notification Services**: Pluggable notification delivery via external services
- **Mobile Apps**: JSON serialization for client-server communication

## Development Workflow

### Adding New Features

1. **Model Changes**: Modify dataclasses in `savings_goal_tracker.py`
2. **Business Logic**: Add methods to `SavingsGoalTracker` class
3. **Tests**: Add corresponding tests in `test_savings_goal_tracker.py`
4. **Demo**: Update `demo_savings_tracker.py` to showcase new functionality

### Testing Strategy

- **Unit Tests**: Individual component testing via `run_tests.py`
- **Integration Tests**: Full system testing in `test_savings_goal_tracker.py`
- **Demo Testing**: Manual verification via `demo_savings_tracker.py`
- **Edge Cases**: Monetary precision, date boundaries, error conditions

### Banking Integration Considerations

**Security**
- No sensitive data in notification messages
- User data isolation and controlled export
- Input validation prevents invalid financial operations

**Scalability**
- Notification batching for performance
- Analytics calculations optimized for real-time use
- Event-driven architecture ready for async processing

**Compliance**
- Monetary precision meets banking standards
- Audit trail via notification history
- Data export capabilities for reporting

## File Organization

### Core Implementation
- `savings_goal_tracker.py` - Main system implementation
- `test_savings_goal_tracker.py` - Comprehensive test suite (pytest-compatible)
- `run_tests.py` - Simple test runner (no dependencies)

### Examples and Demos
- `demo_savings_tracker.py` - Complete feature demonstration
- `hello_world.py` - Basic Python example
- `variables.py`, `input.py`, `example.py` - Learning examples

### Documentation
- `README.md` - Comprehensive project documentation
- `savings_goal_visual_flowchart.md` - Visual system flow
- Various `.txt` files with pseudocode and planning documents

## Mobile Banking Context

This system is specifically designed for mobile banking applications with features like:
- **Goal Categories**: Travel, emergency, housing, transportation, etc.
- **Progress Milestones**: Automatic achievement notifications
- **Smart Deadlines**: Multi-day warning systems with daily savings calculations
- **User Preferences**: Configurable notification channels and timing

The codebase follows banking industry patterns for financial precision, error handling, and data integrity that are essential for production banking applications.