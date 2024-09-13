package com.example.InstaPrj.config;
import com.example.InstaPrj.security.handler.CustomAccessDeniedHandler;
import com.example.InstaPrj.security.handler.CustomAuthenticationFailureHandler;
import com.example.InstaPrj.security.handler.CustomLoginSuccessHandler;
import com.example.InstaPrj.security.handler.CustomLogoutSuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.FormLoginConfigurer;
import org.springframework.security.config.annotation.web.configurers.LogoutConfigurer;
import org.springframework.security.config.annotation.web.configurers.RememberMeConfigurer;
import org.springframework.security.config.annotation.web.configurers.oauth2.client.OAuth2LoginConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.access.expression.WebExpressionAuthorizationManager;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

  private static final String[] AUTH_WHITElIST = {
      "/"
  };

  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  /* SecurityFilterChain Bean 역할 :
  세션 인증 기반 방식으로 대부분의 Spring Security에 대한 설정으로 다룰 수 있다. */
  @Bean
  protected SecurityFilterChain config(HttpSecurity httpSecurity)
      throws Exception {
    // csrf 사용안하는 설정
    httpSecurity.csrf(httpSecurityCsrfConfigurer -> {
      httpSecurityCsrfConfigurer.disable();
    });

    // authorizeHttpRequests :: 선별적으로 접속을 제한하는 메서드
    // 모든 페이지가 인증을 받도록 되어 있는 상태
    // httpSecurity.authorizeHttpRequests(auth -> auth.anyRequest().authenticated());
    httpSecurity.authorizeHttpRequests(
        auth -> auth
            .requestMatchers(AUTH_WHITElIST).permitAll()
            .requestMatchers("/feeds/list").permitAll()
            .requestMatchers(new AntPathRequestMatcher("/auth/**")).permitAll()
            .requestMatchers(new AntPathRequestMatcher("/error/**")).permitAll()
            .requestMatchers("/feeds/list/**").hasRole("ADMIN")
            .requestMatchers("/feeds/list/**").access(
                new WebExpressionAuthorizationManager(
                    "hasRole('ADMIN') or hasRole('MANAGER')")
            )
            .anyRequest().authenticated());

    // formLogin()를 정의해야만 해도 자동생성된 로그인페이지로 이동가능.
    httpSecurity.formLogin(new Customizer<FormLoginConfigurer<HttpSecurity>>() {
      @Override
      public void customize(FormLoginConfigurer<HttpSecurity> httpSecurityFormLoginConfigurer) {
        httpSecurityFormLoginConfigurer
//            .loginPage("/sample/login")
//            .loginProcessingUrl("/sample/login")
//            .defaultSuccessUrl("/")
            .successHandler(getAuthenticationSuccessHandler())
            .failureHandler(getAuthenticationFailureHandler());
      }
    });
    // logout() 정의 안해도 로그아웃 페이지 사용 가능. 사용자 로그아웃 페이지 지정할 때사용
    httpSecurity.logout(new Customizer<LogoutConfigurer<HttpSecurity>>() {
      @Override
      public void customize(LogoutConfigurer<HttpSecurity> httpSecurityLogoutConfigurer) {
        httpSecurityLogoutConfigurer
            // logoutUrl() 설정할 경우 html action 주소 또한 같이 적용해야 함.
            // logoutUrl()으로 인해 기존 logout 주소 이동은 가능하나 기능은 사용 안됨.
            .logoutUrl("/logout")
            .logoutSuccessUrl("/") // 로그아웃 후에 돌아갈 페이지 설정
            .logoutSuccessHandler(getLogoutSuccessHandler())
            .invalidateHttpSession(true); // 서버 세션을 무효화, false도 클라이언트측 무효화
      }
    });
    httpSecurity.oauth2Login(new Customizer<OAuth2LoginConfigurer<HttpSecurity>>() {
      @Override
      public void customize(OAuth2LoginConfigurer<HttpSecurity> httpSecurityOAuth2LoginConfigurer) {
        httpSecurityOAuth2LoginConfigurer.successHandler(
            getAuthenticationSuccessHandler()
        );
      }
    });
    httpSecurity.exceptionHandling(httpSecurityExceptionHandlingConfigurer -> {
      httpSecurityExceptionHandlingConfigurer.accessDeniedHandler(
          getAccessDeniedHandler());
    });
    httpSecurity.rememberMe(new Customizer<RememberMeConfigurer<HttpSecurity>>() {
      @Override
      public void customize(RememberMeConfigurer<HttpSecurity> httpSecurityRememberMeConfigurer) {
        // database 아이디를 통하여 로그인하는 경우 사용, 소셜로그인은 사용 불가
        httpSecurityRememberMeConfigurer.tokenValiditySeconds(60 * 60 * 24 * 7);
        // 익명객체를 활용하여 rememberMe 사용할 때
        /*httpSecurityRememberMeConfigurer.rememberMeServices(new RememberMeServices() {
          @Override
          public Authentication autoLogin(HttpServletRequest request, HttpServletResponse response) {
            return null;
          }

          @Override
          public void loginFail(HttpServletRequest request, HttpServletResponse response) {

          }

          @Override
          public void loginSuccess(HttpServletRequest request, HttpServletResponse response, Authentication successfulAuthentication) {

          }
        });*/
      }
    });

    return httpSecurity.build();
  }
  // AuthenticationSuccessHandler는 로그인되었을 때 처리하는 객체
  @Bean
  public AuthenticationSuccessHandler getAuthenticationSuccessHandler() {
    return new CustomLoginSuccessHandler();
  }

  @Bean
  public AccessDeniedHandler getAccessDeniedHandler() {
    return new CustomAccessDeniedHandler();
  }

  @Bean
  public AuthenticationFailureHandler getAuthenticationFailureHandler() {
    return new CustomAuthenticationFailureHandler();
  }

  @Bean
  public LogoutSuccessHandler getLogoutSuccessHandler() {
    return new CustomLogoutSuccessHandler();
  }

  // InMemory 방식으로 UserDetailsService(인증 관리 객체) 사용
  /*@Bean
  public UserDetailsService userDetailsService() {
    UserDetails user1 = User.builder()
        .username("user1")
        .password("$2a$10$XGw3jOo9mQSoij4/so.6H.BtSRWpgPze6ZWMuc7ntyFFWqVNbcmBe")
        .roles("USER")
        .build();
    UserDetails manager = User.builder()
        .username("manager")
        .password("$2a$10$AEHcuzENZx7OLeA.s8e.t.CvhE/a/GZf.ZKTPEBIKLv8g03zChnD2")
        .roles("MANAGER")
        .build();
    UserDetails admin = User.builder()
        .username("admin")
        .password(passwordEncoder().encode("1"))
        .roles("ADMIN", "MANAGER")
        .build();
    List<UserDetails> list = new ArrayList<>();
    list.add(user1);
    list.add(manager);
    list.add(admin);
    return new InMemoryUserDetailsManager(list);

  }*/

}