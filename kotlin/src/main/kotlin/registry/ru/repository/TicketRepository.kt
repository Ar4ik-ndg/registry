package registry.ru.repository

import registry.ru.model.Ticket
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface TicketRepository: JpaRepository<Ticket, String> {
    fun findByDateBetweenAndDoctor(start: LocalDateTime, end: LocalDateTime, doctor: String): List<Ticket>
    fun findByDateBeforeAndStatus(date: LocalDateTime, status: String): List<Ticket>
    fun findByUserId(userId: String): List<Ticket>
    fun findByStatus(status: String): List<Ticket>
    fun findByDoctor(doctor: String): List<Ticket>
    @Query("SELECT t.date FROM Ticket t WHERE t.date BETWEEN :start AND :end AND t.status NOT IN (:status)")
    fun findByDateBetween(start: LocalDateTime, end: LocalDateTime, status: List<String>): List<LocalDateTime>?
}