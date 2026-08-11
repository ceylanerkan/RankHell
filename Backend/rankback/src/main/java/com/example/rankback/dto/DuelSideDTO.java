package com.example.rankback.dto;

/** Duellonun bir tarafi. Item'in tamami degil, karti cizmeye yeten kadari. */
public record DuelSideDTO(Integer itemId, String name, String imageUrl) {
}
