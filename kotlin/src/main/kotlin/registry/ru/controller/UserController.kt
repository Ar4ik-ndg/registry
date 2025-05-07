package registry.ru.controller

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

    @PostMapping("/tickets/busy")
    fun getTicketsBusy(@RequestBody request: TicketBusyTimeRequest): ResponseEntity<Any> {
        val doctor = staffService.getStaffById(request.doctor)
        doctor?.let {
            return ticketService.getBusyTime(request.date, request.doctor)
        }
        return ResponseEntity.badRequest().body(Error("Не передан врач"))
    }

    @PostMapping("/tickets/new")
    fun createNewTicket(@RequestBody ticket: TicketCreateRequest): ResponseEntity<Any> {
        val user: User? = userService.getUserByEmail(ticket.user.email?: return ResponseEntity.badRequest().body(Error("Не найден пользователь с email: ${ticket.user.email}")))
        user?.let {
            val doctor: Staff? = staffService.getStaffById(ticket.doctor)
            doctor?.let {
                val parsedStatus = try {
                    TicketStatus.подтверждается.toString()
                } catch (e: Exception) {
                    return ResponseEntity.badRequest().body(Error("Неверно задан статус"))
                }
                if (ticket.date < LocalDate.now().plusDays(1).atStartOfDay()) return ResponseEntity.badRequest().body(Error("Неверно выбрано время"))
                val busyTime = ticketService.getTicketsByDateAndDoctor(doctor.id).body
                if (busyTime is List<*>) {
                    if (busyTime.contains(ticket.date)) { return ResponseEntity.badRequest().body(Error("Время уже занято"))}
                }
                val newTicket: Ticket = Ticket(
                    UUID.randomUUID().toString(),
                    ticket.date,
                    ticket.description,
                    ticket.results,
                    doctor,
                    parsedStatus,
                    user)
                ticketService.createNewTicket(newTicket)
                return ResponseEntity.ok().body(Response("Запись успешно отправлена на подтвержнение", newTicket))
            }
            return ResponseEntity.badRequest().body(Error("Доктор с id ${ticket.doctor} не найден"))
        }
        return ResponseEntity.badRequest().body(Error("Пользователь с email ${ticket.user.email} не найден"))
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
        if (profs.isNullOrEmpty()) return ResponseEntity.internalServerError().body(Error("нет врачей")) else return ResponseEntity.ok().body(profs.filterNotNull())
    }

    @PutMapping("/id/{id}")
    fun updateUser(@PathVariable id: String, @RequestBody updUser: UserUpdRequest): ResponseEntity<Any> = userService.updateUser(updUser, id)

    @DeleteMapping("/id/{id}")
    fun deleteUser(@PathVariable id: String): ResponseEntity<Any> = userService.deleteUser(id)
}