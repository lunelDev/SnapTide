package com.example.InstaPrj.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MembersDTO {
  private Long mid;
  private String pw;
  private String nickname;
  private String name;
  private String email;
  private  boolean fromSocial;
  private LocalDateTime regDate;
  private LocalDateTime modDate;

  @Builder.Default
  private Set<String> roleSet = new HashSet<>();
}
