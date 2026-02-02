import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_profile.dart';

final profileProvider = StateProvider<UserProfile>((_) => UserProfile.demo);
