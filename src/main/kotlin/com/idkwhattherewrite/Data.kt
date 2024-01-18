package com.idkwhattherewrite

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table

object DataTable : Table() {
    val fullName = varchar("FullName", 255)
    val phone = varchar("Phone", 50)
    val email = varchar("Email", 255)
    val section = integer("Section")
    val date = varchar("Date", 50).nullable()
    val hasReport = bool("HasReport")
    val reportName = varchar("ReportName", 255).nullable()
}

@Serializable
data class Data(
    @SerialName("FullName") val fullName: String,
    @SerialName("Phone") val phone: String,
    @SerialName("Email") val email: String,
    @SerialName("Section") val section: Int,
    @SerialName("Date") val date: String?,
    @SerialName("HasReport") val hasReport: Boolean,
    @SerialName("ReportName") val reportName: String?,
)
