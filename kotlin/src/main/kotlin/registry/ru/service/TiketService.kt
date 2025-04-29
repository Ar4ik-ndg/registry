package registry.ru.service

import registry.ru.repository.TiketRepository
import registry.ru.model.*
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalDateTime

@Service
class TiketService(private val tiketRepository: TiketRepository) {
    fun getAllTikets(): List<Tiket> = tiketRepository.findAll()
    fun getTiketsByDateAndDoctor(doctor: String): ResponseEntity<Any> {
        try {
            val dateTime: LocalDateTime = LocalDate.now().atStartOfDay()
            val tikets: List<Tiket> = tiketRepository.findByDateBetweenAndDoctor(dateTime, dateTime.plusDays(1), doctor)
            if (tikets.isNotEmpty()) return ResponseEntity.ok().body(tikets)
            else return ResponseEntity.badRequest().body(Error("Нет задач на текущую дату"))
        } catch (e: Exception) {
            return ResponseEntity.badRequest().body(Error(e))
        }
    }
    fun getTiketsByUserId(id: String): ResponseEntity<Any> {
        try {
            val tikets: List<Tiket> = tiketRepository.findByUserId(id)
            if (tikets.isNotEmpty()) return ResponseEntity.ok().body(tikets)
            else return ResponseEntity.badRequest().body(Error("Приемов нет"))
        } catch (e: Exception) {
            return ResponseEntity.badRequest().body(Error(e))
        }
    }
    fun getTiketsByStatus(status: String): ResponseEntity<Any> {
        val parsedStatus = try {
            TiketStatus.valueOf(status.lowercase()).toString()
        } catch (e: Exception) {
            return ResponseEntity.badRequest().body("Неверно передан статус")
        }
        val tikets = tiketRepository.findByStatus(parsedStatus)
        if (tikets.isNotEmpty()) return ResponseEntity.ok().body(tikets)
        else return ResponseEntity.badRequest().body(Error("Нет осмотров со статусом $parsedStatus"))
    }
    fun getBusyTime(start: LocalDate): ResponseEntity<Any> {
        val startDay = start.atStartOfDay()
        val endDay = start.plusDays(1).atStartOfDay()
        val busyTime: List<LocalDateTime>? = tiketRepository.findByDateBetween(startDay, endDay, listOf(TiketStatus.отменен.name, TiketStatus.завершен.name))
        return ResponseEntity.ok().body(busyTime)
    }
    fun createNewTiket(tiket: Tiket): Tiket = tiketRepository.save(tiket)
    fun updateTiket(id: String, tiket: TiketRequest, user: User): ResponseEntity<Any> {
        val existTiket: Tiket = tiketRepository.findById(id).orElse(null)
        val status = try {
                TiketStatus.valueOf((tiket.status?: existTiket.status).lowercase()).toString()
            } catch (e: Exception) {return ResponseEntity.badRequest().body(Error("Неверно указан статус"))}
        tiket.date?.let {
            if (tiket.date < LocalDate.now().plusDays(1).atStartOfDay()) return ResponseEntity.badRequest().body(Error("Неверно указана дата"))
        }
        val date = tiket.date?: existTiket.date
        val updTiket: Tiket = existTiket.copy(
            date = date,
            description = tiket.description?: existTiket.description,
            results = tiket.results?: existTiket.results,
            doctor = tiket.doctor?: existTiket.doctor,
            status = status,
            user = user)
        tiketRepository.save(updTiket)
        return ResponseEntity.ok().body(Response("Запись обновлена", updTiket))
    }
    fun cancelTiket(id: String): ResponseEntity<Any> {
        val tiket = tiketRepository.findById(id).orElse(null)
        tiket.let {
            if (LocalDate.now().plusDays(1).atStartOfDay() >= tiket.date) return ResponseEntity.badRequest().body(Error("Прием нельзя отменить в текущий день"))
            val updTiket = tiket.copy(
                status = TiketStatus.отменен.toString()
            )
            tiketRepository.save(updTiket)
            return ResponseEntity.ok().body(Response("Прием отменен", updTiket))
        }
        return ResponseEntity.badRequest().body(Error("Не найдено приема с id $id"))
    }
    fun getTiketById(id: String): Tiket? = tiketRepository.findById(id).orElse(null)
}