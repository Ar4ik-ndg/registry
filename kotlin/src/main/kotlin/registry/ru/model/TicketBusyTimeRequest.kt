package registry.ru.model

import com.fasterxml.jackson.annotation.JsonFormat
import java.time.LocalDate

data class TicketBusyTimeRequest(
    @JsonFormat(pattern = "dd.MM.yyyy")
    val date: LocalDate,
    val doctor: String
)
