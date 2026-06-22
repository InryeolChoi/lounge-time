package com.loungetime.model;

/**
 * 라운지 채팅 메시지(불변).
 *
 * @param id        고유 식별자
 * @param user      작성자 표시 이름
 * @param text      메시지 본문
 * @param timestamp 표시용 시간 문자열("HH:mm")
 */
public record Message(String id, String user, String text, String timestamp) {
}
