package com.api.nature_harvest_backend.exceptions;

public class ExpiredTokenException extends Exception{
    public ExpiredTokenException(String message) {
        super(message);
    }
}
