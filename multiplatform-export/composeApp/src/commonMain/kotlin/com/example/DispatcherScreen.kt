package com.example

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

// Data Models
data class MIncident(val id: String, val scope: String, val type: String, val location: String, val sev: Int, val units: Int, val updated: String)
data class MResponder(val name: String, val handle: String, val type: String, val status: String, val assigned: String)
data class MFacility(val name: String, val type: String, val status: String, val hours: String)

val MOCK_INCIDENTS = listOf(
    MIncident("11", "11/TBD", "examp2", "Bloomington City Hall...", 1, 0, "3/16 12:57 AM"),
    MIncident("15", "My summary", "examp1", "Park Ave S Minneapolis", 0, 0, "3/19 02:59 PM"),
    MIncident("19", "Fire Alarm", "AlarmAct", "Eagan", 0, 1, "3/17 09:58 PM")
)

val MOCK_RESPONDERS = listOf(
    MResponder("Engine 2", "E2", "example", "", "1"),
    MResponder("Test Unit 1", "TU1", "example", "available", "1"),
    MResponder("CERT Team A", "CTA", "", "", "0")
)

val MOCK_FACILITIES = listOf(
    MFacility("Bloomington Civic Plaza", "ICC", "Open", "00:00-23:59"),
    MFacility("Community Center", "ICC", "", "-")
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DispatcherScreen() {
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF0F172A))) {
        
        // TOP NAVBAR
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF1E293B))
                .border(1.dp, Color(0xFF334155))
                .padding(horizontal = 16.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Warning, contentDescription = "Logo", tint = Color(0xFF3B82F6), modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("OpenCAD ", color = Color.White, fontWeight = FontWeight.Bold)
                Text("v4.0.0-dev", color = Color(0xFF94A3B8), fontSize = 12.sp)
            }
            
            val timeFormat = SimpleDateFormat("HH:mm:ss", Locale.getDefault())
            Text(timeFormat.format(Date()), color = Color(0xFFCBD5E1), fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace)
        }

        // TOOLBAR SCROLLABLE
        Row(modifier = Modifier.fillMaxWidth().background(Color(0xFF0F172A)).border(1.dp, Color(0xFF1E293B)).padding(8.dp)) {
            val tabs = listOf("Situation", "New", "Units", "Fac's", "Search", "Personnel", "Reports")
            tabs.forEach { tab ->
                val color = if(tab == "Situation") Color.White else Color(0xFF94A3B8)
                val bg = if(tab == "Situation") Color(0xFF334155) else Color.Transparent
                Text(
                    tab, 
                    color = color, 
                    fontSize = 12.sp, 
                    modifier = Modifier.background(bg).padding(horizontal=8.dp, vertical=4.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
            }
        }

        // CONTENT (Adapting for Android smaller screen, using vertical scrollable list of widgets)
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // Stats
            item {
                WidgetContainer(title = "Statistics", icon = Icons.Default.Info) {
                    Row(modifier = Modifier.fillMaxWidth().padding(8.dp), horizontalArrangement = Arrangement.SpaceEvenly) {
                        StatItem("12", "OPEN", Color.White)
                        StatItem("10", "UNASSIGNED", Color(0xFFF87171))
                        StatItem("2", "DISPATCHED", Color.White)
                    }
                }
            }

            // Map Placeholder
            item {
                WidgetContainer(title = "Map", icon = Icons.Default.Place) {
                    Box(modifier = Modifier.fillMaxWidth().height(200.dp).background(Color(0xFFF1F5F9)), contentAlignment = Alignment.Center) {
                        Text("Live OSM Map\n(Requires Maps SDK on Android)", color = Color.DarkGray, textAlign = TextAlign.Center)
                    }
                }
            }

            // Incidents
            item {
                WidgetContainer(title = "Incidents", icon = Icons.Default.Warning) {
                    Column {
                        Row(modifier = Modifier.fillMaxWidth().background(Color(0xFF1E293B)).padding(8.dp)) {
                            Text("ID", color = Color(0xFF94A3B8), fontSize = 10.sp, modifier = Modifier.weight(0.5f))
                            Text("TYPE", color = Color(0xFF94A3B8), fontSize = 10.sp, modifier = Modifier.weight(1f))
                            Text("LOCATION", color = Color(0xFF94A3B8), fontSize = 10.sp, modifier = Modifier.weight(2f))
                        }
                        MOCK_INCIDENTS.forEach { inc ->
                            Row(modifier = Modifier.fillMaxWidth().padding(8.dp).border(bottom = 1.dp, color = Color(0xFF334155))) {
                                Text(inc.id, color = Color(0xFF60A5FA), fontSize = 12.sp, modifier = Modifier.weight(0.5f))
                                Text(inc.type, color = Color.White, fontSize = 12.sp, modifier = Modifier.weight(1f))
                                Text(inc.location, color = Color.White, fontSize = 12.sp, modifier = Modifier.weight(2f))
                            }
                        }
                    }
                }
            }

            // Responders
            item {
                WidgetContainer(title = "Responders", icon = Icons.Default.Person) {
                    Column {
                        Row(modifier = Modifier.fillMaxWidth().background(Color(0xFF1E293B)).padding(8.dp)) {
                            Text("NAME", color = Color(0xFF94A3B8), fontSize = 10.sp, modifier = Modifier.weight(1.5f))
                            Text("HANDLE", color = Color(0xFF94A3B8), fontSize = 10.sp, modifier = Modifier.weight(1f))
                            Text("STATUS", color = Color(0xFF94A3B8), fontSize = 10.sp, modifier = Modifier.weight(1f))
                        }
                        MOCK_RESPONDERS.forEach { res ->
                            Row(modifier = Modifier.fillMaxWidth().padding(8.dp).border(bottom = 1.dp, color = Color(0xFF334155))) {
                                Text(res.name, color = Color.White, fontSize = 12.sp, modifier = Modifier.weight(1.5f))
                                Text(res.handle, color = Color.White, fontSize = 12.sp, modifier = Modifier.weight(1f))
                                Text(res.status, color = Color.White, fontSize = 12.sp, modifier = Modifier.weight(1f))
                            }
                        }
                    }
                }
            }

            // Facilities
            item {
                WidgetContainer(title = "Facilities", icon = Icons.Default.Home) {
                    Column {
                        Row(modifier = Modifier.fillMaxWidth().background(Color(0xFF1E293B)).padding(8.dp)) {
                            Text("NAME", color = Color(0xFF94A3B8), fontSize = 10.sp, modifier = Modifier.weight(2f))
                            Text("STATUS", color = Color(0xFF94A3B8), fontSize = 10.sp, modifier = Modifier.weight(1f))
                        }
                        MOCK_FACILITIES.forEach { fac ->
                            Row(modifier = Modifier.fillMaxWidth().padding(8.dp).border(bottom = 1.dp, color = Color(0xFF334155))) {
                                Text(fac.name, color = Color(0xFF60A5FA), fontSize = 12.sp, modifier = Modifier.weight(2f))
                                Text(fac.status, color = Color.White, fontSize = 12.sp, modifier = Modifier.weight(1f))
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun WidgetContainer(title: String, icon: androidx.compose.ui.graphics.vector.ImageVector, content: @Composable () -> Unit) {
    Column(modifier = Modifier.fillMaxWidth().background(Color(0xFF1E293B)).border(1.dp, Color(0xFF334155))) {
        Row(modifier = Modifier.fillMaxWidth().background(Color(0xFF0F172A)).padding(horizontal = 8.dp, vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(icon, contentDescription = null, tint = Color(0xFFCBD5E1), modifier = Modifier.size(14.dp))
            Spacer(modifier = Modifier.width(6.dp))
            Text(title, color = Color(0xFFCBD5E1), fontSize = 12.sp, fontWeight = FontWeight.Bold)
        }
        content()
    }
}

@Composable
fun StatItem(value: String, label: String, color: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, color = color, fontSize = 20.sp, fontWeight = FontWeight.Bold)
        Text(label, color = Color(0xFF94A3B8), fontSize = 10.sp, fontWeight = FontWeight.Bold)
    }
}

// Helper for border bottom (simplified)
fun Modifier.border(bottom: androidx.compose.ui.unit.Dp, color: Color) = this.border(bottom, color, androidx.compose.ui.graphics.RectangleShape)
