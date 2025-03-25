package com.example.kotlin

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.PropertySource

@SpringBootApplication
@PropertySource("application.yml")
class KotlinApplication

fun main(args: Array<String>) {
	runApplication<KotlinApplication>(*args)
}

