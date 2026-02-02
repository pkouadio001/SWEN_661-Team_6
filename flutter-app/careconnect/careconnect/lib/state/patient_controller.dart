import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/patient.dart';

final patientProvider = StateProvider<PatientInfo>((_) => PatientInfo.demo);
