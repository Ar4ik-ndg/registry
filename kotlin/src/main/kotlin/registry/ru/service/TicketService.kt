package registry.ru.service

import registry.ru.repository.TicketRepository
import registry.ru.model.*
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Service
class TicketService(private val ticketRepository: TicketRepository) {
    fun getAllTickets(): List<Ticket> = ticketRepository.findAll()
    fun getTicketsByDateAndDoctor(doctorId: String): ResponseEntity<Any> {
        try {
            val dateTime: LocalDateTime = LocalDate.now().atStartOfDay()
            val tickets: List<Ticket> = ticketRepository.findByDateBetweenAndDoctorId(dateTime, dateTime.plusDays(1), doctorId)
            if (tickets.isNotEmpty()) return ResponseEntity.ok().body(tickets)
            else return ResponseEntity.badRequest().body(Error("Нет задач на текущую дату"))
        } catch (e: Exception) {
            return ResponseEntity.badRequest().body(Error(e))
        }
    }
    fun getTicketsByUserId(id: String): ResponseEntity<Any> {
        try {
            val tickets: List<Ticket> = ticketRepository.findByUserId(id)
            if (tickets.isNotEmpty()) return ResponseEntity.ok().body(tickets)
            else return ResponseEntity.badRequest().body(Error("Приемов нет"))
        } catch (e: Exception) {
            return ResponseEntity.badRequest().body(Error(e))
        }
    }
    fun getTicketsByStatus(status: String): ResponseEntity<Any> {
        val parsedStatus = try {
            TicketStatus.valueOf(status.lowercase()).toString()
        } catch (e: Exception) {
            return ResponseEntity.badRequest().body("Неверно передан статус")
        }
        val tickets = ticketRepository.findByStatus(parsedStatus)
        if (tickets.isNotEmpty()) return ResponseEntity.ok().body(tickets)
        else return ResponseEntity.badRequest().body(Error("Нет осмотров со статусом $parsedStatus"))
    }
    fun getBusyTime(start: LocalDate, doctor: String): ResponseEntity<Any> {
        val result = mutableListOf<String>()
        val startDay = start.atStartOfDay()
        val endDay = start.plusDays(1).atStartOfDay()
        val busyTime: List<LocalDateTime>? = ticketRepository.findByDateBetweenAndStatusAndDoctor(startDay, endDay, listOf(TicketStatus.отменен.name, TicketStatus.завершен.name), doctor)
        val formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")
        busyTime?.forEach {
            result.add(formatter.format(it))
        }
        return ResponseEntity.ok().body(result)
    }
    fun createNewTicket(ticket: Ticket): Ticket = ticketRepository.save(ticket)
    fun updateTicket(id: String, ticket: TicketRequest, doctor: Staff, user: User): ResponseEntity<Any> {
        val existTicket: Ticket = ticketRepository.findById(id).orElse(null)
        val status = try {
                TicketStatus.valueOf((ticket.status?: existTicket.status).lowercase()).toString()
            } catch (e: Exception) {return ResponseEntity.badRequest().body(Error("Неверно указан статус"))}
        ticket.date?.let {
            if (ticket.date < LocalDate.now().plusDays(1).atStartOfDay()) return ResponseEntity.badRequest().body(Error("Неверно указана дата"))
        }
        val date = ticket.date?: existTicket.date
        val updTicket: Ticket = existTicket.copy(
            date = date,
            description = ticket.description?: existTicket.description,
            results = ticket.results?: existTicket.results,
            doctor = doctor,
            status = status,
            user = user)
        ticketRepository.save(updTicket)
        return ResponseEntity.ok().body(Response("Запись обновлена", updTicket))
    }
    fun cancelTicket(id: String): ResponseEntity<Any> {
        val ticket = ticketRepository.findById(id).orElse(null)
        ticket.let {
            if (LocalDate.now().plusDays(1).atStartOfDay() >= ticket.date) return ResponseEntity.badRequest().body(Error("Прием нельзя отменить в текущий день"))
            val updTicket = ticket.copy(
                status = TicketStatus.отменен.toString()
            )
            ticketRepository.save(updTicket)
            return ResponseEntity.ok().body(Response("Прием отменен", updTicket))
        }
        return ResponseEntity.badRequest().body(Error("Не найдено приема с id $id"))
    }
    fun getTicketById(id: String): Ticket? = ticketRepository.findById(id).orElse(null)
}