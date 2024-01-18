package com.idkwhattherewrite

import com.idkwhattherewrite.DatabaseFactory.checkAvailable
import com.idkwhattherewrite.DatabaseFactory.checkExistName
import com.idkwhattherewrite.DatabaseFactory.clearAll
import com.idkwhattherewrite.DatabaseFactory.readAll
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

fun Application.configureRouting() {
    val adminPass = "adminpass"
    routing {
        post("/checkNameForExist") {
            val fullName = call.receive<Resulter>()
            val exists = checkExistName(fullName.name)
            call.respond(exists)
        }

        delete("/deleteAll") {
            val password = call.receive<Resulter>().name
            if(password == adminPass){
                clearAll()
                call.respondText("Все данные сброшены", status = HttpStatusCode.ResetContent)
            }
            else {
                call.respondText("Неверный пароль", status = HttpStatusCode.MethodNotAllowed)
            }
        }

        post("/checkNameForExist") {
            val fullName = Json.decodeFromString<Resulter>(call.receiveText())
            val exists = checkExistName(fullName.name)

            println(exists)

            call.respond(exists)
        }

        get("/getAllRecords") {
            val result = readAll()
            call.respond(result)
        }

        post("/insertData") {
            try {
                val receivedData = call.receive<Data>()
                val available = checkAvailable(fullName = receivedData.fullName, reportName = receivedData.reportName)
                if (!available){
                    DatabaseFactory.insert(receivedData)
                    call.respond(Existed(result = true))
                }
                else {
                    call.respond(Resulter("Уже имеется"))
                }
            } catch (e: Exception) {
                call.respondText(e.message ?: "Ошибка", status = HttpStatusCode.BadRequest)
            }
        }
    }
}

@Serializable
data class Resulter(
    @SerialName("name") val name: String
)

@Serializable
data class Existed(
    @SerialName("result") val result: Boolean
)