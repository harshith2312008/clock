import 'dart:convert';

class Alarm {
  final String id;
  final String time; // Format: "HH:mm"
  final String label;
  final bool isActive;
  final List<int> days; // 0=Sunday, 6=Saturday

  Alarm({
    required this.id,
    required this.time,
    this.label = 'Alarm',
    this.isActive = true,
    this.days = const [],
  });

  Alarm copyWith({
    String? id,
    String? time,
    String? label,
    bool? isActive,
    List<int>? days,
  }) {
    return Alarm(
      id: id ?? this.id,
      time: time ?? this.time,
      label: label ?? this.label,
      isActive: isActive ?? this.isActive,
      days: days ?? this.days,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'time': time,
      'label': label,
      'isActive': isActive,
      'days': days,
    };
  }

  factory Alarm.fromMap(Map<String, dynamic> map) {
    return Alarm(
      id: map['id'],
      time: map['time'],
      label: map['label'] ?? '',
      isActive: map['isActive'] ?? false,
      days: List<int>.from(map['days'] ?? []),
    );
  }

  String toJson() => json.encode(toMap());

  factory Alarm.fromJson(String source) => Alarm.fromMap(json.decode(source));
}
