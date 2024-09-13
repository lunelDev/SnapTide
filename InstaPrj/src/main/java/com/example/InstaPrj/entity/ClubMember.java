package com.example.InstaPrj.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public class ClubMember extends BasicEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long cno;

  @Column(nullable = false, unique = true)
  private String email;

  private String password;

  private String name;

  private boolean fromSocial;

  @ElementCollection(fetch = FetchType.LAZY)
  @Builder.Default
  private Set<ClubMemberRole> roleSet = new HashSet<>();

  public void addMemberRole(ClubMemberRole clubMemberRole) {
    roleSet.add(clubMemberRole);
  }
}