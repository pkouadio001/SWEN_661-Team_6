import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect/models/user_profile.dart';

void main() {
  group('UserProfile', () {
    test('creates instance with required fields', () {
      const profile = UserProfile(
        fullName: 'John Doe',
        email: 'john@example.com',
        username: 'johndoe',
        role: 'Patient',
      );

      expect(profile.fullName, 'John Doe');
      expect(profile.email, 'john@example.com');
      expect(profile.username, 'johndoe');
      expect(profile.role, 'Patient');
    });

    test('copyWith creates new instance with updated fields', () {
      const original = UserProfile(
        fullName: 'John Doe',
        email: 'john@example.com',
        username: 'johndoe',
        role: 'Patient',
      );

      final updated = original.copyWith(
        fullName: 'Jane Doe',
        email: 'jane@example.com',
      );

      expect(updated.fullName, 'Jane Doe');
      expect(updated.email, 'jane@example.com');
      expect(updated.username, 'johndoe'); // unchanged
      expect(updated.role, 'Patient'); // unchanged
    });

    test('copyWith with no parameters returns copy with same values', () {
      const original = UserProfile(
        fullName: 'John Doe',
        email: 'john@example.com',
        username: 'johndoe',
        role: 'Patient',
      );

      final copy = original.copyWith();

      expect(copy.fullName, original.fullName);
      expect(copy.email, original.email);
      expect(copy.username, original.username);
      expect(copy.role, original.role);
    });

    test('demo constant has expected values', () {
      expect(UserProfile.demo.fullName, 'John Doe');
      expect(UserProfile.demo.email, 'Jdoe@hotmail.com');
      expect(UserProfile.demo.username, 'Jdoe');
      expect(UserProfile.demo.role, 'Care Recipient');
    });
  });
}
