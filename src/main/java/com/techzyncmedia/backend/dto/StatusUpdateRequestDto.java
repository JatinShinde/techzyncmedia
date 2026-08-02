package com.techzyncmedia.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class StatusUpdateRequestDto {
    @NotBlank(message = "Status cannot be blank")
    private String status;

    public StatusUpdateRequestDto() {}

    public StatusUpdateRequestDto(String status) {
        this.status = status;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
