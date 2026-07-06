import 'package:equatable/equatable.dart';

class Barbershop extends Equatable {
  final String id;
  final String name;
  final String slug;
  final String? description;
  final String address;
  final String city;
  final String phone;
  final String? email;
  final String? logoUrl;
  final String? coverImageUrl;
  final bool isActive;

  const Barbershop({
    required this.id,
    required this.name,
    required this.slug,
    this.description,
    required this.address,
    required this.city,
    required this.phone,
    this.email,
    this.logoUrl,
    this.coverImageUrl,
    this.isActive = true,
  });

  factory Barbershop.fromJson(Map<String, dynamic> json) {
    return Barbershop(
      id: json['id'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String,
      description: json['description'] as String?,
      address: json['address'] as String,
      city: json['city'] as String,
      phone: json['phone'] as String,
      email: json['email'] as String?,
      logoUrl: json['logoUrl'] as String?,
      coverImageUrl: json['coverImageUrl'] as String?,
      isActive: json['isActive'] as bool? ?? true,
    );
  }

  @override
  List<Object?> get props => [id, name, slug];
}
