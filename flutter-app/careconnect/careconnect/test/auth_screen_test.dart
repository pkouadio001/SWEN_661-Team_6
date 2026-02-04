import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect/screens/auth/auth_screen.dart';

void main() {
  testWidgets('Login screen renders correctly', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: AuthScreen()));
    await tester.pumpAndSettle();

    expect(find.text('CareConnect'), findsOneWidget);

    // Login header
    expect(find.text('Welcome Back'), findsOneWidget);
    expect(
      find.text('Enter your credentials to access your account'),
      findsOneWidget,
    );

    // Username
    expect(find.text('Username'), findsOneWidget);
    expect(find.byType(TextField), findsWidgets);

    // PIN
    expect(find.text('PIN Number'), findsOneWidget);
    expect(find.text('Enter your 6-digit PIN'), findsOneWidget);

    // ✅ specifically the Login button (not the tab label)
    expect(find.widgetWithText(ElevatedButton, 'Login'), findsOneWidget);

    // Links
    expect(find.text('Forgot username?'), findsOneWidget);
    expect(find.text('Forgot your PIN?'), findsOneWidget);
  });
}
