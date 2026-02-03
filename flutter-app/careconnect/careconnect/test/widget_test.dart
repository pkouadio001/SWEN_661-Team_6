// Widget tests for CareConnect app

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect/main.dart';

void main() {
  testWidgets('CareConnect app smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const CareConnectApp());

    // Verify that the app loads without crashing
    expect(find.byType(MaterialApp), findsOneWidget);
  });

  testWidgets('App displays CareConnect title', (WidgetTester tester) async {
    // Build the app
    await tester.pumpWidget(const CareConnectApp());
    await tester.pumpAndSettle();

    // Verify app title is present in AppBar
    expect(find.text('CareConnect'), findsOneWidget);
  });
}
