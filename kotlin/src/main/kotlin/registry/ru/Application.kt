package registry.ru

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.runApplication
import org.springframework.context.annotation.PropertySource
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@SpringBootApplication
@EnableJpaRepositories(basePackages = ["registry.ru.repository"])
@EntityScan(basePackages = ["registry.ru.model"])
@PropertySource("application.yml")
class KotlinApplication

	fun main(args: Array<String>) {
		runApplication<KotlinApplication>(*args)
	}

