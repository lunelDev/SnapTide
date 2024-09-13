package com.example.InstaPrj;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaAuditing //BasicEntity를 사용하기 위함.
@EnableJpaRepositories(basePackages = "com.example.InstaPrj.repository")
public class InstaPrjApplication {

	public static void main(String[] args) {
		SpringApplication.run(InstaPrjApplication.class, args);
		System.out.println("http://localhost:8080/InstaPrj");
	}

}
