package com.example.backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")

public class MerchController {

    @GetMapping("/api/data")
    public String getData() {
        return "Merchandise endpoint";
    }
}