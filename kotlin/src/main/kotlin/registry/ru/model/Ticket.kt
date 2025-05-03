package registry.ru.model

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "tickets")
data class Ticket(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    val id: String,

    @JsonFormat(pattern = "dd.MM.yyyy HH:mm")
    @Column(name = "date", nullable = false)
    val date: LocalDateTime,

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    val description: String,

    @Column(name = "results", columnDefinition = "TEXT")
    val results: String?,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor", nullable = false)
    @JsonIgnoreProperties(value = ["hibernateLazyInitializer","handler","role"])
    val doctor: Staff,

    @Column(name = "status", nullable = false, columnDefinition = "TEXT")
    val status: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties(value = ["hibernateLazyInitializer","handler","role"])
    val user: User
)
