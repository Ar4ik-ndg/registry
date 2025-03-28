package com.example.kotlin.repository

import com.example.kotlin.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository: JpaRepository<User, Long>{
    fun findByMedPolicy(medPolicy: String): User?
    fun findByPassport(passport: String): User?
    fun findBySnils(snils: String): User?
}