#!/usr/bin/env python3
"""
Savings Goal Tracking System - Demo and Usage Examples

This script demonstrates how to use the savings goal tracking system for a mobile banking app.
It shows typical use cases and workflows that would be implemented in the actual banking application.

Author: Financial Technology Development Team
"""

from datetime import datetime, timedelta
from decimal import Decimal
import json
from savings_goal_tracker import (
    SavingsGoalTracker, User, GoalStatus, NotificationType
)


def print_banner(text: str) -> None:
    """Print a formatted banner for demo sections"""
    print(f"\n{'='*60}")
    print(f"  {text}")
    print(f"{'='*60}")


def print_goal_summary(goal_dict: dict) -> None:
    """Print a formatted goal summary"""
    print(f"📊 Goal: {goal_dict['title']}")
    print(f"   Target: ${goal_dict['target_amount']}")
    print(f"   Saved:  ${goal_dict['current_amount']} ({goal_dict['progress_percentage']:.1f}%)")
    print(f"   Remaining: ${goal_dict['remaining_amount']} in {goal_dict['days_remaining']} days")
    print(f"   Status: {goal_dict['status'].upper()}")
    if goal_dict['description']:
        print(f"   Description: {goal_dict['description']}")


def demo_basic_functionality():
    """Demonstrate basic savings goal functionality"""
    print_banner("Basic Savings Goal Functionality Demo")
    
    # Initialize the tracker
    tracker = SavingsGoalTracker()
    
    # Create users
    print("\n🔐 Creating users...")
    users = [
        User(
            user_id="alice_123",
            username="alice_johnson",
            email="alice@email.com",
            phone="+1-555-0101"
        ),
        User(
            user_id="bob_456",
            username="bob_smith",
            email="bob@email.com",
            notification_preferences={
                'email_notifications': True,
                'sms_notifications': True,
                'push_notifications': True,
                'deadline_warnings': True,
                'progress_updates': True
            }
        )
    ]
    
    for user in users:
        tracker.add_user(user)
        print(f"✅ Added user: {user.username} ({user.email})")
    
    # Create savings goals
    print("\n🎯 Creating savings goals...")
    
    # Alice's vacation goal
    vacation_goal_id = tracker.create_savings_goal(
        user_id="alice_123",
        title="European Vacation",
        target_amount=Decimal("3500.00"),
        target_date=datetime.now() + timedelta(days=180),
        description="Save for 2-week European vacation",
        category="travel"
    )
    print(f"✅ Created vacation goal for Alice: {vacation_goal_id}")
    
    # Alice's emergency fund
    emergency_goal_id = tracker.create_savings_goal(
        user_id="alice_123",
        title="Emergency Fund",
        target_amount=Decimal("5000.00"),
        target_date=datetime.now() + timedelta(days=365),
        description="Build 3-month emergency fund",
        category="emergency"
    )
    print(f"✅ Created emergency fund goal for Alice: {emergency_goal_id}")
    
    # Bob's car goal
    car_goal_id = tracker.create_savings_goal(
        user_id="bob_456",
        title="New Car Down Payment",
        target_amount=Decimal("8000.00"),
        target_date=datetime.now() + timedelta(days=240),
        description="Save for car down payment",
        category="transportation"
    )
    print(f"✅ Created car goal for Bob: {car_goal_id}")
    
    return tracker, {
        'vacation': vacation_goal_id,
        'emergency': emergency_goal_id,
        'car': car_goal_id
    }


def demo_progress_tracking(tracker: SavingsGoalTracker, goal_ids: dict):
    """Demonstrate progress tracking functionality"""
    print_banner("Progress Tracking Demo")
    
    # Simulate regular savings progress
    print("\n💰 Simulating savings progress...")
    
    # Alice makes regular contributions to vacation fund
    print("\nAlice's vacation fund progress:")
    contributions = [Decimal("200.00"), Decimal("150.00"), Decimal("300.00"), Decimal("250.00")]
    
    for i, amount in enumerate(contributions, 1):
        completed, notification = tracker.update_goal_progress(goal_ids['vacation'], amount)
        current_goal = tracker.goals[goal_ids['vacation']]
        print(f"  Week {i}: Added ${amount} → Total: ${current_goal.current_amount} ({current_goal.progress_percentage:.1f}%)")
        
        if completed:
            print(f"  🎉 Goal completed! Notification: {notification.message}")
    
    # Alice makes smaller contributions to emergency fund
    print("\nAlice's emergency fund progress:")
    emergency_contributions = [Decimal("100.00"), Decimal("75.00"), Decimal("125.00")]
    
    for i, amount in enumerate(emergency_contributions, 1):
        completed, notification = tracker.update_goal_progress(goal_ids['emergency'], amount)
        current_goal = tracker.goals[goal_ids['emergency']]
        print(f"  Month {i}: Added ${amount} → Total: ${current_goal.current_amount} ({current_goal.progress_percentage:.1f}%)")
    
    # Bob makes larger, less frequent contributions
    print("\nBob's car fund progress:")
    car_contributions = [Decimal("500.00"), Decimal("750.00"), Decimal("600.00")]
    
    for i, amount in enumerate(car_contributions, 1):
        completed, notification = tracker.update_goal_progress(goal_ids['car'], amount)
        current_goal = tracker.goals[goal_ids['car']]
        print(f"  Month {i}: Added ${amount} → Total: ${current_goal.current_amount} ({current_goal.progress_percentage:.1f}%)")


def demo_goal_analytics(tracker: SavingsGoalTracker, goal_ids: dict):
    """Demonstrate goal analytics functionality"""
    print_banner("Goal Analytics Demo")
    
    # Get detailed analytics for vacation goal
    print("\n📈 Detailed analytics for Alice's vacation goal:")
    analytics = tracker.get_goal_analytics(goal_ids['vacation'])
    
    print(f"Goal Information:")
    print(f"  • Title: {analytics['goal_info']['title']}")
    print(f"  • Target: ${analytics['goal_info']['target_amount']}")
    print(f"  • Current: ${analytics['goal_info']['current_amount']}")
    print(f"  • Progress: {analytics['progress_analytics']['completion_percentage']:.1f}%")
    
    print(f"\nTime Analytics:")
    print(f"  • Days elapsed: {analytics['time_analytics']['days_elapsed']}")
    print(f"  • Days remaining: {analytics['time_analytics']['days_remaining']}")
    print(f"  • Progress rate: ${analytics['time_analytics']['progress_rate_per_day']:.2f}/day")
    print(f"  • Required daily savings: ${analytics['time_analytics']['required_daily_savings']}")
    
    print(f"\nProgress Analytics:")
    print(f"  • Amount saved: ${analytics['progress_analytics']['amount_saved']}")
    print(f"  • Amount remaining: ${analytics['progress_analytics']['amount_remaining']}")
    print(f"  • On track: {'✅ Yes' if analytics['progress_analytics']['on_track'] else '❌ No'}")


def demo_notifications(tracker: SavingsGoalTracker, goal_ids: dict):
    """Demonstrate notification functionality"""
    print_banner("Notification System Demo")
    
    # Create a goal with an approaching deadline for demonstration
    print("\n⏰ Creating goal with approaching deadline...")
    urgent_goal_id = tracker.create_savings_goal(
        user_id="alice_123",
        title="Birthday Gift Fund",
        target_amount=Decimal("200.00"),
        target_date=datetime.now() + timedelta(days=3),  # Due in 3 days
        description="Save for friend's birthday gift",
        category="gifts"
    )
    
    # Add some progress but not enough to complete
    tracker.update_goal_progress(urgent_goal_id, Decimal("50.00"))
    
    # Check for approaching deadlines
    print("\n🔔 Checking for notifications...")
    notifications = tracker.check_approaching_deadlines(warning_days=7)
    
    print(f"Generated {len(notifications)} notifications:")
    for notification in notifications:
        print(f"  📱 {notification.notification_type.value.replace('_', ' ').title()}")
        print(f"     User: {notification.user_id}")
        print(f"     Message: {notification.message}")
        print(f"     Created: {notification.created_at.strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Demonstrate overdue goal handling
    print("\n⚠️  Simulating overdue goal...")
    overdue_goal_id = tracker.create_savings_goal(
        user_id="bob_456",
        title="Conference Registration",
        target_amount=Decimal("300.00"),
        target_date=datetime.now() + timedelta(days=1),  # Will be overdue soon
        category="professional"
    )
    
    # Manually set the goal as overdue for demo
    tracker.goals[overdue_goal_id].target_date = datetime.now() - timedelta(days=1)
    
    overdue_notifications = tracker.check_approaching_deadlines()
    print(f"\nOverdue notifications: {len(overdue_notifications)}")
    for notification in overdue_notifications:
        if notification.notification_type == NotificationType.OVERDUE_REMINDER:
            print(f"  ⚠️  {notification.message}")


def demo_user_data_management(tracker: SavingsGoalTracker):
    """Demonstrate user data management functionality"""
    print_banner("User Data Management Demo")
    
    # Display Alice's goals
    print("\n👤 Alice's Goals Summary:")
    alice_goals = tracker.get_user_goals("alice_123")
    
    for goal in alice_goals:
        goal_dict = goal.to_dict()
        print_goal_summary(goal_dict)
        print()
    
    # Filter goals by status
    print("\n🎯 Active Goals Only:")
    active_goals = tracker.get_user_goals("alice_123", status_filter=GoalStatus.ACTIVE)
    print(f"Alice has {len(active_goals)} active goals")
    
    # Export user data
    print("\n📄 Exporting Alice's data...")
    user_data_json = tracker.export_user_data("alice_123")
    user_data = json.loads(user_data_json)
    
    print("Export Summary:")
    print(f"  • Total goals: {user_data['summary']['total_goals']}")
    print(f"  • Active goals: {user_data['summary']['active_goals']}")
    print(f"  • Completed goals: {user_data['summary']['completed_goals']}")
    print(f"  • Total target amount: ${user_data['summary']['total_target_amount']}")
    print(f"  • Total saved amount: ${user_data['summary']['total_saved_amount']}")
    print(f"  • Total notifications: {len(user_data['notifications'])}")


def demo_real_world_scenarios():
    """Demonstrate real-world usage scenarios"""
    print_banner("Real-World Usage Scenarios")
    
    tracker = SavingsGoalTracker()
    
    # Scenario 1: User creates multiple savings goals with different priorities
    print("\n🌟 Scenario 1: Multi-goal savings strategy")
    
    user = User(
        user_id="sarah_789",
        username="sarah_miller",
        email="sarah@email.com"
    )
    tracker.add_user(user)
    
    # Create goals with different timeframes and amounts
    goals = [
        {
            'title': 'Wedding Fund',
            'amount': Decimal('15000.00'),
            'days': 365,
            'category': 'life_events',
            'description': 'Save for wedding expenses'
        },
        {
            'title': 'Laptop Upgrade',
            'amount': Decimal('2000.00'),
            'days': 90,
            'category': 'electronics',
            'description': 'New MacBook Pro for work'
        },
        {
            'title': 'Home Down Payment',
            'amount': Decimal('50000.00'),
            'days': 1095,  # 3 years
            'category': 'housing',
            'description': '20% down payment for house'
        }
    ]
    
    goal_ids = []
    for goal_info in goals:
        goal_id = tracker.create_savings_goal(
            user_id="sarah_789",
            title=goal_info['title'],
            target_amount=goal_info['amount'],
            target_date=datetime.now() + timedelta(days=goal_info['days']),
            description=goal_info['description'],
            category=goal_info['category']
        )
        goal_ids.append(goal_id)
        goal = tracker.goals[goal_id]
        print(f"📊 {goal.title}: ${goal.target_amount} in {goal.days_remaining} days (${goal.required_daily_savings}/day)")
    
    # Scenario 2: Automated savings contributions
    print("\n💳 Scenario 2: Automated weekly contributions")
    
    weekly_budget = Decimal('500.00')  # Sarah's weekly savings budget
    
    # Distribute budget across goals based on priority/urgency
    allocations = {
        goal_ids[1]: Decimal('200.00'),  # Laptop (highest priority - shortest deadline)
        goal_ids[0]: Decimal('250.00'),  # Wedding (medium priority)
        goal_ids[2]: Decimal('50.00'),   # House (lowest priority - longest timeline)
    }
    
    print("Weekly allocation strategy:")
    for goal_id, amount in allocations.items():
        goal = tracker.goals[goal_id]
        print(f"  • {goal.title}: ${amount}/week")
    
    # Simulate 8 weeks of contributions
    print(f"\nSimulating 8 weeks of contributions:")
    for week in range(1, 9):
        print(f"Week {week}:")
        for goal_id, weekly_amount in allocations.items():
            completed, notification = tracker.update_goal_progress(goal_id, weekly_amount)
            goal = tracker.goals[goal_id]
            print(f"  {goal.title}: ${goal.current_amount} ({goal.progress_percentage:.1f}%)")
            
            if completed:
                print(f"  🎉 {goal.title} completed!")
                # Reallocate funds to other goals
                remaining_goals = [gid for gid in allocations.keys() if gid != goal_id and tracker.goals[gid].status == GoalStatus.ACTIVE]
                if remaining_goals:
                    redistribution = weekly_amount / len(remaining_goals)
                    for remaining_goal_id in remaining_goals:
                        allocations[remaining_goal_id] += redistribution
                    allocations[goal_id] = Decimal('0.00')
                    print(f"  💰 Reallocated ${weekly_amount} to remaining goals")
        print()


def demo_integration_examples():
    """Show examples of how this would integrate with banking systems"""
    print_banner("Banking System Integration Examples")
    
    print("\n🏦 Integration Points:")
    print("""
1. Account Balance Integration:
   - Check if user has sufficient funds before goal creation
   - Automatically transfer funds when balance thresholds are met
   - Set up recurring transfers from checking to savings goals

2. Transaction Monitoring:
   - Monitor spending patterns to suggest realistic goal amounts
   - Track progress through account transactions
   - Detect when users make manual contributions

3. Mobile App Integration:
   - Push notifications for approaching deadlines
   - Progress widgets on home screen
   - Goal creation through conversational AI

4. Reporting and Analytics:
   - Monthly savings reports
   - Goal completion rates
   - Spending vs. saving analysis

5. Gamification Features:
   - Achievement badges for goal completion
   - Savings streaks and milestones
   - Social sharing of achievements (privacy-controlled)
    """)
    
    print("\n📱 Sample API Endpoints:")
    print("""
    POST /api/v1/users/{user_id}/goals
    GET  /api/v1/users/{user_id}/goals
    PUT  /api/v1/users/{user_id}/goals/{goal_id}/progress
    GET  /api/v1/users/{user_id}/goals/{goal_id}/analytics
    GET  /api/v1/users/{user_id}/notifications
    POST /api/v1/notifications/check-deadlines
    """)


def main():
    """Main demo function"""
    print("🏦 Savings Goal Tracking System Demo")
    print("=====================================")
    print("Welcome to the Financial Technology Company's")
    print("Mobile Banking App - Savings Goal Tracker Demo!")
    
    try:
        # Run basic functionality demo
        tracker, goal_ids = demo_basic_functionality()
        
        # Run progress tracking demo
        demo_progress_tracking(tracker, goal_ids)
        
        # Run analytics demo
        demo_goal_analytics(tracker, goal_ids)
        
        # Run notifications demo
        demo_notifications(tracker, goal_ids)
        
        # Run user data management demo
        demo_user_data_management(tracker)
        
        # Run real-world scenarios
        demo_real_world_scenarios()
        
        # Show integration examples
        demo_integration_examples()
        
        print_banner("Demo Completed Successfully! 🎉")
        print("""
The savings goal tracking system is ready for integration into your
mobile banking application. Key features demonstrated:

✅ Goal creation and management
✅ Progress tracking with monetary precision
✅ Intelligent notification system
✅ Comprehensive analytics
✅ Data export and user management
✅ Real-world scenario handling

Next Steps:
1. Run the test suite: python -m pytest test_savings_goal_tracker.py -v
2. Review the API documentation in the source code
3. Integrate with your existing banking infrastructure
4. Add mobile app UI components
5. Implement push notification service
        """)
        
    except Exception as e:
        print(f"❌ Demo failed with error: {e}")
        raise


if __name__ == "__main__":
    main()