package com.project.back_end.DTO;

public class Login {

    private String identifier; // email for Doctor/Patient, username for Admin
    private String password;

    // Default constructor
    public Login() {
    }

    // Getter and Setter for identifier
    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    // Getter and Setter for password
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
