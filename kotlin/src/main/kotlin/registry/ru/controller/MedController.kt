package registry.ru.controller

import registry.ru.model.*
import registry.ru.service.UserService
import org.springframework.web.bind.annotation.*
import org.springframework.http.ResponseEntity
import registry.ru.service.StaffService
import registry.ru.service.TicketService
import java.time.LocalDate
import java.util.UUID

@RestController
@RequestMapping("/api/v0.1/med")
class MedController(private val userService: UserService, private val ticketService: TicketService, private val staffService: StaffService) {
    @GetMapping("/tickets/all")
    fun getAllTickets(): List<Ticket> = ticketService.getAllTickets()

    @GetMapping("/tickets/status/{status}")
    fun getTicketsByStatus(@PathVariable status: String): ResponseEntity<Any> = ticketService.getTicketsByStatus(status)

    @GetMapping("tickets/doctor/{doctor}")
    fun getTicketsByDoctor(@PathVariable doctor: String): ResponseEntity<Any> = ticketService.getTicketsByDateAndDoctor(doctor)

    @PostMapping("/tickets/new")
    fun createNewTicket(@RequestBody ticket: TicketCreateRequest): ResponseEntity<Any> {
        val userEmail: String = ticket.user.email?: return ResponseEntity.badRequest().body(Error("Не задан email пациента"))
        val response = userService.getUserByEmail(userEmail)?: userService.createUser(
            UserRegisterRequest(
                ticket.user.birthday?: return ResponseEntity.badRequest().body(Error("Не задан день рождения пациента")),
                email = userEmail,
                ticket.user.fullName?: return ResponseEntity.badRequest().body(Error("Не задано ФИО пациента")),
                ticket.user.medPolicy?: return ResponseEntity.badRequest().body(Error("Не задан мед полис пациента")),
                ticket.user.passport?: return ResponseEntity.badRequest().body(Error("Не задан пасспорт пациента")),
                ticket.user.phone?: return ResponseEntity.badRequest().body(Error("Не задан номер телефона пациента")),
                ticket.user.snils?: return ResponseEntity.badRequest().body(Error("Не задан СНИЛС пациента")),
                ""
            )).body
        if (response is Error) return ResponseEntity.badRequest().body(response)
        if (response is User) {
            val user: User = response
            val parsedStatus = try{
                TicketStatus.valueOf((ticket.status?: TicketStatus.подтверждается.toString()).lowercase()).toString()
            } catch (e: Exception) {return ResponseEntity.badRequest().body(Error("Неверно передан статус"))}
            if (ticket.date < LocalDate.now().plusDays(1).atStartOfDay()) return ResponseEntity.badRequest().body(Error("Неверно выбрано время"))
            val newTicket: Ticket = Ticket(UUID.randomUUID().toString(),
                ticket.date,
                ticket.description,
                ticket.results,
                ticket.doctor,
                parsedStatus,
                user)
            ticketService.createNewTicket(newTicket)
            return ResponseEntity.ok().body(Response("Запись успешно создана", newTicket))
        }
        else return ResponseEntity.internalServerError().body(Error("Невозможно создать пользователя"))
    }

    @PutMapping("/tickets/update/{id}")
    fun updateTicket(@PathVariable id: String, @RequestBody ticket: TicketRequest, ): ResponseEntity<Any> {
        val existTicket: Ticket? = ticketService.getTicketById(id)
        existTicket?.let {
            ticket.user?.let {
                val user = userService.getUserById(ticket.user) ?: return ResponseEntity.badRequest()
                    .body(Error("Неверно указан пользователь"))
                return ticketService.updateTicket(id, ticket, user)
            }
            return ticketService.updateTicket(id, ticket, existTicket.user)
        }
        return ResponseEntity.badRequest().body(Error("Не найдено записи с id $id"))
    }

    @GetMapping("/tickets/id/{id}")
    fun getTicketById(@PathVariable id: String): ResponseEntity<Any> {
        val ticket: Ticket = ticketService.getTicketById(id)?: return ResponseEntity.badRequest().body(Error("Не найдено задачи с id $id"))
        return ResponseEntity.ok().body(ticket)
    }

    @PutMapping("/id/{id}")
    fun updateDoctor(@PathVariable id: String, @RequestBody doc: StaffRequest): ResponseEntity<Any> = staffService.updateStaff(doc, id)

    @GetMapping("/email/{email}")
    fun getDoctorByEmail(@PathVariable email: String): ResponseEntity<Any> {
        val doctor = staffService.getStaffByEmail(email)?: return ResponseEntity.badRequest().body(Error("Не найдено пользователя с email $email"))
        return ResponseEntity.ok().body(doctor)
    }

    @GetMapping("/id/{id}")
    fun getDoctorById(@PathVariable id: String): ResponseEntity<Any> {
        val doctor = staffService.getStaffById(id)?: return ResponseEntity.badRequest().body(Error("Не найдено пользователя с id $id"))
        return ResponseEntity.ok().body(doctor)
    }

    @DeleteMapping("/id/{id}")
    fun deleteDoctor(@PathVariable id: String): ResponseEntity<Any> = staffService.deleteStaff(id)
}

