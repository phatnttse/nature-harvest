package com.api.nature_harvest_backend.exceptions;

public class InvalidPasswordException extends Exception{
    public InvalidPasswordException(String message) {
        super(message);
    }
}
