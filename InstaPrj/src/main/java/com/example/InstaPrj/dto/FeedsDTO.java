package com.example.InstaPrj.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FeedsDTO {
  private Long fno; //pst 번호
  private String title; //게시글 내용
  private String content; //게시글 내용
  @Builder.Default
  private List<PhotosDTO> photosDTOList = new ArrayList<>();
  private Long reviewsCnt;
  private LocalDateTime regDate;
  private LocalDateTime modDate;
}
