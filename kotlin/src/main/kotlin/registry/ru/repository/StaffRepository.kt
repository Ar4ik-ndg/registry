package registry.ru.repository

import registry.ru.model.Staff
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface StaffRepository: JpaRepository<Staff, String> {
    fun findByProf(prof: String): List<Staff>
    fun findByEmail(email: String): Staff?
    fun findByPhone(phone: String): Staff?
    @Query("SELECT distinct s.prof from Staff s")
    fun findDistinctProf(): List<String>
}