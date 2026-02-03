# Stage 1: Build the application with Maven
FROM maven:3.9.9-eclipse-temurin-17 AS builder

# Set working directory inside container
WORKDIR /app

# Copy Maven config first to cache dependencies
COPY pom.xml .

# Download dependencies (cache step)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Package the application (skip tests for faster builds)
RUN mvn clean package -DskipTests

# Stage 2: Create a lightweight runtime image
FROM eclipse-temurin:17.0.15_6-jre

# Set working directory
WORKDIR /app

# Copy the built jar from builder stage
COPY --from=builder /app/target/back-end-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
