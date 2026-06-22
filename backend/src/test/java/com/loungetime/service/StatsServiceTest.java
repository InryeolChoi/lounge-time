package com.loungetime.service;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class StatsServiceTest {

    @Test
    void startsAtZero() {
        StatsService service = new StatsService();
        assertThat(service.getRestCount()).isZero();
    }

    @Test
    void incrementsRestCount() {
        StatsService service = new StatsService();

        assertThat(service.incrementRest()).isEqualTo(1);
        assertThat(service.incrementRest()).isEqualTo(2);
        assertThat(service.getRestCount()).isEqualTo(2);
    }
}
