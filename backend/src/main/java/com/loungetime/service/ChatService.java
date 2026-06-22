package com.loungetime.service;

import com.loungetime.model.Message;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 익명 라운지 채팅 메시지를 메모리에 보관하는 서비스(스레드 안전).
 */
@Service
public class ChatService {

    private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("HH:mm");

    private final List<Message> messages = new CopyOnWriteArrayList<>();
    private final AtomicLong sequence = new AtomicLong(0);

    public ChatService() {
        seed("User_A92", "아, 휴식이 정말 필요해...", "14:23");
        seed("User_B45", "여기 너무 편하네요 😌", "14:25");
        seed("User_C78", "이 카페 분위기 정말 좋다", "14:27");
        seed("User_D31", "3분이 순식간이네", "14:28");
    }

    private void seed(String user, String text, String time) {
        messages.add(new Message("s" + sequence.incrementAndGet(), user, text, time));
    }

    /**
     * 모든 메시지를 시간순(추가 순)으로 반환한다.
     */
    public List<Message> findAll() {
        return List.copyOf(messages);
    }

    /**
     * 새 메시지를 추가하고 생성된 메시지를 반환한다.
     *
     * @param user 작성자(공백이면 "Anonymous")
     * @param text 본문
     */
    public Message add(String user, String text) {
        String name = (user == null || user.isBlank()) ? "Anonymous" : user.trim();
        Message message = new Message(
                "m" + sequence.incrementAndGet(),
                name,
                text.trim(),
                LocalTime.now().format(TIME)
        );
        messages.add(message);
        return message;
    }
}
