package com.example.InstaPrj.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewsDTO {
  private Long reviewsnum;
  private Long fno; // Movie
  private Long mid; // Member
  private String nickname;
  private String email;
  private String text;
  private LocalDateTime regDate, modDate;
}
