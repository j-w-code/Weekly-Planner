"""
Test Suite for Savings Goal Tracking System

This module contains comprehensive unit tests for the savings goal tracking functionality.
Tests cover goal creation, progress tracking, notifications, and edge cases.

Run with: python -m pytest test_savings_goal_tracker.py -v
"""

import pytest
from datetime import datetime, timedelta
from decimal import Decimal
import json

from savings_goal_tracker import (
    SavingsGoal, User, Notification, SavingsGoalTracker,
    GoalStatus, NotificationType
)


class TestSavingsGoal:
    """Test cases for the SavingsGoal class"""
    
    def test_goal_creation_valid(self):
        """Test creating a valid savings goal"""
        target_date = datetime.now() + timedelta(days=30)
        goal = SavingsGoal(
            user_id="user123",
            title="Vacation Fund",
            target_amount=Decimal("1000.00"),
            target_date=target_date,
            description="Save for summer vacation"
        )
        
        assert goal.user_id == "user123"
        assert goal.title == "Vacation Fund"
        assert goal.target_amount == Decimal("1000.00")
        assert goal.current_amount == Decimal("0.00")
        assert goal.status == GoalStatus.ACTIVE
        assert goal.progress_percentage == 0.0
        assert goal.remaining_amount == Decimal("1000.00")
        assert len(goal.goal_id) > 0
    
    def test_goal_creation_invalid_target_amount(self):
        """Test creating goal with invalid target amount"""
        target_date = datetime.now() + timedelta(days=30)
        
        with pytest.raises(ValueError, match="Target amount must be positive"):
            SavingsGoal(
                user_id="user123",
                title="Invalid Goal",
                target_amount=Decimal("-100.00"),
                target_date=target_date
            )
    
    def test_goal_creation_invalid_target_date(self):
        """Test creating goal with past target date"""
        past_date = datetime.now() - timedelta(days=1)
        
        with pytest.raises(ValueError, match="Target date must be in the future"):
            SavingsGoal(
                user_id="user123",
                title="Invalid Goal",
                target_amount=Decimal("1000.00"),
                target_date=past_date
            )
    
    def test_goal_creation_negative_current_amount(self):
        """Test creating goal with negative current amount"""
        target_date = datetime.now() + timedelta(days=30)
        
        with pytest.raises(ValueError, match="Current amount cannot be negative"):
            SavingsGoal(
                user_id="user123",
                title="Invalid Goal",
                target_amount=Decimal("1000.00"),
                target_date=target_date,
                current_amount=Decimal("-50.00")
            )
    
    def test_progress_calculation(self):
        """Test progress percentage calculation"""
        target_date = datetime.now() + timedelta(days=30)
        goal = SavingsGoal(
            user_id="user123",
            title="Test Goal",
            target_amount=Decimal("1000.00"),
            target_date=target_date,
            current_amount=Decimal("250.00")
        )
        
        assert goal.progress_percentage == 25.0
        assert goal.remaining_amount == Decimal("750.00")
    
    def test_update_progress_valid(self):
        """Test updating goal progress with valid amount"""
        target_date = datetime.now() + timedelta(days=30)
        goal = SavingsGoal(
            user_id="user123",
            title="Test Goal",
            target_amount=Decimal("1000.00"),
            target_date=target_date
        )
        
        # Update progress
        completed = goal.update_progress(Decimal("250.00"))
        assert not completed
        assert goal.current_amount == Decimal("250.00")
        assert goal.progress_percentage == 25.0
        assert goal.status == GoalStatus.ACTIVE
        
        # Complete the goal
        completed = goal.update_progress(Decimal("750.00"))
        assert completed
        assert goal.current_amount == Decimal("1000.00")
        assert goal.status == GoalStatus.COMPLETED
    
    def test_update_progress_invalid_amount(self):
        """Test updating goal progress with negative amount"""
        target_date = datetime.now() + timedelta(days=30)
        goal = SavingsGoal(
            user_id="user123",
            title="Test Goal",
            target_amount=Decimal("1000.00"),
            target_date=target_date
        )
        
        with pytest.raises(ValueError, match="Amount to add must be non-negative"):
            goal.update_progress(Decimal("-100.00"))
    
    def test_required_daily_savings(self):
        """Test required daily savings calculation"""
        target_date = datetime.now() + timedelta(days=10)
        goal = SavingsGoal(
            user_id="user123",
            title="Test Goal",
            target_amount=Decimal("1000.00"),
            target_date=target_date,
            current_amount=Decimal("500.00")
        )
        
        # Should need to save $50 per day for remaining 10 days
        required_daily = goal.required_daily_savings
        assert required_daily == Decimal("50.00")
    
    def test_is_overdue(self):
        """Test overdue detection"""
        past_date = datetime.now() - timedelta(days=1)
        goal = SavingsGoal(
            user_id="user123",
            title="Overdue Goal",
            target_amount=Decimal("1000.00"),
            target_date=past_date
        )
        
        # Manually set the target date after creation to bypass validation
        goal.target_date = past_date
        assert goal.is_overdue
    
    def test_goal_serialization(self):
        """Test converting goal to dictionary"""
        target_date = datetime.now() + timedelta(days=30)
        goal = SavingsGoal(
            user_id="user123",
            title="Test Goal",
            target_amount=Decimal("1000.00"),
            target_date=target_date,
            description="Test description",
            category="test"
        )
        
        goal_dict = goal.to_dict()
        
        assert goal_dict['user_id'] == "user123"
        assert goal_dict['title'] == "Test Goal"
        assert goal_dict['target_amount'] == "1000.00"
        assert goal_dict['status'] == "active"
        assert goal_dict['description'] == "Test description"
        assert goal_dict['category'] == "test"
        assert 'progress_percentage' in goal_dict
        assert 'remaining_amount' in goal_dict
        assert 'days_remaining' in goal_dict


class TestSavingsGoalTracker:
    """Test cases for the SavingsGoalTracker class"""
    
    @pytest.fixture
    def tracker(self):
        """Create a tracker instance with test data"""
        tracker = SavingsGoalTracker()
        
        # Add test user
        user = User(
            user_id="user123",
            username="testuser",
            email="test@example.com"
        )
        tracker.add_user(user)
        
        return tracker
    
    def test_add_user(self, tracker):
        """Test adding a user to the system"""
        new_user = User(
            user_id="user456",
            username="newuser",
            email="new@example.com"
        )
        tracker.add_user(new_user)
        
        assert "user456" in tracker.users
        assert tracker.users["user456"].username == "newuser"
    
    def test_create_savings_goal_valid(self, tracker):
        """Test creating a valid savings goal"""
        target_date = datetime.now() + timedelta(days=30)
        goal_id = tracker.create_savings_goal(
            user_id="user123",
            title="Test Goal",
            target_amount=Decimal("1000.00"),
            target_date=target_date,
            description="Test description",
            category="test"
        )
        
        assert goal_id in tracker.goals
        goal = tracker.goals[goal_id]
        assert goal.user_id == "user123"
        assert goal.title == "Test Goal"
        assert goal.target_amount == Decimal("1000.00")
    
    def test_create_savings_goal_invalid_user(self, tracker):
        """Test creating goal for non-existent user"""
        target_date = datetime.now() + timedelta(days=30)
        
        with pytest.raises(ValueError, match="User nonexistent not found"):
            tracker.create_savings_goal(
                user_id="nonexistent",
                title="Test Goal",
                target_amount=Decimal("1000.00"),
                target_date=target_date
            )
    
    def test_update_goal_progress_valid(self, tracker):
        """Test updating goal progress"""
        target_date = datetime.now() + timedelta(days=30)
        goal_id = tracker.create_savings_goal(
            user_id="user123",
            title="Test Goal",
            target_amount=Decimal("1000.00"),
            target_date=target_date
        )
        
        # Update progress
        completed, notification = tracker.update_goal_progress(goal_id, Decimal("500.00"))
        assert not completed
        assert notification is None
        assert tracker.goals[goal_id].current_amount == Decimal("500.00")
        
        # Complete the goal
        completed, notification = tracker.update_goal_progress(goal_id, Decimal("500.00"))
        assert completed
        assert notification is not None
        assert notification.notification_type == NotificationType.GOAL_ACHIEVED
        assert tracker.goals[goal_id].status == GoalStatus.COMPLETED
    
    def test_update_goal_progress_invalid_goal(self, tracker):
        """Test updating progress for non-existent goal"""
        with pytest.raises(ValueError, match="Goal nonexistent not found"):
            tracker.update_goal_progress("nonexistent", Decimal("100.00"))
    
    def test_get_user_goals(self, tracker):
        """Test retrieving user goals"""
        target_date = datetime.now() + timedelta(days=30)
        
        # Create multiple goals
        goal1_id = tracker.create_savings_goal(
            user_id="user123",
            title="Goal 1",
            target_amount=Decimal("500.00"),
            target_date=target_date
        )
        
        goal2_id = tracker.create_savings_goal(
            user_id="user123",
            title="Goal 2",
            target_amount=Decimal("1000.00"),
            target_date=target_date + timedelta(days=10)
        )
        
        # Complete one goal
        tracker.update_goal_progress(goal1_id, Decimal("500.00"))
        
        # Get all goals
        all_goals = tracker.get_user_goals("user123")
        assert len(all_goals) == 2
        
        # Get only active goals
        active_goals = tracker.get_user_goals("user123", GoalStatus.ACTIVE)
        assert len(active_goals) == 1
        assert active_goals[0].goal_id == goal2_id
        
        # Get only completed goals
        completed_goals = tracker.get_user_goals("user123", GoalStatus.COMPLETED)
        assert len(completed_goals) == 1
        assert completed_goals[0].goal_id == goal1_id
    
    def test_check_approaching_deadlines(self, tracker):
        """Test checking for approaching deadlines"""
        # Create goal with deadline in 5 days
        soon_date = datetime.now() + timedelta(days=5)
        goal_id = tracker.create_savings_goal(
            user_id="user123",
            title="Soon Due Goal",
            target_amount=Decimal("1000.00"),
            target_date=soon_date
        )
        
        # Add some progress
        tracker.update_goal_progress(goal_id, Decimal("300.00"))
        
        # Check for approaching deadlines (default 7 days warning)
        notifications = tracker.check_approaching_deadlines()
        
        assert len(notifications) == 1
        notification = notifications[0]
        assert notification.notification_type == NotificationType.DEADLINE_APPROACHING
        assert "5 days" in notification.message
        assert "30.0%" in notification.message  # Progress percentage
    
    def test_check_overdue_goals(self, tracker):
        """Test checking for overdue goals"""
        # Create goal with past deadline
        past_date = datetime.now() - timedelta(days=1)
        goal_id = tracker.create_savings_goal(
            user_id="user123",
            title="Test Goal",
            target_amount=Decimal("1000.00"),
            target_date=datetime.now() + timedelta(days=30)  # Valid for creation
        )
        
        # Manually set past date to simulate overdue goal
        tracker.goals[goal_id].target_date = past_date
        
        notifications = tracker.check_approaching_deadlines()
        
        assert len(notifications) == 1
        notification = notifications[0]
        assert notification.notification_type == NotificationType.OVERDUE_REMINDER
        assert "overdue" in notification.message.lower()
        assert tracker.goals[goal_id].status == GoalStatus.OVERDUE
    
    def test_get_goal_analytics(self, tracker):
        """Test getting detailed goal analytics"""
        target_date = datetime.now() + timedelta(days=20)
        goal_id = tracker.create_savings_goal(
            user_id="user123",
            title="Analytics Test Goal",
            target_amount=Decimal("1000.00"),
            target_date=target_date
        )
        
        # Add some progress
        tracker.update_goal_progress(goal_id, Decimal("400.00"))
        
        analytics = tracker.get_goal_analytics(goal_id)
        
        assert 'goal_info' in analytics
        assert 'time_analytics' in analytics
        assert 'progress_analytics' in analytics
        
        # Check specific analytics
        assert analytics['progress_analytics']['completion_percentage'] == 40.0
        assert analytics['progress_analytics']['amount_saved'] == 400.0
        assert analytics['progress_analytics']['amount_remaining'] == 600.0
        
        # Time analytics
        assert 'days_elapsed' in analytics['time_analytics']
        assert 'days_remaining' in analytics['time_analytics']
        assert 'required_daily_savings' in analytics['time_analytics']
    
    def test_get_goal_analytics_invalid_goal(self, tracker):
        """Test getting analytics for non-existent goal"""
        with pytest.raises(ValueError, match="Goal nonexistent not found"):
            tracker.get_goal_analytics("nonexistent")
    
    def test_export_user_data(self, tracker):
        """Test exporting user data as JSON"""
        target_date = datetime.now() + timedelta(days=30)
        goal_id = tracker.create_savings_goal(
            user_id="user123",
            title="Export Test Goal",
            target_amount=Decimal("1000.00"),
            target_date=target_date
        )
        
        # Add progress and generate notification
        tracker.update_goal_progress(goal_id, Decimal("500.00"))
        
        # Export data
        json_data = tracker.export_user_data("user123")
        data = json.loads(json_data)
        
        assert 'user' in data
        assert 'goals' in data
        assert 'notifications' in data
        assert 'summary' in data
        
        # Check user data
        assert data['user']['user_id'] == "user123"
        assert data['user']['username'] == "testuser"
        
        # Check goals data
        assert len(data['goals']) == 1
        assert data['goals'][0]['title'] == "Export Test Goal"
        
        # Check summary
        assert data['summary']['total_goals'] == 1
        assert data['summary']['active_goals'] == 1
        assert data['summary']['completed_goals'] == 0
    
    def test_export_user_data_invalid_user(self, tracker):
        """Test exporting data for non-existent user"""
        with pytest.raises(ValueError, match="User nonexistent not found"):
            tracker.export_user_data("nonexistent")


class TestNotificationSystem:
    """Test cases for the notification system"""
    
    def test_notification_creation(self):
        """Test creating a notification"""
        notification = Notification(
            user_id="user123",
            goal_id="goal456",
            notification_type=NotificationType.DEADLINE_APPROACHING,
            message="Test notification message"
        )
        
        assert notification.user_id == "user123"
        assert notification.goal_id == "goal456"
        assert notification.notification_type == NotificationType.DEADLINE_APPROACHING
        assert notification.message == "Test notification message"
        assert not notification.sent
        assert len(notification.notification_id) > 0
    
    def test_duplicate_notification_prevention(self):
        """Test that duplicate notifications aren't created within 24 hours"""
        tracker = SavingsGoalTracker()
        
        # Add user
        user = User(user_id="user123", username="testuser", email="test@example.com")
        tracker.add_user(user)
        
        # Create goal with approaching deadline
        soon_date = datetime.now() + timedelta(days=3)
        goal_id = tracker.create_savings_goal(
            user_id="user123",
            title="Soon Due Goal",
            target_amount=Decimal("1000.00"),
            target_date=soon_date
        )
        
        # First check should create notification
        notifications1 = tracker.check_approaching_deadlines()
        assert len(notifications1) == 1
        
        # Second check immediately after should not create duplicate
        notifications2 = tracker.check_approaching_deadlines()
        assert len(notifications2) == 0


class TestEdgeCases:
    """Test edge cases and boundary conditions"""
    
    def test_zero_target_amount_progress(self):
        """Test progress calculation with edge case amounts"""
        target_date = datetime.now() + timedelta(days=30)
        
        # Very small target amount
        goal = SavingsGoal(
            user_id="user123",
            title="Small Goal",
            target_amount=Decimal("0.01"),
            target_date=target_date
        )
        
        assert goal.progress_percentage == 0.0
        goal.update_progress(Decimal("0.01"))
        assert goal.progress_percentage == 100.0
    
    def test_monetary_precision(self):
        """Test that monetary values maintain proper precision"""
        target_date = datetime.now() + timedelta(days=30)
        goal = SavingsGoal(
            user_id="user123",
            title="Precision Test",
            target_amount=Decimal("100.999"),  # Should round to 101.00
            target_date=target_date
        )
        
        assert goal.target_amount == Decimal("101.00")
        
        # Test update with high precision
        goal.update_progress(Decimal("33.333"))
        assert goal.current_amount == Decimal("33.33")
    
    def test_same_day_deadline(self):
        """Test goal with deadline today"""
        # Create goal that expires in a few hours (same day)
        today_late = datetime.now().replace(hour=23, minute=59, second=59)
        
        tracker = SavingsGoalTracker()
        user = User(user_id="user123", username="testuser", email="test@example.com")
        tracker.add_user(user)
        
        goal_id = tracker.create_savings_goal(
            user_id="user123",
            title="Same Day Goal",
            target_amount=Decimal("100.00"),
            target_date=today_late
        )
        
        # Should still be 0 days remaining (same day)
        goal = tracker.goals[goal_id]
        assert goal.days_remaining == 0


if __name__ == "__main__":
    # Run tests if executed directly
    pytest.main([__file__, "-v"])