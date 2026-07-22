package com.example

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

data class UnitState(
    val id: String = "M51",
    val callsign: String = "MEDIC 51",
    val status: String = "Available"
)

data class Incident(
    val id: String,
    val nature: String,
    val location: String,
    val priority: Int,
    val notes: String
)

data class AuditLogEvent(
    val id: String,
    val timestamp: String,
    val unitId: String?,
    val body: String,
    val type: String // "STATUS", "CHAT"
)

class OpenCadViewModel : ViewModel() {
    private val _unit = MutableStateFlow(UnitState())
    val unit: StateFlow<UnitState> = _unit.asStateFlow()

    private val _incident = MutableStateFlow<Incident?>(null)
    val incident: StateFlow<Incident?> = _incident.asStateFlow()

    private val _logs = MutableStateFlow<List<AuditLogEvent>>(emptyList())
    val logs: StateFlow<List<AuditLogEvent>> = _logs.asStateFlow()

    init {
        // Initial setup log
        addLog("SYS", "Unit online and listening.", "STATUS")
        
        // Simulate an incoming call after 3 seconds
        viewModelScope.launch {
            delay(3000)
            assignIncident(
                Incident(
                    id = "INC-832",
                    nature = "MEDICAL EMERGENCY",
                    location = "123 Main St, Springfield",
                    priority = 2,
                    notes = "Elderly male, chest pain, conscious and breathing."
                )
            )
        }
    }

    private fun assignIncident(inc: Incident) {
        _incident.value = inc
        addLog("DISPATCH", "Assigned ${unit.value.callsign} to incident ${inc.id}", "STATUS")
        // Ring an alert or trigger visual pulse here if we wanted
    }

    fun updateStatus(newStatus: String) {
        _unit.update { it.copy(status = newStatus) }
        addLog(_unit.value.callsign, "Status changed to: \$newStatus", "STATUS")
        
        if (newStatus == "Available") {
            _incident.value = null
            addLog("DISPATCH", "Cleared from incident.", "STATUS")
        }
    }

    fun sendChat(message: String) {
        if (message.isNotBlank()) {
            addLog(_unit.value.callsign, message, "CHAT")
            
            // Simulate dispatch replying
            viewModelScope.launch {
                delay(1500)
                addLog("DISPATCH", "Copy that.", "CHAT")
            }
        }
    }

    private fun addLog(unitId: String, body: String, type: String) {
        val now = SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())
        val event = AuditLogEvent(
            id = java.util.UUID.randomUUID().toString(),
            timestamp = now,
            unitId = unitId,
            body = body,
            type = type
        )
        _logs.update { listOf(event) + it }
    }
}
