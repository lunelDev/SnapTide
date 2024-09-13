package com.example.InstaPrj.security.service;

import com.example.InstaPrj.entity.ClubMember;
import com.example.InstaPrj.repository.ClubMemberRepository;
import com.example.InstaPrj.security.dto.ClubMemberAuthDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor //DB접근방식으로 UserDetailsService(인증 관리 객체) 사용
public class ClubUserDetailsService implements UserDetailsService {
  private final ClubMemberRepository clubMemberRepository;

  @Override
  // DB에 있는 것 확인 된후,User를 상속받은 ClubMemberAuthDTO에 로그인정보를 담음=>세션
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    log.info("ClubMemberUser.........", username);
    Optional<ClubMember> result = clubMemberRepository.findByEmail(username);
    if (!result.isPresent()) throw new UsernameNotFoundException("Check Email or Social");
    ClubMember clubMember = result.get(); // DB로부터 검색한 엔티티
    // 엔티티를 세션으로 담기위해 만든 ClubMemberAuthDTO
    ClubMemberAuthDTO clubMemberAuthDTO = new ClubMemberAuthDTO(
        clubMember.getEmail(), clubMember.getPassword(), clubMember.getCno(),
        clubMember.isFromSocial(),
        clubMember.getRoleSet().stream().map(
            clubMemberRole -> new SimpleGrantedAuthority(
                "ROLE_" + clubMemberRole.name())).collect(Collectors.toList())
    );
    clubMemberAuthDTO.setName(clubMember.getName());
    clubMemberAuthDTO.setFromSocial(clubMember.isFromSocial());
    log.info("clubMemberAuthDTO >> ", clubMemberAuthDTO.getCno());
    return clubMemberAuthDTO;
  }
}
