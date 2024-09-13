package com.example.InstaPrj.controller;

import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Log4j2
@Controller
@PreAuthorize("permitAll()")
@RequestMapping("/auth")
public class AuthController {
  @GetMapping("/accessDenied")
  public void accessDenied() {

  }

  @GetMapping("/authenticationFailure")
  public void accessDeniedFailure() {

  }
}
