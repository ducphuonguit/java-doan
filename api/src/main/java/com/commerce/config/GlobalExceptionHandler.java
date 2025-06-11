package com.commerce.config;


import com.commerce.model.exception.AppException;
import com.commerce.model.exception.ErrorCode;
import com.commerce.model.exception.ErrorDTO;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ErrorDTO> handleAppException(AppException e) {
        ErrorDTO errorDTO = new ErrorDTO(e.getErrorCode(), e.getMessageParams());
        HttpStatusCode httpStatus = e.getErrorCode().getHttpStatus();
        return new ResponseEntity<>(errorDTO, httpStatus);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorDTO> handleBadCredentialsException(BadCredentialsException e) {
        ErrorDTO errorDTO = new ErrorDTO(ErrorCode.INVALID_CREDENTIALS, null);
        return ResponseEntity.status(ErrorCode.INVALID_CREDENTIALS.getHttpStatus()).body(errorDTO);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ErrorDTO> handleExpiredJwtException(ExpiredJwtException e) {
        ErrorDTO errorDTO = new ErrorDTO(ErrorCode.TOKEN_EXPIRED, null);
        return ResponseEntity.status(ErrorCode.TOKEN_EXPIRED.getHttpStatus()).body(errorDTO);
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<ErrorDTO> handleAuthorizationDeniedException(AuthorizationDeniedException exception) {
        ErrorDTO errorDTO = new ErrorDTO(ErrorCode.ACCESS_DENIED, null);
        return ResponseEntity.status(ErrorCode.ACCESS_DENIED.getHttpStatus()).body(errorDTO);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDTO> handleGenericException(Exception e) {
        ErrorDTO errorDTO = new ErrorDTO(ErrorCode.INTERNAL_SERVER_ERROR, null);
        return ResponseEntity.status(ErrorCode.INTERNAL_SERVER_ERROR.getHttpStatus()).body(errorDTO);
    }
}