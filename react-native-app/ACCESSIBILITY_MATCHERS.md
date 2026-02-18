# React Native Testing Library - Accessibility Matchers Quick Reference

This guide provides quick examples of using React Native Testing Library's built-in accessibility matchers (v12.4+).

## Query Methods

### getByRole / getAllByRole
Find elements by their accessibility role.

```javascript
// Find a button
const button = screen.getByRole('button');
const submitBtn = screen.getByRole('button', { name: 'Submit' });

// Find a header
const header = screen.getByRole('header', { name: 'Dashboard' });

// Find all buttons
const allButtons = screen.getAllByRole('button');

// Common roles
screen.getByRole('button')      // Buttons
screen.getByRole('header')      // Headers
screen.getByRole('link')        // Links
screen.getByRole('text')        // Text elements
screen.getByRole('checkbox')    // Checkboxes
screen.getByRole('switch')      // Switch toggles
screen.getByRole('image')       // Images
screen.getByRole('imagebutton') // Image buttons
```

### getByLabelText / getAllByLabelText
Find elements by their accessibility label.

```javascript
// Find by exact label
const input = screen.getByLabelText('Username');

// Find with regex
const input = screen.getByLabelText(/username/i);

// Find form input
const emailInput = screen.getByLabelText('Email address');
```

### getByA11yHint / getAllByA11yHint
Find elements by their accessibility hint.

```javascript
// Find by exact hint
const input = screen.getByA11yHint('Enter your username to login');

// Find with regex
const button = screen.getByA11yHint(/navigate to/i);
```

### getByA11yState / getAllByA11yState
Find elements by their accessibility state.

```javascript
// Find checked checkbox
const checkbox = screen.getByA11yState({ checked: true });

// Find expanded accordion
const accordion = screen.getByA11yState({ expanded: true });

// Find selected item
const item = screen.getByA11yState({ selected: true });
```

### getByA11yValue / getAllByA11yValue
Find elements by their accessibility value.

```javascript
// Find slider with specific value
const slider = screen.getByA11yValue({ now: 50, min: 0, max: 100 });
```

## Testing Patterns

### Testing Buttons

```javascript
it('has an accessible submit button', () => {
  render(<MyForm />);
  
  // Find by role and name
  const button = screen.getByRole('button', { name: 'Submit Form' });
  
  // Verify it exists
  expect(button).toBeTruthy();
  
  // Test interaction
  fireEvent.press(button);
  expect(mockSubmitFn).toHaveBeenCalled();
});
```

### Testing Form Inputs

```javascript
it('has accessible form inputs', () => {
  render(<LoginForm />);
  
  // Find inputs by their labels
  const usernameInput = screen.getByLabelText('Username');
  const passwordInput = screen.getByLabelText('Password');
  
  // Verify hints
  expect(screen.getByA11yHint('Enter your username')).toBeTruthy();
  
  // Test input
  fireEvent.changeText(usernameInput, 'testuser');
  expect(usernameInput.props.value).toBe('testuser');
});
```

### Testing State Changes

```javascript
it('announces state changes', () => {
  render(<TodoItem task={mockTask} />);
  
  // Find checkbox by role
  const checkbox = screen.getByRole('checkbox', { name: 'Buy groceries' });
  
  // Initially unchecked
  expect(checkbox).toHaveA11yState({ checked: false });
  
  // Toggle it
  fireEvent.press(checkbox);
  
  // Now checked
  expect(checkbox).toHaveA11yState({ checked: true });
});
```

### Testing Navigation

```javascript
it('has logical focus order', () => {
  render(<Dashboard />);
  
  // Get all interactive elements
  const buttons = screen.getAllByRole('button');
  const links = screen.getAllByRole('link');
  
  // Verify they exist and are in order
  expect(buttons.length).toBeGreaterThan(0);
  expect(links.length).toBeGreaterThan(0);
  
  // Test first button
  fireEvent.press(buttons[0]);
  expect(mockNavigate).toHaveBeenCalled();
});
```

### Testing Headers

```javascript
it('has proper heading hierarchy', () => {
  render(<Screen />);
  
  // Find main header
  const mainHeader = screen.getByRole('header', { name: 'Dashboard' });
  expect(mainHeader).toBeTruthy();
  
  // Find all headers
  const allHeaders = screen.getAllByRole('header');
  expect(allHeaders.length).toBeGreaterThan(0);
});
```

### Testing Switches/Toggles

```javascript
it('has accessible toggle switches', () => {
  render(<Settings />);
  
  // Find switch by label
  const notifSwitch = screen.getByLabelText('Enable notifications');
  
  // Check initial state
  expect(notifSwitch).toHaveA11yState({ checked: false });
  
  // Toggle it
  fireEvent(notifSwitch, 'valueChange', true);
  
  // Verify new state
  expect(notifSwitch).toHaveA11yState({ checked: true });
});
```

### Testing Links

```javascript
it('has accessible links', () => {
  render(<HelpScreen />);
  
  // Find link by role
  const helpLink = screen.getByRole('link', { name: 'Contact Support' });
  
  // Verify hint mentions external browser
  expect(screen.getByA11yHint(/opens in external browser/i)).toBeTruthy();
  
  // Test link press
  fireEvent.press(helpLink);
});
```

### Testing Lists

```javascript
it('has accessible list items', () => {
  render(<TaskList tasks={mockTasks} />);
  
  // Find all items by role
  const items = screen.getAllByRole('button');
  
  // Each item should have a label
  expect(items[0]).toHaveAccessibilityLabel(/task name/i);
  
  // Test selecting an item
  fireEvent.press(items[0]);
  expect(mockSelectTask).toHaveBeenCalledWith(mockTasks[0].id);
});
```

### Testing Modals

```javascript
it('announces modal dialogs', () => {
  render(<ModalScreen />);
  
  // Open modal
  const openButton = screen.getByRole('button', { name: 'Open Dialog' });
  fireEvent.press(openButton);
  
  // Find modal content
  const modal = screen.getByLabelText('Edit Task Dialog');
  expect(modal).toBeTruthy();
  
  // Find close button
  const closeButton = screen.getByRole('button', { name: 'Close' });
  fireEvent.press(closeButton);
});
```

## Custom Matchers

### toHaveAccessibilityLabel

```javascript
// Check if element has specific accessibility label
expect(button).toHaveAccessibilityLabel('Submit Form');
```

### toHaveA11yState

```javascript
// Check accessibility state
expect(checkbox).toHaveA11yState({ checked: true });
expect(accordion).toHaveA11yState({ expanded: false });
expect(listItem).toHaveA11yState({ selected: true });
```

## Best Practices

### 1. Prefer Role-Based Queries
```javascript
// ✅ Good - Uses semantic role
const button = screen.getByRole('button', { name: 'Submit' });

// ❌ Avoid - Too generic
const button = screen.getByText('Submit');
```

### 2. Use Accessible Names
```javascript
// ✅ Good - Descriptive accessible name
<Pressable
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Submit login form"
  accessibilityHint="Tap to login with your credentials"
/>

// ❌ Avoid - No accessible name
<Pressable onPress={handleSubmit}>
  <Text>Submit</Text>
</Pressable>
```

### 3. Test State Changes
```javascript
// ✅ Good - Verifies state is communicated
expect(toggle).toHaveA11yState({ checked: true });

// ❌ Incomplete - Only checks visual prop
expect(toggle.props.value).toBe(true);
```

### 4. Test Focus Order
```javascript
// ✅ Good - Verifies navigation order
const buttons = screen.getAllByRole('button');
expect(buttons[0]).toHaveAccessibilityLabel('First action');
expect(buttons[1]).toHaveAccessibilityLabel('Second action');
```

### 5. Validate Error Messages
```javascript
// ✅ Good - Ensures errors are accessible
fireEvent.changeText(input, 'invalid@');
fireEvent.press(submitButton);
expect(screen.getByText('Invalid email format')).toBeTruthy();
```

## Common Patterns

### Loading States
```javascript
it('announces loading state', () => {
  render(<DataScreen loading={true} />);
  
  // Check for loading indicator
  const loadingText = screen.getByLabelText('Loading data');
  expect(loadingText).toBeTruthy();
});
```

### Empty States
```javascript
it('announces empty state', () => {
  render(<TaskList tasks={[]} />);
  
  const emptyMessage = screen.getByText('No tasks yet');
  expect(emptyMessage).toBeTruthy();
});
```

### Error States
```javascript
it('announces error messages', () => {
  render(<Form error="Invalid input" />);
  
  const errorMessage = screen.getByText('Invalid input');
  expect(errorMessage).toBeTruthy();
});
```

## Debug Tips

### View Element Tree
```javascript
// See all elements in the tree
screen.debug();

// See specific element
screen.debug(element);
```

### Log All Queries
```javascript
// See what queries are available
const { debug, logTestingPlaygroundURL } = render(<MyComponent />);
debug();
```

### Check Accessibility Info
```javascript
// Get all accessibility props of an element
console.log(element.props);
console.log(element.props.accessibilityRole);
console.log(element.props.accessibilityLabel);
console.log(element.props.accessibilityState);
```

## Resources

- [React Native Testing Library Docs](https://callstack.github.io/react-native-testing-library/)
- [Queries Cheatsheet](https://callstack.github.io/react-native-testing-library/docs/api-queries)
- [React Native Accessibility Guide](https://reactnative.dev/docs/accessibility)
- [Full Testing Examples](./app/__tests__/accessibility.test.tsx)

## Need Help?

See `ACCESSIBILITY_TESTING.md` for:
- Manual testing with TalkBack and VoiceOver
- WCAG compliance guidelines
- Common issues and solutions
