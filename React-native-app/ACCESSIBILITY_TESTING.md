# Accessibility Testing Guide

This guide covers both automated and manual accessibility testing for the React Native CareConnect app.

## Table of Contents

1. [Automated Testing with React Native Testing Library](#automated-testing)
2. [Manual Testing with Screen Readers](#manual-testing)
   - [Testing with TalkBack (Android)](#testing-with-talkback)
   - [Testing with VoiceOver (iOS)](#testing-with-voiceover)
3. [Accessibility Checklist](#accessibility-checklist)
4. [Common Issues and Solutions](#common-issues)

---

## Automated Testing

### Running Accessibility Tests

The app includes comprehensive accessibility tests using React Native Testing Library's built-in accessibility matchers (v12.4+).

```bash
# Run all tests
npm test

# Run only accessibility tests
npm test -- accessibility.test.tsx

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

### Available Accessibility Matchers

React Native Testing Library (v12.4+) provides built-in matchers:

```javascript
// Query by role
screen.getByRole('button', { name: 'Submit' })
screen.getByRole('header', { name: 'Dashboard' })

// Query by accessibility label
screen.getByLabelText('Username input')

// Query by accessibility hint
screen.getByA11yHint('Enter your username to login')

// Get all elements with a specific role
screen.getAllByRole('button')
```

### Writing Accessibility Tests

See `app/__tests__/accessibility.test.tsx` for comprehensive examples. Key patterns:

```javascript
it('has accessible buttons', () => {
  render(<MyScreen />);
  
  // Find button by role and name
  const button = screen.getByRole('button', { name: 'Submit' });
  expect(button).toBeTruthy();
  
  // Verify it can be pressed
  fireEvent.press(button);
});

it('has proper form labels', () => {
  render(<MyScreen />);
  
  // Find input by its label
  const input = screen.getByLabelText('Username');
  expect(input).toBeTruthy();
});
```

---

## Manual Testing

Manual testing with screen readers is essential to ensure a good user experience. This section covers both Android (TalkBack) and iOS (VoiceOver).

---

## Testing with TalkBack

TalkBack is Android's built-in screen reader. It provides spoken feedback so users can use their device without looking at the screen.

### Setting Up TalkBack

#### On a Physical Android Device:

1. **Enable TalkBack:**
   - Go to **Settings** → **Accessibility** → **TalkBack**
   - Toggle **Use TalkBack** to ON
   - Confirm by tapping **OK** twice

2. **Quick Toggle (Recommended):**
   - Press and hold both **Volume Up** and **Volume Down** buttons for 3 seconds
   - This enables/disables TalkBack quickly during testing

#### On Android Emulator:

1. Open the Android emulator from Android Studio
2. Go to **Settings** → **Accessibility** → **TalkBack**
3. Toggle **Use TalkBack** to ON

### TalkBack Navigation Gestures

When TalkBack is enabled, navigation works differently:

| Gesture | Action |
|---------|--------|
| **Single tap** | Select an item (TalkBack reads it) |
| **Double tap** | Activate the selected item |
| **Swipe right** | Move to next item |
| **Swipe left** | Move to previous item |
| **Swipe down then right** | Navigate to next item (reading order) |
| **Swipe down then left** | Navigate to previous item |
| **Two-finger swipe down** | Scroll down |
| **Two-finger swipe up** | Scroll up |
| **Swipe right then left (L shape)** | Open TalkBack menu |

### Running the App with TalkBack

1. **Start the app:**
   ```bash
   cd React-native-app
   npx expo start
   # Press 'a' for Android
   ```

2. **Enable TalkBack** on your device/emulator

3. **Test Navigation:**
   - Swipe right through all elements on the screen
   - Verify TalkBack announces each element clearly
   - Check that the reading order makes sense

### What to Test with TalkBack

#### 1. Element Announcements
- [x] All interactive elements (buttons, links) are announced
- [x] Labels clearly describe the element's purpose
- [x] Hints provide additional context when needed

**Example:**
- **Expected:** "Tasks & Scheduling, button. Navigate to Tasks & Scheduling section."
- **Not:** "Button." (missing label)

#### 2. Navigation Cards (Dashboard)
Test each card:
```
✓ Tasks & Scheduling card
✓ Notes & Health Logs card
✓ Communication & Safety card
✓ Notifications & Reminders card
✓ Patient Information card
✓ Profile & Settings card
```

For each card:
- [ ] TalkBack announces the card title
- [ ] TalkBack announces it's a button
- [ ] TalkBack provides a hint about the action
- [ ] Double-tap activates and navigates to the correct screen

#### 3. Form Inputs
Test login screen and other forms:
- [ ] Each input field is announced with its label
- [ ] TalkBack provides hints about expected input
- [ ] Error messages are announced immediately
- [ ] Success messages are announced

#### 4. State Changes
- [ ] Toggle switches announce their current state (on/off)
- [ ] Checkboxes announce if checked or unchecked
- [ ] Expanding/collapsing sections announce their state

#### 5. Modal Dialogs
- [ ] When a modal opens, TalkBack announces it
- [ ] Focus moves to the modal content
- [ ] Close button is clearly labeled
- [ ] After closing, focus returns appropriately

### TalkBack Testing Checklist

```markdown
## Dashboard Screen
- [ ] App title "CareConnect" is announced
- [ ] Welcome message is readable
- [ ] All 6 navigation cards are accessible
- [ ] Badge counts (notifications) are announced
- [ ] Logoff button is clearly labeled
- [ ] All buttons activate on double-tap

## Login Screen
- [ ] Username input has clear label
- [ ] PIN input fields are labeled
- [ ] "Forgot username?" link is announced as link
- [ ] "Forgot PIN?" link is announced as link
- [ ] Login button is clearly labeled
- [ ] Error messages are announced

## Settings Screens
- [ ] Switch toggles announce their state
- [ ] Current settings values are announced
- [ ] Save/cancel buttons are clear

## Lists and Scrollable Content
- [ ] List items are in logical order
- [ ] Scrolling works with two-finger gestures
- [ ] Long lists are navigable
```

### Common TalkBack Issues

**Issue:** TalkBack doesn't announce a button
- **Solution:** Add `accessibilityRole="button"` and `accessibilityLabel`

**Issue:** TalkBack announces "Button" with no description
- **Solution:** Add descriptive `accessibilityLabel`

**Issue:** TalkBack announces too much text at once
- **Solution:** Break up content or use `accessible={false}` on container

**Issue:** Buttons don't activate on double-tap
- **Solution:** Ensure proper `onPress` handler is attached

---

## Testing with VoiceOver

VoiceOver is Apple's screen reader for iOS devices. It's essential for accessibility on iPhone and iPad.

### Setting Up VoiceOver

#### On a Physical iOS Device:

1. **Enable VoiceOver:**
   - Go to **Settings** → **Accessibility** → **VoiceOver**
   - Toggle **VoiceOver** to ON
   - Or ask Siri: "Hey Siri, turn on VoiceOver"

2. **Quick Toggle (Recommended):**
   - Enable **Accessibility Shortcut**:
     - Go to **Settings** → **Accessibility** → **Accessibility Shortcut**
     - Select **VoiceOver**
   - Now triple-click the **Side/Home button** to toggle VoiceOver

#### On iOS Simulator:

1. Open the iOS Simulator from Xcode
2. Go to **Settings** → **Accessibility** → **VoiceOver**
3. Toggle **VoiceOver** to ON
4. Or use keyboard shortcut: **Cmd + F5** (macOS)

### VoiceOver Navigation Gestures

When VoiceOver is enabled:

| Gesture | Action |
|---------|--------|
| **Single tap** | Select an item (VoiceOver reads it) |
| **Double tap** | Activate the selected item |
| **Swipe right** | Move to next item |
| **Swipe left** | Move to previous item |
| **Three-finger swipe up/down** | Scroll |
| **Two-finger double tap** | "Magic tap" (context-dependent action) |
| **Rotor gesture (two fingers, rotate)** | Open rotor menu |
| **Two-finger Z-shape** | Back gesture |

### VoiceOver Rotor

The Rotor is a powerful VoiceOver feature for quick navigation:

1. **Activate Rotor:** Rotate two fingers on screen (like turning a dial)
2. **Select navigation mode:** Swipe up/down to choose:
   - Headings
   - Links
   - Form Controls
   - Buttons
   - Images
3. **Navigate by type:** Swipe up/down to jump between items of that type

### Running the App with VoiceOver

1. **Start the app:**
   ```bash
   cd React-native-app
   npx expo start
   # Press 'i' for iOS
   ```

2. **Enable VoiceOver** on your device/simulator (Cmd+F5 on simulator)

3. **Test Navigation:**
   - Swipe right through all elements
   - Verify VoiceOver announces each element clearly
   - Check reading order is logical

### What to Test with VoiceOver

#### 1. Element Announcements
- [x] All interactive elements are announced
- [x] Element type is clear (button, link, header, etc.)
- [x] Labels are descriptive and concise

**Example:**
- **Expected:** "Tasks & Scheduling. Navigate to Tasks & Scheduling section. Button."
- **Not:** "Button." (missing label and hint)

#### 2. Heading Navigation
VoiceOver users often navigate by headings:
- [ ] Use Rotor to select "Headings" mode
- [ ] Verify all section headings are found
- [ ] Check heading hierarchy is logical

#### 3. Button Navigation
- [ ] Use Rotor to select "Buttons" mode
- [ ] Swipe up/down to jump between buttons
- [ ] Verify all buttons are found and labeled

#### 4. Form Navigation
- [ ] Use Rotor to select "Form Controls"
- [ ] Jump between form inputs
- [ ] Verify labels and hints are clear

#### 5. State Communication
- [ ] Switches announce "on" or "off"
- [ ] Checkboxes announce "checked" or "unchecked"
- [ ] Expandable sections announce "collapsed" or "expanded"

### VoiceOver Testing Checklist

```markdown
## Dashboard Screen
- [ ] "CareConnect" is announced as a header
- [ ] Welcome message is readable
- [ ] Navigate through all 6 cards with swipe gestures
- [ ] Each card announces as a button with clear purpose
- [ ] Badge numbers are announced (e.g., "3 unread messages")
- [ ] Double-tap activates navigation

## Login Screen
- [ ] Form controls are in logical order
- [ ] Username field has clear label
- [ ] PIN input method is accessible
- [ ] Links announce as "link"
- [ ] Error messages interrupt and are announced
- [ ] Login button is clearly labeled

## Rotor Navigation
- [ ] Headings: All section headers are findable
- [ ] Buttons: All interactive buttons are findable
- [ ] Links: All links are announced correctly
- [ ] Form Controls: All inputs are accessible

## Notifications and Alerts
- [ ] Notification badges are announced
- [ ] Alert dialogs announce their content
- [ ] Success/error toasts are announced
```

### Common VoiceOver Issues

**Issue:** VoiceOver doesn't recognize element
- **Solution:** Ensure `accessible={true}` and proper `accessibilityRole`

**Issue:** VoiceOver announces generic "button" label
- **Solution:** Add descriptive `accessibilityLabel`

**Issue:** Text children of buttons are announced separately
- **Solution:** Add `accessible={false}` to text inside buttons

**Issue:** VoiceOver skips important information
- **Solution:** Ensure elements aren't marked `accessible={false}` inappropriately

---

## Accessibility Checklist

Use this checklist for every screen:

### Visual Structure
- [ ] Adequate color contrast (4.5:1 for text, 3:1 for large text)
- [ ] High contrast mode supported
- [ ] Text is resizable
- [ ] Touch targets are at least 44x44 points

### Semantic HTML/Markup
- [ ] Headers use `accessibilityRole="header"`
- [ ] Buttons use `accessibilityRole="button"`
- [ ] Links use `accessibilityRole="link"`
- [ ] Form inputs have labels
- [ ] Images have alt text (if meaningful)

### Keyboard/Screen Reader Navigation
- [ ] All interactive elements are focusable
- [ ] Focus order is logical (top to bottom, left to right)
- [ ] No keyboard traps
- [ ] Skip navigation available (if needed)

### Interactive Elements
- [ ] All buttons have clear labels
- [ ] Links describe their destination
- [ ] Form inputs have labels and hints
- [ ] Error messages are clear and specific

### State Management
- [ ] Current state is announced (checked, selected, expanded)
- [ ] State changes are announced
- [ ] Loading states are communicated

### Testing
- [ ] Automated tests pass
- [ ] TalkBack testing completed
- [ ] VoiceOver testing completed
- [ ] Manual keyboard navigation tested

---

## Common Issues and Solutions

### Issue: "Button" announced with no label

**Problem:**
```tsx
<Pressable onPress={handlePress}>
  <Text>Click me</Text>
</Pressable>
```

**Solution:**
```tsx
<Pressable
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Click me"
  onPress={handlePress}
>
  <Text accessible={false}>Click me</Text>
</Pressable>
```

### Issue: Container text announced redundantly

**Problem:** Both the container and children are announced separately.

**Solution:**
```tsx
<View accessible={false}>
  <Text accessible={false}>Some text</Text>
</View>
```

### Issue: State changes not announced

**Problem:** Toggle switch changes state silently.

**Solution:**
```tsx
<Switch
  accessible={true}
  accessibilityRole="switch"
  accessibilityLabel="Enable notifications"
  accessibilityState={{ checked: isEnabled }}
  value={isEnabled}
  onValueChange={setEnabled}
/>
```

### Issue: Form inputs have no labels

**Problem:**
```tsx
<TextInput placeholder="Enter text" />
```

**Solution:**
```tsx
<TextInput
  accessible={true}
  accessibilityLabel="Username"
  accessibilityHint="Enter your username to login"
  placeholder="Enter text"
/>
```

### Issue: Modal doesn't trap focus

**Problem:** Screen reader continues reading background content.

**Solution:**
```tsx
<Modal
  visible={isVisible}
  accessible={true}
  accessibilityLabel="Edit task dialog"
  accessibilityViewIsModal={true}
  onRequestClose={handleClose}
>
  {/* Modal content */}
</Modal>
```

---

## Resources

### Official Documentation
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Testing Tools
- [React Native Testing Library Cheatsheet](https://callstack.github.io/react-native-testing-library/docs/api-queries)
- [Android TalkBack Guide](https://support.google.com/accessibility/android/answer/6283677)
- [iOS VoiceOver Guide](https://support.apple.com/guide/iphone/turn-on-and-practice-voiceover-iph3e2e415f/ios)

### Training Resources
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [Deque University](https://dequeuniversity.com/)
- [A11y Project](https://www.a11yproject.com/)

---

## Need Help?

If you encounter accessibility issues:

1. Check the automated tests first: `npm test -- accessibility.test.tsx`
2. Review the `ACCESSIBILITY_SUMMARY.md` for implementation details
3. Test manually with both TalkBack and VoiceOver
4. Refer to existing accessible screens as examples

For questions or concerns, contact the development team.
