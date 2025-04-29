package registry.ru.repository

import registry.ru.model.Tiket
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface TiketRepository: JpaRepository<Tiket, String> {
    fun findByDateBetweenAndDoctor(start: LocalDateTime, end: LocalDateTime, doctor: String): List<Tiket>
    fun findByDateBeforeAndStatus(date: LocalDateTime, status: String): List<Tiket>
    fun findByUserId(userId: String): List<Tiket>
    fun findByStatus(status: String): List<Tiket>
    fun findByDoctor(doctor: String): List<Tiket>
    @Query("SELECT t.date FROM Tiket t WHERE t.date BETWEEN :start AND :end AND t.status NOT IN (:status)")
    fun findByDateBetween(start: LocalDateTime, end: LocalDateTime, status: List<String>): List<LocalDateTime>?
}