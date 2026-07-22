package com.example

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

// Data Models
data class DispatchIncident(val id: String, val nature: String, val location: String, val priority: String, val status: String, val units: List<String>)
data class DispatchUnitStatus(val id: String, val type: String, val status: String, val capabilities: String)
data class Patient(val id: String, val incidentId: String, val name: String, val details: String, val condition: String, val unit: String, val dest: String)
data class Message(val id: Int, val from: String, val text: String, val time: String)
data class WeatherAlert(val id: String, val title: String, val area: String, val expires: String)
data class TrainingTranscription(val id: String, val text: String, val active: Boolean)

// Scenarios
data class TrainingScenario(val id: String, val name: String, val durationSecs: Int, val events: List<ScenarioEvent>)
data class ScenarioEvent(val t: Int, val type: String, val text: String? = null, val unit: String? = null, val status: String? = null)

val MOCK_SCENARIOS = listOf(
    TrainingScenario(
        id = "scen_1",
        name = "Major Collision (I-95)",
        durationSecs = 60,
        events = listOf(
            ScenarioEvent(2, "RADIO", text = "Engine 12, respond to a reported motor vehicle collision, I-95 Northbound MM 42."),
            ScenarioEvent(15, "RADIO", text = "Medic 51, be advised, caller reports multiple patients."),
            ScenarioEvent(30, "UPDATE_UNIT", unit = "ENGINE 12", status = "En Route"),
            ScenarioEvent(45, "UPDATE_UNIT", unit = "MEDIC 51", status = "En Route")
        )
    )
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DispatcherScreen() {
    var activeTab by remember { mutableStateOf("dispatch") }

    // Global State
    var incidents by remember { mutableStateOf(listOf(
        DispatchIncident("INC-832", "Motor Vehicle Collision", "I-95 Northbound MM 42", "High", "Dispatched", listOf("MEDIC 51"))
    )) }
    var units by remember { mutableStateOf(listOf(
        DispatchUnitStatus("MEDIC 51", "EMS", "En Route", "ALS, Bariatric"),
        DispatchUnitStatus("ENGINE 12", "FIRE", "Available", "Pumper, Extrication"),
        DispatchUnitStatus("PATROL 1", "PD", "On Scene", "K9, Radar"),
        DispatchUnitStatus("RESCUE 9", "FIRE", "Available", "Heavy Rescue")
    )) }
    val patients = listOf(
        Patient("PAT-101", "INC-832", "John Doe", "45 y/o M", "Critical", "MEDIC 51", "WakeMed Trauma"),
        Patient("PAT-102", "INC-832", "Jane Smith", "32 y/o F", "Stable", "Pending", "Rex Hospital")
    )
    val messages = listOf(
        Message(1, "System", "Daily system backup completed successfully.", "08:00 AM"),
        Message(2, "Field Supervisor", "All units be advised, major road work on I-440 starts tonight.", "09:15 AM")
    )
    val weatherAlerts = listOf(
        WeatherAlert("WX-1", "Severe Thunderstorm Warning", "Wake County", "18:45 PM")
    )

    Row(modifier = Modifier.fillMaxSize().background(Color(0xFF020617))) {
        // Navigation Rail
        NavigationRail(
            modifier = Modifier.width(80.dp).fillMaxHeight(),
            containerColor = Color(0xFF0F172A),
            contentColor = Color(0xFF94A3B8)
        ) {
            Spacer(modifier = Modifier.height(24.dp))
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .background(Color(0xFF2563EB), RoundedCornerShape(12.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.Warning, contentDescription = "Logo", tint = Color.White)
            }
            Spacer(modifier = Modifier.height(32.dp))

            NavigationRailItem(
                selected = activeTab == "dispatch",
                onClick = { activeTab = "dispatch" },
                icon = { Icon(Icons.Default.Send, contentDescription = "Dispatch") },
                label = { Text("Dispatch", fontSize = 10.sp) },
                colors = NavigationRailItemDefaults.colors(
                    selectedIconColor = Color(0xFF60A5FA),
                    selectedTextColor = Color(0xFF60A5FA),
                    indicatorColor = Color(0xFF1E3A8A).copy(alpha=0.5f)
                )
            )
            Spacer(modifier = Modifier.height(16.dp))
            NavigationRailItem(
                selected = activeTab == "patients",
                onClick = { activeTab = "patients" },
                icon = { Icon(Icons.Default.Person, contentDescription = "Patients") },
                label = { Text("Patients", fontSize = 10.sp) },
                colors = NavigationRailItemDefaults.colors(
                    selectedIconColor = Color(0xFF60A5FA),
                    selectedTextColor = Color(0xFF60A5FA),
                    indicatorColor = Color(0xFF1E3A8A).copy(alpha=0.5f)
                )
            )
            Spacer(modifier = Modifier.height(16.dp))
            NavigationRailItem(
                selected = activeTab == "comms",
                onClick = { activeTab = "comms" },
                icon = { Icon(Icons.Default.Email, contentDescription = "Comms") },
                label = { Text("Comms", fontSize = 10.sp) },
                colors = NavigationRailItemDefaults.colors(
                    selectedIconColor = Color(0xFF60A5FA),
                    selectedTextColor = Color(0xFF60A5FA),
                    indicatorColor = Color(0xFF1E3A8A).copy(alpha=0.5f)
                )
            )
        }

        // Main Content Area
        Column(modifier = Modifier.weight(1f).fillMaxHeight()) {
            // Top Bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
                    .background(Color(0xFF0F172A))
                    .border(1.dp, Color(0xFF1E293B))
                    .padding(horizontal = 16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("OpenCAD SYSTEM", color = Color(0xFF94A3B8), fontWeight = FontWeight.Bold, fontSize = 12.sp, letterSpacing = 1.sp)
                    Spacer(modifier = Modifier.width(16.dp))
                    if (weatherAlerts.isNotEmpty()) {
                        val wa = weatherAlerts[0]
                        Row(
                            modifier = Modifier
                                .background(Color(0xFFEF4444).copy(alpha = 0.1f), RoundedCornerShape(16.dp))
                                .border(1.dp, Color(0xFFEF4444).copy(alpha = 0.2f), RoundedCornerShape(16.dp))
                                .padding(horizontal = 12.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.Warning, contentDescription = null, tint = Color(0xFFF87171), modifier = Modifier.size(12.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("${wa.title} - ${wa.area}", color = Color(0xFFF87171), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
                
                Row(verticalAlignment = Alignment.CenterVertically) {
                    val timeFormat = SimpleDateFormat("hh:mm:ss a", Locale.getDefault())
                    Text(timeFormat.format(Date()), color = Color(0xFF94A3B8), fontSize = 14.sp)
                }
            }

            // Tab Content
            Box(modifier = Modifier.fillMaxSize().padding(16.dp)) {
                when (activeTab) {
                    "dispatch" -> DispatchTab(incidents, units, { inc -> incidents = listOf(inc) + incidents }, { unitId ->
                        val statuses = listOf("Available", "Dispatched", "En Route", "On Scene", "Cleared")
                        units = units.map { u ->
                            if (u.id == unitId) {
                                val next = (statuses.indexOf(u.status) + 1) % statuses.size
                                u.copy(status = statuses[next])
                            } else u
                        }
                    })
                    "patients" -> PatientsTab(patients)
                    "comms" -> CommsTab(messages, weatherAlerts)
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DispatchTab(
    incidents: List<DispatchIncident>, 
    units: List<DispatchUnitStatus>,
    onNewIncident: (DispatchIncident) -> Unit,
    onCycleUnitStatus: (String) -> Unit
) {
    var newNature by remember { mutableStateOf("") }
    var newLocation by remember { mutableStateOf("") }
    var newPriority by remember { mutableStateOf("Normal") }
    
    // Playback state
    var transcriptions by remember { mutableStateOf<List<TrainingTranscription>>(emptyList()) }
    var activeScenario by remember { mutableStateOf(MOCK_SCENARIOS[0]) }
    var isPlaying by remember { mutableStateOf(false) }
    var playbackTime by remember { mutableStateOf(0) }

    LaunchedEffect(isPlaying, activeScenario) {
        if (isPlaying) {
            while (playbackTime < activeScenario.durationSecs) {
                delay(1000)
                playbackTime++
                
                val currentEvents = activeScenario.events.filter { it.t == playbackTime }
                currentEvents.forEach { evt ->
                    if (evt.type == "RADIO" && evt.text != null) {
                        val newId = java.util.UUID.randomUUID().toString()
                        val tx = TrainingTranscription(newId, evt.text, true)
                        transcriptions = (transcriptions + tx).takeLast(3)
                        
                        launch {
                            delay(8000L)
                            transcriptions = transcriptions.map { if (it.id == newId) it.copy(active = false) else it }
                        }
                    }
                }
            }
            isPlaying = false
        }
    }

    Column(modifier = Modifier.fillMaxSize()) {
        // Toolbar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF0F172A), RoundedCornerShape(12.dp))
                .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(12.dp))
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .background(Color(0xFF020617), RoundedCornerShape(8.dp))
                    .border(1.dp, Color(0xFF334155), RoundedCornerShape(8.dp))
                    .padding(horizontal = 12.dp, vertical = 8.dp)
            ) {
                Text("Scenario: ${activeScenario.name}", color = Color(0xFF60A5FA), fontWeight = FontWeight.Bold, fontSize = 14.sp)
            }
            Spacer(modifier = Modifier.width(16.dp))
            IconButton(onClick = { isPlaying = !isPlaying }) {
                Icon(if (isPlaying) Icons.Default.Close else Icons.Default.PlayArrow, contentDescription = "Play/Pause", tint = if (isPlaying) Color(0xFFF59E0B) else Color(0xFF22C55E))
            }
            val m = (playbackTime / 60).toString().padStart(2, '0')
            val s = (playbackTime % 60).toString().padStart(2, '0')
            Text("$m:$s", color = Color(0xFF60A5FA), fontWeight = FontWeight.Bold, fontSize = 20.sp, modifier = Modifier.padding(start = 12.dp))
        }
        
        Spacer(modifier = Modifier.height(16.dp))

        Row(modifier = Modifier.weight(1f).fillMaxWidth()) {
            // LEFT PANEL: Call Entry
            Column(modifier = Modifier.weight(1f).fillMaxHeight()) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(0.4f)
                        .background(Color(0xFF0F172A), RoundedCornerShape(12.dp))
                        .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(12.dp))
                        .padding(12.dp)
                ) {
                    Text("LIVE RADIO FEED (TRAINING)", color = Color(0xFF60A5FA), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    if (transcriptions.isEmpty()) {
                        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                            Text(if (isPlaying) "Listening..." else "Standby...", color = Color(0xFF475569), fontSize = 14.sp)
                        }
                    } else {
                        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            items(transcriptions) { tx ->
                                val bgColor = if (tx.active) Color(0xFF1E293B) else Color(0xFF1E293B).copy(alpha = 0.5f)
                                val borderColor = if (tx.active) Color(0xFF3B82F6).copy(alpha = 0.5f) else Color(0xFF334155)
                                Box(modifier = Modifier
                                    .fillMaxWidth()
                                    .background(bgColor, RoundedCornerShape(8.dp))
                                    .border(1.dp, borderColor, RoundedCornerShape(8.dp))
                                    .padding(8.dp)
                                ) {
                                    Text("\"${tx.text}\"", color = Color(0xFFE2E8F0), fontSize = 12.sp)
                                }
                            }
                        }
                    }
                }
                
                Spacer(modifier = Modifier.height(12.dp))
                
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(0.6f)
                        .background(Color(0xFF0F172A), RoundedCornerShape(12.dp))
                        .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(12.dp))
                        .padding(12.dp)
                ) {
                    Text("NEW CALL ENTRY", color = Color(0xFFCBD5E1), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(12.dp))
                    OutlinedTextField(
                        value = newLocation,
                        onValueChange = { newLocation = it },
                        label = { Text("Location", color = Color(0xFF94A3B8)) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White, unfocusedTextColor = Color.White,
                            focusedBorderColor = Color(0xFF3B82F6), unfocusedBorderColor = Color(0xFF334155)
                        )
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = newNature,
                        onValueChange = { newNature = it },
                        label = { Text("Nature", color = Color(0xFF94A3B8)) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White, unfocusedTextColor = Color.White,
                            focusedBorderColor = Color(0xFF3B82F6), unfocusedBorderColor = Color(0xFF334155)
                        )
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = {
                            if (newNature.isNotBlank() && newLocation.isNotBlank()) {
                                val newId = "INC-${(100..999).random()}"
                                onNewIncident(DispatchIncident(newId, newNature, newLocation, newPriority, "Pending", emptyList()))
                                newNature = ""
                                newLocation = ""
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB))
                    ) {
                        Text("CREATE INCIDENT", fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.width(12.dp))

            // CENTER PANEL: Incidents
            Column(modifier = Modifier.weight(1.5f).fillMaxHeight()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(0.4f)
                        .background(Color(0xFF0A0F1A), RoundedCornerShape(12.dp))
                        .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(12.dp))
                ) {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text("LIVE MAPPING\n(Android implementation requires Maps SDK)", color = Color(0xFF475569), fontSize = 14.sp, textAlign = TextAlign.Center)
                    }
                }
                
                Spacer(modifier = Modifier.height(12.dp))
                
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(0.6f)
                        .background(Color(0xFF0F172A), RoundedCornerShape(12.dp))
                        .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(12.dp))
                        .padding(12.dp)
                ) {
                    Text("ACTIVE INCIDENTS (${incidents.size})", color = Color(0xFFCBD5E1), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(12.dp))
                    LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        items(incidents) { inc ->
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(Color(0xFF020617), RoundedCornerShape(8.dp))
                                    .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(8.dp))
                                    .padding(12.dp)
                            ) {
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text(inc.id, color = Color(0xFFCBD5E1), fontWeight = FontWeight.Bold)
                                    Text(inc.status, color = Color(0xFF60A5FA), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(inc.nature, color = Color.White, fontWeight = FontWeight.Bold)
                                Text(inc.location, color = Color(0xFF94A3B8), fontSize = 14.sp)
                            }
                        }
                    }
                }
            }
            
            Spacer(modifier = Modifier.width(12.dp))

            // RIGHT PANEL: Units
            Column(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .background(Color(0xFF0F172A), RoundedCornerShape(12.dp))
                    .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(12.dp))
                    .padding(12.dp)
            ) {
                Text("UNIT STATUS BOARD", color = Color(0xFFCBD5E1), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(12.dp))
                LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(units) { unit ->
                        val bgColor = when(unit.status) {
                            "Available" -> Color(0xFF22C55E).copy(alpha = 0.2f)
                            "Dispatched" -> Color(0xFFEAB308).copy(alpha = 0.2f)
                            "En Route" -> Color(0xFF3B82F6).copy(alpha = 0.2f)
                            "On Scene" -> Color(0xFFEF4444).copy(alpha = 0.2f)
                            else -> Color(0xFF64748B).copy(alpha = 0.2f)
                        }
                        val fgColor = when(unit.status) {
                            "Available" -> Color(0xFF4ADE80)
                            "Dispatched" -> Color(0xFFFACC15)
                            "En Route" -> Color(0xFF60A5FA)
                            "On Scene" -> Color(0xFFF87171)
                            else -> Color(0xFF94A3B8)
                        }

                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color(0xFF020617), RoundedCornerShape(8.dp))
                                .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(8.dp))
                                .padding(12.dp)
                        ) {
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text(unit.id, color = Color.White, fontWeight = FontWeight.Bold)
                                Text(unit.type, color = Color(0xFF64748B), fontSize = 10.sp)
                            }
                            Text(unit.capabilities, color = Color(0xFF94A3B8), fontSize = 10.sp, modifier = Modifier.padding(bottom = 8.dp))
                            
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(bgColor, RoundedCornerShape(6.dp))
                                    .border(1.dp, fgColor.copy(alpha=0.3f), RoundedCornerShape(6.dp))
                                    .clickable { onCycleUnitStatus(unit.id) }
                                    .padding(6.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(unit.status.uppercase(), color = fgColor, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun PatientsTab(patients: List<Patient>) {
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF0F172A), RoundedCornerShape(12.dp)).padding(16.dp)) {
        Text("PATIENT TRACKING SYSTEM", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
        Text("Monitor triage status and transport destinations.", color = Color(0xFF94A3B8), fontSize = 14.sp)
        Spacer(modifier = Modifier.height(24.dp))
        
        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(patients) { p ->
                Row(
                    modifier = Modifier.fillMaxWidth().background(Color(0xFF020617), RoundedCornerShape(12.dp)).border(1.dp, Color(0xFF1E293B), RoundedCornerShape(12.dp)).padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(p.id, color = Color(0xFF60A5FA), fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text("Inc: ${p.incidentId}", color = Color(0xFF64748B), fontSize = 12.sp)
                    }
                    Column(modifier = Modifier.weight(2f)) {
                        Text(p.name, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Text(p.details, color = Color(0xFF94A3B8), fontSize = 14.sp)
                    }
                    Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.CenterStart) {
                        val color = if (p.condition == "Critical") Color(0xFFF87171) else Color(0xFFFACC15)
                        Text(p.condition, color = color, fontWeight = FontWeight.Bold, modifier = Modifier.background(color.copy(alpha=0.1f), RoundedCornerShape(4.dp)).padding(horizontal=8.dp, vertical=4.dp))
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text(p.unit, color = Color(0xFFE2E8F0), fontWeight = FontWeight.Bold)
                        Text(p.dest, color = Color(0xFF94A3B8), fontSize = 12.sp)
                    }
                }
            }
        }
    }
}

@Composable
fun CommsTab(messages: List<Message>, weatherAlerts: List<WeatherAlert>) {
    Row(modifier = Modifier.fillMaxSize().background(Color(0xFF0F172A), RoundedCornerShape(12.dp)).padding(16.dp)) {
        Column(modifier = Modifier.weight(2f).fillMaxHeight()) {
            Text("INTER-AGENCY COMMUNICATIONS", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(16.dp))
            LazyColumn(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(messages) { m ->
                    Column(modifier = Modifier.fillMaxWidth().background(Color(0xFF020617), RoundedCornerShape(8.dp)).border(1.dp, Color(0xFF1E293B), RoundedCornerShape(8.dp)).padding(12.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text(m.from, color = Color(0xFF60A5FA), fontWeight = FontWeight.Bold)
                            Text(m.time, color = Color(0xFF64748B), fontSize = 12.sp)
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(m.text, color = Color(0xFFE2E8F0))
                    }
                }
            }
        }
        Spacer(modifier = Modifier.width(24.dp))
        Column(modifier = Modifier.weight(1f).fillMaxHeight()) {
            Text("NWS WEATHER ALERTS", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(16.dp))
            LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(weatherAlerts) { w ->
                    Column(modifier = Modifier.fillMaxWidth().background(Color(0xFFEF4444).copy(alpha=0.1f), RoundedCornerShape(8.dp)).border(1.dp, Color(0xFFEF4444).copy(alpha=0.2f), RoundedCornerShape(8.dp)).padding(12.dp)) {
                        Text(w.title, color = Color(0xFFF87171), fontWeight = FontWeight.Bold)
                        Text(w.area, color = Color(0xFFE2E8F0), fontSize = 14.sp)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("Expires: ${w.expires}", color = Color(0xFF94A3B8), fontSize = 12.sp)
                    }
                }
            }
        }
    }
}
