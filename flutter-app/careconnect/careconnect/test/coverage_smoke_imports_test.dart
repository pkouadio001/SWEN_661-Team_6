import 'package:flutter_test/flutter_test.dart';

// Import the files you want included in coverage:
import 'package:careconnect/state/tasks_controller.dart';
import 'package:careconnect/state/notes_controller.dart';
import 'package:careconnect/state/messages_controller.dart';
import 'package:careconnect/state/health_logs_controller.dart';
import 'package:careconnect/state/settings_controller.dart';

// Screens (optional but helpful)
import 'package:careconnect/screens/auth/auth_screen.dart';
import 'package:careconnect/screens/health/health_hub_screen.dart';
import 'package:careconnect/screens/communication/communication_safety_screen.dart';

void main() {
  test('Coverage smoke: imports load successfully', () {
    // This test exists to ensure files are loaded into the VM
    // so they appear in the coverage report.
    expect(tasksProvider, isNotNull);
    expect(notesProvider, isNotNull);
    expect(messageThreadsProvider, isNotNull);
    expect(healthLogsProvider, isNotNull);
    expect(settingsProvider, isNotNull);

    // Just referencing types ensures those units are loaded.
    expect(AuthScreen, isNotNull);
    expect(HealthHubScreen, isNotNull);
    expect(CommunicationSafetyScreen, isNotNull);
  });
}
