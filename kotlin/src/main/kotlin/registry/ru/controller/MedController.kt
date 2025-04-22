package registry.ru.controller

import org.apache.catalina.Executor
import registry.ru.model.*
import registry.ru.service.UserService
import org.springframework.web.bind.annotation.*
import org.springframework.http.ResponseEntity
import registry.ru.service.StaffService
import registry.ru.service.TiketService
import java.time.LocalDate
import java.util.UUID

@RestController
@RequestMapping("/api/v0.1/med")
class MedController(private val userService: UserService, private val tiketService: TiketService, private val staffService: StaffService) {
    @GetMapping("/tikets/all")
    fun getAllTikets(): List<Tiket> = tiketService.getAllTikets()

    @GetMapping("/tikets/status/{status}")
    fun getTiketsByStatus(@PathVariable status: String): ResponseEntity<Any> = tiketService.getTiketsByStatus(status)

    @GetMapping("tikets/doctor/{doctor}")
    fun getTiketsByDoctor(@PathVariable doctor: String): ResponseEntity<Any> = tiketService.getTiketsByDateAndDoctor(doctor)

    @PostMapping("/tikets/new")
    fun createNewTiket(@RequestBody tiket: TiketCreateRequest): ResponseEntity<Any> {
        val userEmail: String = tiket.user.email?: return ResponseEntity.badRequest().body(Error("Не задан email пациента"))
        val response = userService.getUserByEmail(userEmail)?: userService.createUser(
            UserRegisterRequest(
                tiket.user.birthday?: return ResponseEntity.badRequest().body(Error("Не задан день рождения пациента")),
                email = userEmail,
                tiket.user.fullName?: return ResponseEntity.badRequest().body(Error("Не задано ФИО пациента")),
                tiket.user.medPolicy?: return ResponseEntity.badRequest().body(Error("Не задан мед полис пациента")),
                tiket.user.passport?: return ResponseEntity.badRequest().body(Error("Не задан пасспорт пациента")),
                tiket.user.phone?: return ResponseEntity.badRequest().body(Error("Не задан номер телефона пациента")),
                tiket.user.snils?: return ResponseEntity.badRequest().body(Error("Не задан СНИЛС пациента")),
                ""
            )).body
        if (response is Error) return ResponseEntity.badRequest().body(response)
        if (response is AuthResponse && response.user is User) {
            val user: User = response.user
            val parsedStatus = try{
                TiketStatus.valueOf((tiket.status?: TiketStatus.подтверждается.toString()).lowercase()).toString()
            } catch (e: Exception) {return ResponseEntity.badRequest().body(Error("Неверно передан статус"))}
            if (tiket.date < LocalDate.now().plusDays(1).atStartOfDay()) return ResponseEntity.badRequest().body(Error("Неверно выбрано время"))
            val newTiket: Tiket = Tiket(UUID.randomUUID().toString(),
                tiket.date,
                tiket.description,
                tiket.results,
                tiket.doctor,
                parsedStatus,
                user)
            tiketService.createNewTiket(newTiket)
            return ResponseEntity.ok().body(Response("Запись успешно создана", newTiket))
        }
        else return ResponseEntity.internalServerError().body(Error("Невозможно создать пользователя"))
    }

    @PutMapping("/tikets/update/{id}")
    fun updateTiket(@PathVariable id: String, @RequestBody tiket: TiketRequest, ): ResponseEntity<Any> {
        val existTiket: Tiket? = tiketService.getTiketById(id)
        existTiket?.let {
            tiket.user?.let {
                val user = userService.getUserById(tiket.user) ?: return ResponseEntity.badRequest()
                    .body(Error("Неверно указан пользователь"))
                return tiketService.updateTiket(id, tiket, user)
            }
            return tiketService.updateTiket(id, tiket, existTiket.user)
        }
        return ResponseEntity.badRequest().body(Error("Не найдено записи с id $id"))
    }

    @GetMapping("tikets/id/{id}")
    fun getTiketById(@PathVariable id: String): ResponseEntity<Any> {
        val tiket: Tiket = tiketService.getTiketById(id)?: return ResponseEntity.badRequest().body(Error("Не найдено задачи с id $id"))
        return ResponseEntity.ok().body(tiket)
    }

    @PutMapping("/id/{id}")
    fun updateDoctor(@PathVariable id: String, @RequestBody doc: StaffRequest): ResponseEntity<Any> = staffService.updateStaff(doc, id)

    @GetMapping("email/{email}")
    fun getDoctorByEmail(@PathVariable email: String): ResponseEntity<Any> {
        val doctor = staffService.getStaffByEmail(email)?: return ResponseEntity.badRequest().body(Error("Не найдено пользователя с email $email"))
        return ResponseEntity.ok().body(doctor)
    }

    @GetMapping("id/{id}")
    fun getDoctorById(@PathVariable id: String): ResponseEntity<Any> {
        val doctor = staffService.getStaffById(id)?: return ResponseEntity.badRequest().body(Error("Не найдено пользователя с id $id"))
        return ResponseEntity.ok().body(doctor)
    }

    @DeleteMapping("id/{id}")
    fun deleteDoctor(@PathVariable id: String): ResponseEntity<Any> = staffService.deleteStaff(id)
}

