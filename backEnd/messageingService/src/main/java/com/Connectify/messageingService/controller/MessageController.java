package com.Connectify.messageingService.controller;

import com.Connectify.messageingService.Entity.Message;
import com.Connectify.messageingService.dao.MessageRepository;
import com.Connectify.messageingService.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private MessageRepository messageRepository;

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestParam String senderId, @RequestParam String senderZoneId, @RequestParam String receiverId, @RequestParam String content) {
        ZoneId zoneId = ZoneId.of(senderZoneId);
        Message message = messageService.sendMessage(senderId, zoneId, receiverId, content);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/unread/{receiverId}")
    public ResponseEntity<List<Message>> getUnreadMessages(@PathVariable String receiverId) {
        List<Message> unreadMessages = messageService.getUnreadMessages(receiverId);
        return ResponseEntity.ok(unreadMessages);
    }

    @PutMapping("/mark-as-read")
    public ResponseEntity<Void> markMessagesAsRead(@RequestBody List<String> messageIds) {
        List<Message> messages = messageRepository.findAllById(messageIds);
        messageService.markMessagesAsRead(messages);
        return ResponseEntity.ok().build();
    }
}

