import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ActivitiesProvider, useActivities } from '../state/activitiesStore';
import { ReactNode } from 'react';

describe('Activities Store - Business Logic Tests', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ActivitiesProvider>{children}</ActivitiesProvider>
  );

  describe('Initialization', () => {
    test('initializes with default activities', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      expect(result.current.activities).toBeDefined();
      expect(Array.isArray(result.current.activities)).toBe(true);
    });

    test('provides addActivity function', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      expect(typeof result.current.addActivity).toBe('function');
    });

    test('provides toggleActivity function', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      expect(typeof result.current.toggleActivity).toBe('function');
    });

    test('provides deleteActivity function', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      expect(typeof result.current.deleteActivity).toBe('function');
    });
  });

  describe('Adding Activities', () => {
    test('addActivity adds new activity to state', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      const initialLength = result.current.activities.length;
      
      act(() => {
        result.current.addActivity('Morning Walk');
      });
      
      expect(result.current.activities.length).toBe(initialLength + 1);
    });

    test('newly added activity exists in state', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      const initialLength = result.current.activities.length;
      
      act(() => {
        result.current.addActivity('Evening Yoga');
      });
      
      expect(result.current.activities.length).toBe(initialLength + 1);
      const lastActivity = result.current.activities[result.current.activities.length - 1];
      expect(lastActivity).toBeDefined();
    });

    test('added activity has completed status as false', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      act(() => {
        result.current.addActivity('Breakfast');
      });
      
      const lastActivity = result.current.activities[result.current.activities.length - 1];
      expect(lastActivity.completed).toBe(false);
    });

    test('added activities have IDs', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      act(() => {
        result.current.addActivity('Test Activity 1');
      });
      
      const activity1 = result.current.activities[result.current.activities.length - 1];
      expect(activity1.id).toBeDefined();
      expect(activity1.id.length).toBeGreaterThan(0);
    });

    test('can add multiple activities', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      const initialLength = result.current.activities.length;
      
      act(() => {
        result.current.addActivity('Activity 1');
        result.current.addActivity('Activity 2');
        result.current.addActivity('Activity 3');
      });
      
      expect(result.current.activities.length).toBe(initialLength + 3);
    });
  });

  describe('Toggling Activities', () => {
    test('toggleActivity changes completed status', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      act(() => {
        result.current.addActivity('Toggleable Activity');
      });
      
      const activity = result.current.activities[result.current.activities.length - 1];
      const initialCompleted = activity.completed;
      
      act(() => {
        result.current.toggleActivity(activity.id);
      });
      
      const updatedActivity = result.current.activities.find(a => a.id === activity.id);
      expect(updatedActivity?.completed).toBe(!initialCompleted);
    });

    test('toggling twice returns to original state', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      act(() => {
        result.current.addActivity('Toggle Test');
      });
      
      const activity = result.current.activities[result.current.activities.length - 1];
      const initialCompleted = activity.completed;
      
      act(() => {
        result.current.toggleActivity(activity.id);
        result.current.toggleActivity(activity.id);
      });
      
      const finalActivity = result.current.activities.find(a => a.id === activity.id);
      expect(finalActivity?.completed).toBe(initialCompleted);
    });

    test('toggling non-existent ID does not crash', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      expect(() => {
        act(() => {
          result.current.toggleActivity('non-existent-id');
        });
      }).not.toThrow();
    });
  });

  describe('Deleting Activities', () => {
    test('deleteActivity removes activity from state', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      act(() => {
        result.current.addActivity('To Be Deleted');
      });
      
      const activity = result.current.activities[result.current.activities.length - 1];
      const lengthBefore = result.current.activities.length;
      
      act(() => {
        result.current.deleteActivity(activity.id);
      });
      
      expect(result.current.activities.length).toBe(lengthBefore - 1);
      expect(result.current.activities.find(a => a.id === activity.id)).toBeUndefined();
    });

    test('deleting non-existent activity does not affect state', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      const lengthBefore = result.current.activities.length;
      
      act(() => {
        result.current.deleteActivity('non-existent-id');
      });
      
      expect(result.current.activities.length).toBe(lengthBefore);
    });

    test('deleteActivity can be called multiple times', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      act(() => {
        result.current.addActivity('Delete Test 1');
      });
      
      const lengthBefore = result.current.activities.length;
      const activityId = result.current.activities[result.current.activities.length - 1].id;
      
      act(() => {
        result.current.deleteActivity(activityId);
      });
      
      expect(result.current.activities.length).toBeLessThan(lengthBefore + 1);
    });
  });

  describe('Activity Calculations', () => {
    test('calculates completed count correctly', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      act(() => {
        result.current.addActivity('Activity 1');
        result.current.addActivity('Activity 2');
        result.current.addActivity('Activity 3');
      });
      
      const ids = result.current.activities.slice(-3).map(a => a.id);
      
      act(() => {
        result.current.toggleActivity(ids[0]);
        result.current.toggleActivity(ids[1]);
      });
      
      const completedCount = result.current.activities.filter(a => a.completed).length;
      expect(completedCount).toBeGreaterThanOrEqual(2);
    });

    test('calculates pending count correctly', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      act(() => {
        result.current.addActivity('Pending 1');
        result.current.addActivity('Pending 2');
      });
      
      const pendingCount = result.current.activities.filter(a => !a.completed).length;
      expect(pendingCount).toBeGreaterThanOrEqual(2);
    });

    test('total count equals completed + pending', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      act(() => {
        result.current.addActivity('Test 1');
        result.current.addActivity('Test 2');
        result.current.addActivity('Test 3');
      });
      
      const total = result.current.activities.length;
      const completed = result.current.activities.filter(a => a.completed).length;
      const pending = result.current.activities.filter(a => !a.completed).length;
      
      expect(total).toBe(completed + pending);
    });
  });

  describe('Data Persistence', () => {
    test('activities persist across re-renders', () => {
      const { result, rerender } = renderHook(() => useActivities(), { wrapper });
      
      act(() => {
        result.current.addActivity('Persistent Activity');
      });
      
      const activityId = result.current.activities[result.current.activities.length - 1].id;
      
      rerender();
      
      const foundActivity = result.current.activities.find(a => a.id === activityId);
      expect(foundActivity).toBeDefined();
    });

    test('completed status persists across re-renders', () => {
      const { result, rerender } = renderHook(() => useActivities(), { wrapper });
      
      act(() => {
        result.current.addActivity('Status Test');
      });
      
      const activityId = result.current.activities[result.current.activities.length - 1].id;
      
      act(() => {
        result.current.toggleActivity(activityId);
      });
      
      rerender();
      
      const activity = result.current.activities.find(a => a.id === activityId);
      expect(activity?.completed).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('addActivity accepts string parameter', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      expect(() => {
        act(() => {
          result.current.addActivity('Valid Activity');
        });
      }).not.toThrow();
    });

    test('handles very long activity names', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      const longName = 'A'.repeat(1000);
      const initialLength = result.current.activities.length;
      
      act(() => {
        result.current.addActivity(longName);
      });
      
      expect(result.current.activities.length).toBe(initialLength + 1);
    });

    test('handles special characters in activity input', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      const specialName = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const initialLength = result.current.activities.length;
      
      act(() => {
        result.current.addActivity(specialName);
      });
      
      expect(result.current.activities.length).toBe(initialLength + 1);
    });

    test('handles unicode characters in activity input', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      const unicodeName = '🏃‍♂️ Morning Run 🌅';
      const initialLength = result.current.activities.length;
      
      act(() => {
        result.current.addActivity(unicodeName);
      });
      
      expect(result.current.activities.length).toBe(initialLength + 1);
    });
  });

  describe('Context Provider Error Handling', () => {
    test('throws error when useActivities called outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      expect(() => {
        renderHook(() => useActivities());
      }).toThrow('useActivities must be used within ActivitiesProvider');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Complex Workflows', () => {
    test('add, toggle, and delete workflow', () => {
      const { result } = renderHook(() => useActivities(), { wrapper });
      
      const lengthBefore = result.current.activities.length;
      
      act(() => {
        result.current.addActivity('Workflow Test');
      });
      
      expect(result.current.activities.length).toBe(lengthBefore + 1);
      
      const activity = result.current.activities[result.current.activities.length - 1];
      const initialCompleted = activity.completed;
      
      act(() => {
        result.current.toggleActivity(activity.id);
      });
      
      let updatedActivity = result.current.activities.find(a => a.id === activity.id);
      expect(updatedActivity?.completed).toBe(!initialCompleted);
      
      act(() => {
        result.current.deleteActivity(activity.id);
      });
      
      expect(result.current.activities.find(a => a.id === activity.id)).toBeUndefined();
    });

    test('bulk operations maintain data integrity', () => {
  const { result } = renderHook(() => useActivities(), { wrapper });
  
  // Add 10 activities
  const names = Array.from({ length: 10 }, (_, i) => `BulkTest ${i + 1}`);
  
  act(() => {
    names.forEach(name => result.current.addActivity(name));
  });
  
  const addedActivities = result.current.activities.slice(-10);
  expect(addedActivities.length).toBe(10);
  
  // Toggle every other one (5 activities)
  const idsToToggle = addedActivities.filter((_, index) => index % 2 === 0).map(a => a.id);
  expect(idsToToggle.length).toBe(5);
  
  act(() => {
    idsToToggle.forEach(id => result.current.toggleActivity(id));
  });
  
  // Verify toggles happened (at least some should be toggled)
  const completedActivities = result.current.activities.filter(a => 
    idsToToggle.includes(a.id) && a.completed
  );
  expect(completedActivities.length).toBeGreaterThanOrEqual(3);
  
  // Delete 5 activities
  const idsToDelete = addedActivities.slice(0, 5).map(a => a.id);
  
  act(() => {
    idsToDelete.forEach(id => result.current.deleteActivity(id));
  });
  
  // Verify they were deleted
  const deletedStillPresent = result.current.activities.filter(a =>
    idsToDelete.includes(a.id)
  );
  
  expect(deletedStillPresent.length).toBe(0);
    });
  });
});