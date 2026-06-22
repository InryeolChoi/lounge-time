package com.loungetime.service;

import com.loungetime.model.Message;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ChatServiceTest {

    @Test
    void seedsInitialMessages() {
        ChatService service = new ChatService();
        assertThat(service.findAll()).hasSize(4);
    }

    @Test
    void addsMessageWithGeneratedFields() {
        ChatService service = new ChatService();

        Message message = service.add("You_1", "hello");

        assertThat(message.id()).isNotBlank();
        assertThat(message.user()).isEqualTo("You_1");
        assertThat(message.text()).isEqualTo("hello");
        assertThat(message.timestamp()).matches("\\d{2}:\\d{2}");
        assertThat(service.findAll()).hasSize(5);
    }

    @Test
    void defaultsBlankUserToAnonymous() {
        ChatService service = new ChatService();

        Message message = service.add("   ", "hi");

        assertThat(message.user()).isEqualTo("Anonymous");
    }

    @Test
    void trimsText() {
        ChatService service = new ChatService();

        Message message = service.add("u", "  spaced  ");

        assertThat(message.text()).isEqualTo("spaced");
    }
}
