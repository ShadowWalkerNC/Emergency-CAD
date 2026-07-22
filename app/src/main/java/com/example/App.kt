package com.example

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Monitor
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun App() {
    var role by remember { mutableStateOf("SELECT") }

    MaterialTheme {
        Surface(modifier = Modifier.fillMaxSize()) {
            when (role) {
                "FIELD" -> MobileResponderScreen()
                "DISPATCH" -> DispatcherScreen()
                else -> {
                    Column(
                        modifier = Modifier.fillMaxSize().background(Color(0xFF020617)),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Text("OpenCAD Platform", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                        Text("Select your operational environment", color = Color(0xFF94A3B8), fontSize = 14.sp)
                        Spacer(modifier = Modifier.height(32.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                            Column(
                                modifier = Modifier
                                    .width(200.dp)
                                    .background(Color(0xFF0F172A), RoundedCornerShape(16.dp))
                                    .clickable { role = "DISPATCH" }
                                    .padding(24.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Icon(Icons.Default.Monitor, contentDescription = null, tint = Color.White, modifier = Modifier.size(48.dp))
                                Spacer(modifier = Modifier.height(16.dp))
                                Text("Dispatcher Console", color = Color.White, fontWeight = FontWeight.Bold)
                                Text("Training Simulator", color = Color(0xFF94A3B8), fontSize = 12.sp)
                            }
                            Column(
                                modifier = Modifier
                                    .width(200.dp)
                                    .background(Color(0xFF0F172A), RoundedCornerShape(16.dp))
                                    .clickable { role = "FIELD" }
                                    .padding(24.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Icon(Icons.Default.Phone, contentDescription = null, tint = Color.White, modifier = Modifier.size(48.dp))
                                Spacer(modifier = Modifier.height(16.dp))
                                Text("Mobile Responder", color = Color.White, fontWeight = FontWeight.Bold)
                                Text("Field MDT", color = Color(0xFF94A3B8), fontSize = 12.sp)
                            }
                        }
                    }
                }
            }
        }
    }
}
