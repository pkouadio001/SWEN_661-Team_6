import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

// Change this import to match where your BackPill file is located.
import 'package:careconnect/widgets/back_pill.dart';

void main() {
  testWidgets('BackPill renders icon and provided text', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: BackPill(text: 'Back to Dashboard', onTap: () {}),
        ),
      ),
    );

    expect(find.byIcon(Icons.arrow_back), findsOneWidget);
    expect(find.text('Back to Dashboard'), findsOneWidget);
  });

  testWidgets('BackPill has Semantics(button:true, label:text)', (
    tester,
  ) async {
    final handle = tester.ensureSemantics();
    try {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BackPill(text: 'Back to Dashboard', onTap: () {}),
          ),
        ),
      );

      final semanticsFinder = find.byWidgetPredicate((w) {
        if (w is! Semantics) return false;
        final props = w.properties;
        return props.button == true && props.label == 'Back to Dashboard';
      });

      expect(semanticsFinder, findsOneWidget);
    } finally {
      handle.dispose(); // ✅ always disposed
    }
  });

  testWidgets('BackPill calls onTap when tapped', (tester) async {
    var tapped = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: BackPill(text: 'Back to Dashboard', onTap: () => tapped = true),
        ),
      ),
    );

    // Tap the InkWell to ensure gesture actually triggers
    await tester.tap(find.byType(InkWell));
    await tester.pump();

    expect(tapped, isTrue);
  });
}
