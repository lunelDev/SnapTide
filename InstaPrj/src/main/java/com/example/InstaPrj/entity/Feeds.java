package com.example.InstaPrj.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Feeds extends BasicEntity{
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long fno;
  private String title;
  private String content;

  public void changeTitle(String title) {
    this.title = title;
  }
  public void changeContent(String content) {this.content = content;}

}