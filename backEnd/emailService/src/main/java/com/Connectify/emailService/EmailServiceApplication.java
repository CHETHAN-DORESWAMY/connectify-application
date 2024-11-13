package com.Connectify.emailService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class EmailServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(EmailServiceApplication.class, args);
	}

}