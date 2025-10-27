#!/usr/bin/env python3
"""
Simple test runner for the Savings Goal Tracking System
This runs basic functionality tests without requiring pytest.
"""

import sys
from datetime import datetime, timedelta
from decimal import Decimal

from savings_goal_tracker import (
    SavingsGoal, User, SavingsGoalTracker, GoalStatus, NotificationType
)


def test_basic_goal_creation():
    """Test basic goal creation"""
    print("Testing basic goal creation...")
    
    target_date = datetime.now() + timedelta(days=30)
    goal = SavingsGoal(
        user_id="test_user",
        title="Test Goal",
        target_amount=Decimal("1000.00"),
        target_date=target_date
    )
    
    assert goal.user_id == "test_user"
    assert goal.title == "Test Goal"
    assert goal.target_amount == Decimal("1000.00")
    assert goal.current_amount == Decimal("0.00")
    assert goal.status == GoalStatus.ACTIVE
    assert goal.progress_percentage == 0.0
    
    print("✅ Basic goal creation test passed")


def test_progress_tracking():
    """Test progress tracking functionality"""
    print("Testing progress tracking...")
    
    target_date = datetime.now() + timedelta(days=30)
    goal = SavingsGoal(
        user_id="test_user",
        title="Test Goal",
        target_amount=Decimal("1000.00"),
        target_date=target_date
    )
    
    # Add progress
    completed = goal.update_progress(Decimal("250.00"))
    assert not completed
    assert goal.current_amount == Decimal("250.00")
    assert goal.progress_percentage == 25.0
    
    # Complete goal
    completed = goal.update_progress(Decimal("750.00"))
    assert completed
    assert goal.status == GoalStatus.COMPLETED
    
    print("✅ Progress tracking test passed")


def test_savings_goal_tracker():
    """Test the main tracker functionality"""
    print("Testing savings goal tracker...")
    
    tracker = SavingsGoalTracker()
    
    # Add user
    user = User(
        user_id="user123",
        username="testuser",
        email="test@example.com"
    )
    tracker.add_user(user)
    
    # Create goal
    target_date = datetime.now() + timedelta(days=30)
    goal_id = tracker.create_savings_goal(
        user_id="user123",
        title="Test Goal",
        target_amount=Decimal("1000.00"),
        target_date=target_date
    )
    
    assert goal_id in tracker.goals
    
    # Update progress
    completed, notification = tracker.update_goal_progress(goal_id, Decimal("500.00"))
    assert not completed
    assert notification is None
    
    # Complete goal
    completed, notification = tracker.update_goal_progress(goal_id, Decimal("500.00"))
    assert completed
    assert notification is not None
    assert notification.notification_type == NotificationType.GOAL_ACHIEVED
    
    print("✅ Savings goal tracker test passed")


def test_notifications():
    """Test notification system"""
    print("Testing notification system...")
    
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
    
    # Add some progress
    tracker.update_goal_progress(goal_id, Decimal("300.00"))
    
    # Check for approaching deadlines
    notifications = tracker.check_approaching_deadlines(warning_days=7)
    
    assert len(notifications) == 1
    assert notifications[0].notification_type == NotificationType.DEADLINE_APPROACHING
    assert "3 days" in notifications[0].message
    
    print("✅ Notification system test passed")


def test_analytics():
    """Test analytics functionality"""
    print("Testing analytics...")
    
    tracker = SavingsGoalTracker()
    
    # Add user
    user = User(user_id="user123", username="testuser", email="test@example.com")
    tracker.add_user(user)
    
    # Create goal
    target_date = datetime.now() + timedelta(days=20)
    goal_id = tracker.create_savings_goal(
        user_id="user123",
        title="Analytics Test Goal",
        target_amount=Decimal("1000.00"),
        target_date=target_date
    )
    
    # Add progress
    tracker.update_goal_progress(goal_id, Decimal("400.00"))
    
    # Get analytics
    analytics = tracker.get_goal_analytics(goal_id)
    
    assert 'goal_info' in analytics
    assert 'time_analytics' in analytics
    assert 'progress_analytics' in analytics
    assert analytics['progress_analytics']['completion_percentage'] == 40.0
    
    print("✅ Analytics test passed")


def test_edge_cases():
    """Test edge cases"""
    print("Testing edge cases...")
    
    # Test monetary precision
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
    
    print("✅ Edge cases test passed")


def run_all_tests():
    """Run all tests"""
    print("🧪 Running Savings Goal Tracker Tests")
    print("=" * 50)
    
    tests = [
        test_basic_goal_creation,
        test_progress_tracking,
        test_savings_goal_tracker,
        test_notifications,
        test_analytics,
        test_edge_cases
    ]
    
    passed = 0
    failed = 0
    
    for test_func in tests:
        try:
            test_func()
            passed += 1
        except Exception as e:
            print(f"❌ {test_func.__name__} failed: {e}")
            failed += 1
    
    print("\n" + "=" * 50)
    print(f"Test Results: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("🎉 All tests passed!")
        return True
    else:
        print("❌ Some tests failed")
        return False


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)