import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect/screens/auth/auth_screen.dart';

void main() {
  testWidgets('Register screen renders correctly', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: AuthScreen()));
    await tester.pumpAndSettle();

    // Switch to Register tab
    await tester.tap(find.text('Register'));
    await tester.pumpAndSettle();

    // "Create Account" appears twice (header + button), so expect 2
    expect(find.text('Create Account'), findsNWidgets(2));
    expect(find.text('Join CareConnect today'), findsOneWidget);

    // Form labels
    expect(find.text('Full Name'), findsOneWidget);
    expect(find.text('Email'), findsOneWidget);
    expect(find.text('Username'), findsOneWidget);
    expect(find.text('Role'), findsOneWidget);

    // Role cards
    expect(find.text('Caregiver'), findsOneWidget);
    expect(find.text('Care Recipient'), findsOneWidget);

    // PIN sections
    expect(find.text('Create PIN Number'), findsOneWidget);
    expect(find.text('Confirm PIN Number'), findsOneWidget);
    expect(find.text('Create a 6-digit PIN'), findsOneWidget);
    expect(find.text('Re-enter your 6-digit PIN'), findsOneWidget);

    // Footer disclaimer
    expect(find.textContaining('By registering, you agree'), findsOneWidget);
  });
}
