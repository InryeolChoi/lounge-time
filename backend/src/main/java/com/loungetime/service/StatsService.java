package com.loungetime.service;

import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicLong;

/**
 * 누적 휴식 완료 횟수를 관리하는 서비스(스레드 안전).
 */
@Service
public class StatsService {

    private final AtomicLong restCount = new AtomicLong(0);

    /**
     * 현재 누적 휴식 완료 수를 반환한다.
     */
    public long getRestCount() {
        return restCount.get();
    }

    /**
     * 휴식 완료 1회를 기록하고 갱신된 누적 수를 반환한다.
     */
    public long incrementRest() {
        return restCount.incrementAndGet();
    }
}
