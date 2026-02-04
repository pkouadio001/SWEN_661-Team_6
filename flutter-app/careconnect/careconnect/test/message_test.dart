import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect/models/message.dart';

void main() {
  group('MessageThread', () {
    test('creates instance with required fields', () {
      const message = MessageThread(
        id: 'm1',
        sender: 'John Doe',
        preview: 'Hello, how are you?',
        timeLabel: '2h ago',
      );

      expect(message.id, 'm1');
      expect(message.sender, 'John Doe');
      expect(message.preview, 'Hello, how are you?');
      expect(message.timeLabel, '2h ago');
    });

    test('creates message with long preview text', () {
      const message = MessageThread(
        id: 'm2',
        sender: 'Jane Smith',
        preview: 'This is a very long message preview that might get truncated in the UI',
        timeLabel: 'Just now',
      );

      expect(message.preview.length, greaterThan(50));
      expect(message.sender, 'Jane Smith');
    });

    test('creates message with various time labels', () {
      const message1 = MessageThread(
        id: 'm1',
        sender: 'User 1',
        preview: 'Message 1',
        timeLabel: 'Just now',
      );

      const message2 = MessageThread(
        id: 'm2',
        sender: 'User 2',
        preview: 'Message 2',
        timeLabel: '5m ago',
      );

      const message3 = MessageThread(
        id: 'm3',
        sender: 'User 3',
        preview: 'Message 3',
        timeLabel: 'Yesterday',
      );

      expect(message1.timeLabel, 'Just now');
      expect(message2.timeLabel, '5m ago');
      expect(message3.timeLabel, 'Yesterday');
    });
  });
}
