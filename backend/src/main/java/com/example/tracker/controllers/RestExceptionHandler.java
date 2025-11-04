package com.example.tracker.controllers;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@ControllerAdvice
public class RestExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntime(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", ex.getMessage()));
    }
}
