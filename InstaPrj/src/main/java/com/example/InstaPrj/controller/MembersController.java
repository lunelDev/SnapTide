package com.example.InstaPrj.controller;

import com.example.InstaPrj.service.MembersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Log4j2
@RequestMapping("/members")
@RequiredArgsConstructor
public class MembersController {
  private final MembersService membersService;

  @GetMapping("/login")
  public void login() {  }

  @GetMapping("/join")
  public void join() {  }

  @PostMapping("/join")
  public void joinPost() {

  }

}
