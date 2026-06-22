package com.loungetime.controller;

import com.loungetime.model.Message;
import com.loungetime.service.ChatService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 익명 라운지 채팅 REST 엔드포인트.
 */
@RestController
@RequestMapping("/api/messages")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping
    public List<Message> list() {
        return chatService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Message create(@Valid @RequestBody NewMessageRequest request) {
        return chatService.add(request.user(), request.text());
    }

    /**
     * 메시지 생성 요청 본문.
     *
     * @param user 작성자(선택)
     * @param text 본문(필수, 최대 100자)
     */
    public record NewMessageRequest(
            String user,
            @NotBlank @Size(max = 100) String text
    ) {
    }
}
