"""
Savings Goal Tracking System for Mobile Banking App

This module provides functionality for users to set, track, and manage their savings goals
with notification capabilities for approaching deadlines.

Author: Financial Technology Development Team
"""

from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum
import uuid
import json
from decimal import Decimal, ROUND_HALF_UP


class GoalStatus(Enum):
    """Enumeration for savings goal status"""
    ACTIVE = "active"
    COMPLETED = "completed"
    OVERDUE = "overdue"
    CANCELLED = "cancelled"


class NotificationType(Enum):
    """Enumeration for notification types"""
    DEADLINE_APPROACHING = "deadline_approaching"
    GOAL_ACHIEVED = "goal_achieved"
    OVERDUE_REMINDER = "overdue_reminder"
    PROGRESS_MILESTONE = "progress_milestone"


@dataclass
class SavingsGoal:
    """
    Represents a savings goal for a user
    
    Attributes:
        goal_id: Unique identifier for the goal
        user_id: ID of the user who owns this goal
        title: Human-readable name for the goal
        target_amount: Target amount to save (in dollars)
        current_amount: Current saved amount (in dollars)
        target_date: Date by which the goal should be achieved
        created_date: When the goal was created
        status: Current status of the goal
        description: Optional description of the goal
        category: Optional category (e.g., 'vacation', 'emergency', 'house')
    """
    user_id: str
    title: str
    target_amount: Decimal
    target_date: datetime
    goal_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    current_amount: Decimal = field(default_factory=lambda: Decimal('0.00'))
    created_date: datetime = field(default_factory=datetime.now)
    status: GoalStatus = GoalStatus.ACTIVE
    description: Optional[str] = None
    category: Optional[str] = None

    def __post_init__(self):
        """Validate goal parameters after initialization"""
        if self.target_amount <= 0:
            raise ValueError("Target amount must be positive")
        if self.current_amount < 0:
            raise ValueError("Current amount cannot be negative")
        if self.target_date <= datetime.now():
            raise ValueError("Target date must be in the future")
        
        # Ensure monetary values are properly rounded to 2 decimal places
        self.target_amount = self.target_amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        self.current_amount = self.current_amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

    @property
    def progress_percentage(self) -> float:
        """Calculate progress as a percentage"""
        if self.target_amount == 0:
            return 0.0
        return float((self.current_amount / self.target_amount) * 100)

    @property
    def remaining_amount(self) -> Decimal:
        """Calculate remaining amount to reach goal"""
        return max(self.target_amount - self.current_amount, Decimal('0.00'))

    @property
    def days_remaining(self) -> int:
        """Calculate days remaining until target date"""
        delta = self.target_date - datetime.now()
        return max(delta.days, 0)

    @property
    def is_overdue(self) -> bool:
        """Check if the goal is overdue"""
        return datetime.now() > self.target_date and self.status == GoalStatus.ACTIVE

    @property
    def required_daily_savings(self) -> Decimal:
        """Calculate required daily savings to meet goal"""
        days_left = self.days_remaining
        if days_left <= 0:
            return self.remaining_amount
        return (self.remaining_amount / days_left).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

    def update_progress(self, amount: Decimal) -> bool:
        """
        Update the progress towards the goal
        
        Args:
            amount: Amount to add to current savings
            
        Returns:
            True if goal was completed with this update, False otherwise
        """
        if amount < 0:
            raise ValueError("Amount to add must be non-negative")
        
        self.current_amount += amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        
        # Check if goal is now complete
        if self.current_amount >= self.target_amount and self.status == GoalStatus.ACTIVE:
            self.status = GoalStatus.COMPLETED
            return True
        
        return False

    def to_dict(self) -> Dict:
        """Convert goal to dictionary for serialization"""
        return {
            'goal_id': self.goal_id,
            'user_id': self.user_id,
            'title': self.title,
            'target_amount': str(self.target_amount),
            'current_amount': str(self.current_amount),
            'target_date': self.target_date.isoformat(),
            'created_date': self.created_date.isoformat(),
            'status': self.status.value,
            'description': self.description,
            'category': self.category,
            'progress_percentage': self.progress_percentage,
            'remaining_amount': str(self.remaining_amount),
            'days_remaining': self.days_remaining
        }


@dataclass
class User:
    """
    Represents a user in the banking system
    
    Attributes:
        user_id: Unique identifier for the user
        username: User's username
        email: User's email address for notifications
        phone: User's phone number for SMS notifications
        notification_preferences: Dictionary of notification preferences
    """
    user_id: str
    username: str
    email: str
    phone: Optional[str] = None
    notification_preferences: Dict[str, bool] = field(default_factory=lambda: {
        'email_notifications': True,
        'sms_notifications': False,
        'push_notifications': True,
        'deadline_warnings': True,
        'progress_updates': True
    })


@dataclass
class Notification:
    """
    Represents a notification to be sent to a user
    
    Attributes:
        notification_id: Unique identifier for the notification
        user_id: ID of the user to notify
        goal_id: ID of the related goal
        notification_type: Type of notification
        message: Notification message
        created_at: When the notification was created
        sent: Whether the notification has been sent
    """
    user_id: str
    goal_id: str
    notification_type: NotificationType
    message: str
    notification_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = field(default_factory=datetime.now)
    sent: bool = False


class SavingsGoalTracker:
    """
    Main class for managing savings goals and notifications
    """
    
    def __init__(self):
        self.goals: Dict[str, SavingsGoal] = {}
        self.users: Dict[str, User] = {}
        self.notifications: List[Notification] = []
        
    def add_user(self, user: User) -> None:
        """Add a new user to the system"""
        self.users[user.user_id] = user
    
    def create_savings_goal(self, user_id: str, title: str, target_amount: Decimal, 
                          target_date: datetime, description: Optional[str] = None, 
                          category: Optional[str] = None) -> str:
        """
        Create a new savings goal for a user
        
        Args:
            user_id: ID of the user creating the goal
            title: Title of the savings goal
            target_amount: Target amount to save
            target_date: Date to achieve the goal by
            description: Optional description
            category: Optional category
            
        Returns:
            goal_id: ID of the created goal
            
        Raises:
            ValueError: If user doesn't exist or invalid parameters
        """
        if user_id not in self.users:
            raise ValueError(f"User {user_id} not found")
        
        goal = SavingsGoal(
            user_id=user_id,
            title=title,
            target_amount=target_amount,
            target_date=target_date,
            description=description,
            category=category
        )
        
        self.goals[goal.goal_id] = goal
        return goal.goal_id
    
    def update_goal_progress(self, goal_id: str, amount: Decimal) -> Tuple[bool, Optional[Notification]]:
        """
        Update progress on a savings goal
        
        Args:
            goal_id: ID of the goal to update
            amount: Amount to add to the goal
            
        Returns:
            Tuple of (goal_completed, notification)
            
        Raises:
            ValueError: If goal doesn't exist or invalid amount
        """
        if goal_id not in self.goals:
            raise ValueError(f"Goal {goal_id} not found")
        
        goal = self.goals[goal_id]
        goal_completed = goal.update_progress(amount)
        
        notification = None
        if goal_completed:
            # Create completion notification
            message = f"🎉 Congratulations! You've achieved your savings goal '{goal.title}'! You saved ${goal.current_amount}."
            notification = Notification(
                user_id=goal.user_id,
                goal_id=goal_id,
                notification_type=NotificationType.GOAL_ACHIEVED,
                message=message
            )
            self.notifications.append(notification)
        
        return goal_completed, notification
    
    def get_user_goals(self, user_id: str, status_filter: Optional[GoalStatus] = None) -> List[SavingsGoal]:
        """
        Get all goals for a specific user
        
        Args:
            user_id: ID of the user
            status_filter: Optional status to filter by
            
        Returns:
            List of savings goals
        """
        user_goals = [goal for goal in self.goals.values() if goal.user_id == user_id]
        
        if status_filter:
            user_goals = [goal for goal in user_goals if goal.status == status_filter]
            
        return sorted(user_goals, key=lambda x: x.target_date)
    
    def check_approaching_deadlines(self, warning_days: int = 7) -> List[Notification]:
        """
        Check for goals with approaching deadlines and create notifications
        
        Args:
            warning_days: Number of days before deadline to warn
            
        Returns:
            List of notifications created
        """
        notifications = []
        current_date = datetime.now()
        
        for goal in self.goals.values():
            if goal.status != GoalStatus.ACTIVE:
                continue
                
            days_remaining = goal.days_remaining
            
            # Check if goal is overdue
            if goal.is_overdue:
                goal.status = GoalStatus.OVERDUE
                message = f"⚠️ Your savings goal '{goal.title}' is overdue! You still need ${goal.remaining_amount} to reach your target."
                notification = Notification(
                    user_id=goal.user_id,
                    goal_id=goal.goal_id,
                    notification_type=NotificationType.OVERDUE_REMINDER,
                    message=message
                )
                notifications.append(notification)
                
            # Check if deadline is approaching
            elif 0 < days_remaining <= warning_days:
                progress_pct = goal.progress_percentage
                message = f"⏰ Your savings goal '{goal.title}' is due in {days_remaining} days! You're {progress_pct:.1f}% complete (${goal.current_amount} of ${goal.target_amount}). Save ${goal.required_daily_savings} daily to reach your goal!"
                
                # Check if we haven't already sent a notification for this goal recently
                recent_notifications = [n for n in self.notifications 
                                      if n.goal_id == goal.goal_id 
                                      and n.notification_type == NotificationType.DEADLINE_APPROACHING
                                      and (current_date - n.created_at).days < 1]
                
                if not recent_notifications:
                    notification = Notification(
                        user_id=goal.user_id,
                        goal_id=goal.goal_id,
                        notification_type=NotificationType.DEADLINE_APPROACHING,
                        message=message
                    )
                    notifications.append(notification)
        
        self.notifications.extend(notifications)
        return notifications
    
    def get_goal_analytics(self, goal_id: str) -> Dict:
        """
        Get detailed analytics for a specific goal
        
        Args:
            goal_id: ID of the goal
            
        Returns:
            Dictionary containing goal analytics
        """
        if goal_id not in self.goals:
            raise ValueError(f"Goal {goal_id} not found")
        
        goal = self.goals[goal_id]
        
        return {
            'goal_info': goal.to_dict(),
            'time_analytics': {
                'days_elapsed': (datetime.now() - goal.created_date).days,
                'days_remaining': goal.days_remaining,
                'progress_rate_per_day': float(goal.current_amount / max((datetime.now() - goal.created_date).days, 1)),
                'required_daily_savings': float(goal.required_daily_savings)
            },
            'progress_analytics': {
                'completion_percentage': goal.progress_percentage,
                'amount_saved': float(goal.current_amount),
                'amount_remaining': float(goal.remaining_amount),
                'on_track': goal.current_amount >= (goal.target_amount * (datetime.now() - goal.created_date).days / (goal.target_date - goal.created_date).days)
            }
        }
    
    def export_user_data(self, user_id: str) -> str:
        """
        Export all user data as JSON
        
        Args:
            user_id: ID of the user
            
        Returns:
            JSON string containing user's goals and notifications
        """
        if user_id not in self.users:
            raise ValueError(f"User {user_id} not found")
        
        user_goals = self.get_user_goals(user_id)
        user_notifications = [n for n in self.notifications if n.user_id == user_id]
        
        data = {
            'user': {
                'user_id': user_id,
                'username': self.users[user_id].username,
                'email': self.users[user_id].email
            },
            'goals': [goal.to_dict() for goal in user_goals],
            'notifications': [
                {
                    'notification_id': n.notification_id,
                    'goal_id': n.goal_id,
                    'type': n.notification_type.value,
                    'message': n.message,
                    'created_at': n.created_at.isoformat(),
                    'sent': n.sent
                } for n in user_notifications
            ],
            'summary': {
                'total_goals': len(user_goals),
                'active_goals': len([g for g in user_goals if g.status == GoalStatus.ACTIVE]),
                'completed_goals': len([g for g in user_goals if g.status == GoalStatus.COMPLETED]),
                'total_target_amount': str(sum(g.target_amount for g in user_goals)),
                'total_saved_amount': str(sum(g.current_amount for g in user_goals))
            }
        }
        
        return json.dumps(data, indent=2, default=str)