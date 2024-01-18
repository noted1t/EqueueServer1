package com.idkwhattherewrite

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SchemaUtils.create
import org.jetbrains.exposed.sql.transactions.transaction
import java.nio.file.Paths

object DatabaseFactory {
    fun init() {
        Database.connect(hikari())
        transaction {
            create(DataTable)
        }
    }

    fun readAll(): List<Data> = transaction {
        DataTable.selectAll().map {
            Data(
                fullName = it[DataTable.fullName],
                phone = it[DataTable.phone],
                email = it[DataTable.email],
                section = it[DataTable.section],
                date = it[DataTable.date],
                hasReport = it[DataTable.hasReport],
                reportName = it[DataTable.reportName]
            )
        }
    }

    fun clearAll() = transaction {
        DataTable.deleteAll()
    }

    fun insert(data: Data) = transaction {
        DataTable.insert {
            it[fullName] = data.fullName
            it[phone] = data.phone
            it[email] = data.email
            it[section] = data.section
            it[date] = data.date
            it[hasReport] = data.hasReport
            if(data.hasReport){
                it[reportName] = data.reportName
            }
            else {
                it[reportName] = null
            }
        }
    }

    fun checkAvailable(fullName: String, reportName: String?): Boolean = transaction {
        DataTable.selectAll().where { (DataTable.fullName eq fullName) and (DataTable.reportName eq reportName) }.count() > 0
    }

    fun checkExistName(fullName: String): Existed = transaction {
        Existed(
            result = DataTable.selectAll().where { DataTable.fullName eq fullName }.count() > 0
        )
    }

    private fun hikari(): HikariDataSource {
        val config = HikariConfig()
        val path = Paths.get("").toAbsolutePath().toString()
        config.driverClassName = "org.h2.Driver"
        config.jdbcUrl = "jdbc:h2:file:${path}" + """\""".trimIndent() + "file.db"
        config.maximumPoolSize = 3
        config.isAutoCommit = false
        config.transactionIsolation = "TRANSACTION_REPEATABLE_READ"
        config.validate()
        return HikariDataSource(config)
    }
}
