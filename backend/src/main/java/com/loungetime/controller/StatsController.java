package com.loungetime.controller;

import com.loungetime.service.StatsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 휴식 통계 REST 엔드포인트.
 */
@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping
    public Map<String, Long> stats() {
        return Map.of("restCount", statsService.getRestCount());
    }

    @PostMapping("/rest")
    public Map<String, Long> recordRest() {
        return Map.of("restCount", statsService.incrementRest());
    }
}
