package com.example

import android.content.Intent
import android.net.Uri
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircleOutline
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle

// Public safety dark mode palette
val ColorDarkBackground = Color(0xFF020617) // Slate 950
val ColorSurface = Color(0xFF0F172A) // Slate 900
val ColorSurfaceVariant = Color(0xFF1E293B) // Slate 800
val ColorPrimaryBlue = Color(0xFF2563EB)
val ColorSuccessGreen = Color(0xFF16A34A)
val ColorWarningYellow = Color(0xFFEAB308)
val ColorDangerRed = Color(0xFFDC2626)
val ColorTextMuted = Color(0xFF94A3B8)

@Composable
fun MobileResponderScreen(
    modifier: Modifier = Modifier,
    viewModel: OpenCadViewModel = androidx.lifecycle.viewmodel.compose.viewModel()
) {
    val unit by viewModel.unit.collectAsStateWithLifecycle()
    val incident by viewModel.incident.collectAsStateWithLifecycle()
    val logs by viewModel.logs.collectAsStateWithLifecycle()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(ColorDarkBackground)
            .padding(8.dp)
            .windowInsetsPadding(WindowInsets.systemBars)
    ) {
        HeaderSection(unit = unit)

        Spacer(modifier = Modifier.height(16.dp))

        Box(modifier = Modifier.weight(1.2f)) {
            if (incident != null) {
                IncidentSection(incident = incident!!)
            } else {
                StandbySection()
            }
        }

        Spacer(modifier = Modifier.height(16.dp))
        
        ChatSection(
            logs = logs,
            onSendMessage = { viewModel.sendChat(it) },
            modifier = Modifier.weight(1f)
        )

        Spacer(modifier = Modifier.height(16.dp))

        StatusGrid(
            currentStatus = unit.status,
            onStatusChange = { viewModel.updateStatus(it) }
        )
    }
}

@Composable
fun HeaderSection(unit: UnitState) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(ColorSurface, RoundedCornerShape(12.dp))
            .border(1.dp, ColorSurfaceVariant, RoundedCornerShape(12.dp))
            .padding(16.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = unit.callsign,
            color = Color.White,
            fontSize = 28.sp,
            fontWeight = FontWeight.Black
        )
        
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(12.dp)
                    .clip(CircleShape)
                    .background(ColorSuccessGreen)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "LINKED",
                color = ColorTextMuted,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
        }
    }
}

@Composable
fun StandbySection() {
    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = Icons.Default.CheckCircleOutline,
            contentDescription = "Standby",
            tint = ColorSurfaceVariant,
            modifier = Modifier.size(80.dp)
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "STANDING BY",
            color = Color.White,
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "Awaiting assignment from Dispatch",
            color = ColorTextMuted,
            fontSize = 16.sp
        )
    }
}

@Composable
fun IncidentSection(incident: Incident) {
    val context = LocalContext.current
    
    val bgColor by animateColorAsState(
        targetValue = Color(0xFF450a0a), // Dark Red
        animationSpec = infiniteRepeatable(
            animation = tween(1000),
            repeatMode = RepeatMode.Reverse
        ),
        label = "PulseBackground"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(bgColor, RoundedCornerShape(16.dp))
            .border(2.dp, ColorDangerRed, RoundedCornerShape(16.dp))
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Box(
                modifier = Modifier
                    .background(ColorDangerRed, RoundedCornerShape(16.dp))
                    .padding(horizontal = 12.dp, vertical = 4.dp)
            ) {
                Text(
                    text = "PRIORITY ${incident.priority}",
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp
                )
            }
            Text(
                text = incident.id,
                color = ColorTextMuted,
                fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                fontSize = 14.sp
            )
        }
        
        Spacer(modifier = Modifier.height(12.dp))
        
        Text(
            text = incident.nature.uppercase(),
            color = Color.White,
            fontSize = 32.sp,
            fontWeight = FontWeight.ExtraBold,
            lineHeight = 36.sp
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Text(
            text = incident.address,
            color = ColorWarningYellow,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold
        )
        
        Spacer(modifier = Modifier.weight(1f))
        
        Button(
            onClick = {
                val uri = Uri.parse("google.navigation:q=${Uri.encode(incident.address)}")
                val intent = Intent(Intent.ACTION_VIEW, uri)
                intent.setPackage("com.google.android.apps.maps")
                if (intent.resolveActivity(context.packageManager) != null) {
                    context.startActivity(intent)
                } else {
                    // Fallback to browser if maps not installed
                    val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.google.com/maps/search/?api=1&query=${Uri.encode(incident.address)}"))
                    context.startActivity(browserIntent)
                }
            },
            colors = ButtonDefaults.buttonColors(containerColor = ColorPrimaryBlue),
            modifier = Modifier
                .fillMaxWidth()
                .height(64.dp),
            shape = RoundedCornerShape(12.dp)
        ) {
            Icon(Icons.Default.Navigation, contentDescription = "Navigate", modifier = Modifier.size(28.dp))
            Spacer(modifier = Modifier.width(12.dp))
            Text("NAVIGATE", fontSize = 24.sp, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun ChatSection(logs: List<AuditLogEvent>, onSendMessage: (String) -> Unit, modifier: Modifier = Modifier) {
    var messageText by remember { mutableStateOf("") }
    
    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(ColorSurface, RoundedCornerShape(12.dp))
            .border(1.dp, ColorSurfaceVariant, RoundedCornerShape(12.dp))
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(ColorSurfaceVariant, RoundedCornerShape(topStart = 12.dp, topEnd = 12.dp))
                .padding(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(Icons.Default.Info, contentDescription = null, tint = ColorTextMuted, modifier = Modifier.size(16.dp))
            Spacer(modifier = Modifier.width(8.dp))
            Text("LIVE LOG & CHAT", color = ColorTextMuted, fontSize = 12.sp, fontWeight = FontWeight.Bold)
        }
        
        // Log List
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .padding(8.dp),
            reverseLayout = true
        ) {
            items(logs, key = { it.id }) { log ->
                val isChat = log.type == "CHAT"
                val isMe = log.unitId != "DISPATCH" && log.unitId != "SYS"
                
                if (isChat) {
                    Box(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                        Column(
                            modifier = Modifier
                                .align(if (isMe) Alignment.CenterEnd else Alignment.CenterStart)
                                .background(
                                    color = if (isMe) Color(0xFF1E3A8A) else ColorSurfaceVariant,
                                    shape = RoundedCornerShape(8.dp)
                                )
                                .padding(8.dp)
                                .widthIn(max = 250.dp)
                        ) {
                            Text(
                                text = log.unitId ?: "SYSTEM",
                                color = ColorTextMuted,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = log.body,
                                color = Color.White,
                                fontSize = 14.sp
                            )
                        }
                    }
                } else {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp)
                    ) {
                        Text(
                            text = "[${log.timestamp}]",
                            color = ColorTextMuted,
                            fontSize = 11.sp,
                            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "${log.unitId}: ${log.body.uppercase()}",
                            color = Color.LightGray,
                            fontSize = 11.sp,
                            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                        )
                    }
                }
            }
        }
        
        // Input box
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = messageText,
                onValueChange = { messageText = it },
                modifier = Modifier.weight(1f),
                placeholder = { Text("Type message...", color = ColorTextMuted) },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = ColorPrimaryBlue,
                    unfocusedBorderColor = ColorSurfaceVariant,
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White
                ),
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
                keyboardActions = KeyboardActions(onSend = {
                    onSendMessage(messageText)
                    messageText = ""
                }),
                singleLine = true,
                shape = RoundedCornerShape(24.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
            IconButton(
                onClick = {
                    onSendMessage(messageText)
                    messageText = ""
                },
                modifier = Modifier
                    .size(48.dp)
                    .background(ColorPrimaryBlue, CircleShape)
            ) {
                Icon(Icons.Default.Send, contentDescription = "Send", tint = Color.White)
            }
        }
    }
}

@Composable
fun StatusGrid(currentStatus: String, onStatusChange: (String) -> Unit) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            StatusButton(
                text = "EN ROUTE",
                isActive = currentStatus == "En Route",
                activeColor = ColorPrimaryBlue,
                onClick = { onStatusChange("En Route") },
                modifier = Modifier.weight(1f)
            )
            
            StatusButton(
                text = "ON SCENE",
                isActive = currentStatus == "On Scene",
                activeColor = ColorDangerRed,
                onClick = { onStatusChange("On Scene") },
                modifier = Modifier.weight(1f)
            )
        }
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Button(
            onClick = { onStatusChange("Available") },
            colors = ButtonDefaults.buttonColors(containerColor = ColorSuccessGreen),
            modifier = Modifier
                .fillMaxWidth()
                .height(64.dp),
            shape = RoundedCornerShape(12.dp)
        ) {
            Text("CLEAR & AVAILABLE", fontSize = 20.sp, fontWeight = FontWeight.Black)
        }
    }
}

@Composable
fun StatusButton(
    text: String,
    isActive: Boolean,
    activeColor: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Button(
        onClick = onClick,
        colors = ButtonDefaults.buttonColors(
            containerColor = if (isActive) activeColor else ColorSurfaceVariant
        ),
        modifier = modifier.height(80.dp),
        shape = RoundedCornerShape(12.dp),
        border = if (isActive) androidx.compose.foundation.BorderStroke(2.dp, Color.White) else null
    ) {
        Text(
            text = text,
            fontSize = 20.sp,
            fontWeight = FontWeight.Black,
            color = if (isActive) Color.White else ColorTextMuted,
            textAlign = TextAlign.Center
        )
    }
}
