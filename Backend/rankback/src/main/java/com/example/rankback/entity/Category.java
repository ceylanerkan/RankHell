package com.example.rankback.entity;

import org.hibernate.validator.constraints.URL;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


@Entity
@Getter
@Setter
@Table(name = "Categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer categoryId;

    @NotBlank(message = "Category name cannot be empty")
    @Size(min = 2, max = 100, message = "Category name must be between 2 and 100 characters")
    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @URL(message = "Geçerli bir resim URL'si girilmelidir.") // Sadece geçerli URL formatını kabul eder
    @Column(name = "image_url", length = 1000   ) // Veritabanında VARCHAR(255) olarak oluşturur
    private String imageUrl;

}
