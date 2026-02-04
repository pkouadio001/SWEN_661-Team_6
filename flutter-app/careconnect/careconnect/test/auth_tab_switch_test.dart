import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect/screens/auth/auth_screen.dart';

void main() {
  testWidgets('Auth tabs switch between Login and Register', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const MaterialApp(home: AuthScreen()));
    await tester.pumpAndSettle();

    // Default should be Login
    expect(find.text('Welcome Back'), findsOneWidget);
    expect(find.text('Join CareConnect today'), findsNothing);

    // Tap Register
    await tester.tap(find.text('Register'));
    await tester.pumpAndSettle();

    // Register should show its unique subtitle
    expect(find.text('Join CareConnect today'), findsOneWidget);
    expect(find.text('Welcome Back'), findsNothing);

    // Tap Login
    await tester.tap(find.text('Login'));
    await tester.pumpAndSettle();

    // Back to Login
    expect(find.text('Welcome Back'), findsOneWidget);
    expect(find.text('Join CareConnect today'), findsNothing);
  });
}
