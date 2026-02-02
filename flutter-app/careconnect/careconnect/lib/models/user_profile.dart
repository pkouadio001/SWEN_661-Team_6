class UserProfile {
  final String fullName;
  final String email;
  final String username;
  final String role;

  const UserProfile({
    required this.fullName,
    required this.email,
    required this.username,
    required this.role,
  });

  UserProfile copyWith({
    String? fullName,
    String? email,
    String? username,
    String? role,
  }) {
    return UserProfile(
      fullName: fullName ?? this.fullName,
      email: email ?? this.email,
      username: username ?? this.username,
      role: role ?? this.role,
    );
  }

  static const demo = UserProfile(
    fullName: 'John Doe',
    email: 'Jdoe@hotmail.com',
    username: 'Jdoe',
    role: 'Care Recipient',
  );
}
