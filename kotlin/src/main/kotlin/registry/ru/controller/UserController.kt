package registry.ru.controller

import org.springframework.format.annotation.DateTimeFormat
import registry.ru.service.UserService
import registry.ru.service.TicketService
import org.springframework.web.bind.annotation.*
import org.springframework.http.ResponseEntity
import registry.ru.model.*
import registry.ru.service.StaffService
import java.time.LocalDate
import java.util.*


@RestController
@RequestMapping("/api/v0.1/user")
class UserController(private val userService: UserService, private val ticketService: TicketService, private val staffService: StaffService) {

    @GetMapping("/tickets/{id}")
    fun getTicketsById(@PathVariable id: String): ResponseEntity<Any> {
        val user = userService.getUserById(id)
        user?.let {
            return ticketService.getTicketsByUserId(user.id)
        }
        return ResponseEntity.badRequest().body(Error("Не найдено пользователя с id $id"))
    }

    @GetMapping("/tickets/busy/{date}")
    fun getTicketsBusy(@PathVariable @DateTimeFormat(pattern = "dd.MM.yyyy") date: LocalDate): ResponseEntity<Any> {
        return ticketService.getBusyTime(date)
    }

    @PostMapping("/tickets/new")
    fun createNewTicket(@RequestBody ticket: TicketCreateRequest): ResponseEntity<Any> {
        val user: User? = userService.getUserByEmail(ticket.user.email?: return ResponseEntity.badRequest().body(Error("Не найден пользователь с email: ${ticket.user.email}")))
        user?.let {
            val parsedStatus = try {
                TicketStatus.подтверждается.toString()
            } catch (e: Exception) {
                return ResponseEntity.badRequest().body(Error("Неверно задан статус"))
            }
            if (ticket.date < LocalDate.now().plusDays(1).atStartOfDay()) return ResponseEntity.badRequest().body(Error("Неверно выбрано время"))
            val newTicket: Ticket = Ticket(
                UUID.randomUUID().toString(),
                ticket.date,
                ticket.description,
                ticket.results,
                ticket.doctor,
                parsedStatus,
                user)
            ticketService.createNewTicket(newTicket)
            return ResponseEntity.ok().body(Response("Запись успешно отправлена на подтвержнение", newTicket))
        }
        return ResponseEntity.badRequest().body(Error("Пользователь с id ${ticket.user} не найден"))
    }

    @PutMapping("/tickets/cancel/{id}")
    fun cancelTicket(@PathVariable id: String): ResponseEntity<Any> = ticketService.cancelTicket(id)

    @GetMapping("/id/{id}")
    fun getUserById(@PathVariable id: String): ResponseEntity<Any> {
        val user = userService.getUserById(id)
        user.let {
            return ResponseEntity.ok().body(user)
        }
            return ResponseEntity.badRequest().body(Error("Пользователя с id $id не найдено"))
    }

    @GetMapping("/email/{email}")
    fun getUserByEmail(@PathVariable email: String): ResponseEntity<Any> {
        val user = userService.getUserByEmail(email)
        user.let {
            return ResponseEntity.ok().body(user)
        }
            return ResponseEntity.badRequest().body(Error("Пользователя с email $email не найдено"))
    }

    @GetMapping("/med/{prof}")
    fun getDoctorsByProf(@PathVariable prof: String): ResponseEntity<Any> {
        val doctors = staffService.getStaffByProf(prof)
        if (doctors.isEmpty()) return ResponseEntity.badRequest().body(Error("Нет докторов данного направления"))
        else return ResponseEntity.ok().body(doctors)
    }

    @GetMapping("/med/profs")
    fun getProfsDoctors(): ResponseEntity<Any> {
        val profs: List<String>? = staffService.getStaffPofs()
        if (profs.isNullOrEmpty()) return ResponseEntity.internalServerError().body(Error("нет врачей")) else return ResponseEntity.ok().body(profs)
    }

    @PutMapping("/id/{id}")
    fun updateUser(@PathVariable id: String, @RequestBody updUser: UserUpdRequest): ResponseEntity<Any> = userService.updateUser(updUser, id)

    @DeleteMapping("/id/{id}")
    fun deleteUser(@PathVariable id: String): ResponseEntity<Any> = userService.deleteUser(id)
}